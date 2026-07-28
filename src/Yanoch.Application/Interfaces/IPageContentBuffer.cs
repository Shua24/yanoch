using System;
using System.Threading.Tasks;

namespace Yanoch.Application.Interfaces;

/// <summary>
/// In-memory buffer for page content changes with dirty-flag debouncing.
/// Batches rapid keystrokes into a single DB write after 500ms of inactivity.
/// Flushes unsaved changes on page unload/navigation via explicit FlushAsync.
/// </summary>
public interface IPageContentBuffer
{
    /// <summary>
    /// Buffers a content change for the given page. Marks dirty and starts/resets
    /// a 500ms debounce timer. The actual DB write happens when the timer fires
    /// or when <see cref="FlushAsync"/> is called explicitly.
    /// </summary>
    Task BufferContentAsync(Guid pageId, Guid userId, string content, string? title = null);

    /// <summary>
    /// Immediately persists any buffered changes for the given page. Called on
    /// page unload, navigation away, or explicit save. Clears the dirty flag on success.
    /// </summary>
    Task FlushAsync(Guid pageId, Guid userId);

    /// <summary>
    /// Checks if a page has unsaved (dirty) buffered changes.
    /// </summary>
    Task<bool> IsDirtyAsync(Guid pageId, Guid userId);

    /// <summary>
    /// Removes the page from the buffer without saving. Used on hard delete/discard.
    /// </summary>
    Task ClearAsync(Guid pageId, Guid userId);
}