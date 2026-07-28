using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Yanoch.Application.Interfaces;
using Yanoch.Domain.Models;

namespace Yanoch.Application.Services;

/// <summary>
/// In-memory content buffer with dirty-flag debouncing.
/// Single-threaded via Timer; all mutations serialized through the concurrent dictionary.
/// </summary>
public sealed class PageContentBuffer : IPageContentBuffer, IDisposable
{
    private sealed class BufferedEntry
    {
        public Guid PageId { get; init; }
        public Guid UserId { get; init; }
        public string Content { get; set; } = "";
        public string? Title { get; set; }
        public bool IsDirty { get; set; }
        public Timer? DebounceTimer { get; set; }
        public DateTime LastModified { get; set; } = DateTime.UtcNow;
    }
    private readonly ConcurrentDictionary<(Guid PageId, Guid UserId), BufferedEntry> _buffers = new();
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _debounceDelay = TimeSpan.FromMilliseconds(500);
    private bool _disposed;

    public PageContentBuffer(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task BufferContentAsync(Guid pageId, Guid userId, string content, string? title = null)
    {
        if (_disposed) return Task.CompletedTask;

        var key = (pageId, userId);
        var entry = _buffers.GetOrAdd(key, _ => new BufferedEntry { PageId = pageId, UserId = userId });

        lock (entry)
        {
            entry.Content = content;
            entry.Title = title;
            entry.IsDirty = true;
            entry.LastModified = DateTime.UtcNow;

            // Reset debounce timer
            entry.DebounceTimer?.Dispose();
            entry.DebounceTimer = new Timer(
                async _ => await FlushEntryAsync(key, entry),
                null,
                _debounceDelay,
                Timeout.InfiniteTimeSpan);
        }

        return Task.CompletedTask;
    }

    public async Task FlushAsync(Guid pageId, Guid userId)
    {
        if (_disposed) return;

        var key = (pageId, userId);
        if (_buffers.TryGetValue(key, out var entry))
        {
            await FlushEntryAsync(key, entry);
        }
    }

    private async Task FlushEntryAsync((Guid PageId, Guid UserId) key, BufferedEntry entry)
    {
        if (!entry.IsDirty) return;

        Timer? timerToDispose = null;
        lock (entry)
        {
            if (!entry.IsDirty) return;
            timerToDispose = entry.DebounceTimer;
            entry.DebounceTimer = null;
            entry.IsDirty = false;
        }

        timerToDispose?.Dispose();

        try
        {
            // Resolve page service from a new scope so we don't capture
            // a transient instance that outlives its owning scope.
            using var scope = _serviceProvider.CreateScope();
            var pageService = scope.ServiceProvider.GetRequiredService<IPageService>();
            await pageService.SetContentAsync(entry.PageId, entry.Content);
        }
        catch
        {
            // Re-mark as dirty so it can be retried on the next flush cycle
            lock (entry)
            {
                entry.IsDirty = true;
            }
            throw;
        }
    }

    public Task<bool> IsDirtyAsync(Guid pageId, Guid userId)
    {
        if (_disposed) return Task.FromResult(false);

        var key = (pageId, userId);
        if (_buffers.TryGetValue(key, out var entry))
        {
            lock (entry)
            {
                return Task.FromResult(entry.IsDirty);
            }
        }
        return Task.FromResult(false);
    }

    public Task ClearAsync(Guid pageId, Guid userId)
    {
        if (_disposed) return Task.CompletedTask;

        var key = (pageId, userId);
        if (_buffers.TryRemove(key, out var entry))
        {
            entry.DebounceTimer?.Dispose();
        }
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;

        foreach (var entry in _buffers.Values)
        {
            entry.DebounceTimer?.Dispose();
        }
        _buffers.Clear();
    }
}