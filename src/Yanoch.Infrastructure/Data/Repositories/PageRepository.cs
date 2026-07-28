using Microsoft.EntityFrameworkCore;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;
using Yanoch.Infrastructure.Data;

namespace Yanoch.Infrastructure.Data.Repositories;

public class PageRepository : IPageRepository
{
    private readonly AppDbContext _db;

    public PageRepository(AppDbContext db) => _db = db;

    public async Task<Page?> GetByIdAsync(Guid id, Guid userId) =>
        await _db.Pages
            .AsNoTracking()
            .Include(p => p.PageTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Backlinks).ThenInclude(b => b.SourcePage)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    /// <summary>
    /// Loads a page with tracking (no AsNoTracking) and NO navigation includes.
    /// Use this before write operations (SoftDelete, Restore, Update) to avoid
    /// EF Core cascading detached navigation graphs onto already-tracked entities,
    /// which causes InvalidOperationException tracking conflicts and crashes.
    /// </summary>
    public async Task<Page?> GetByIdTrackedAsync(Guid id, Guid userId) =>
        await _db.Pages
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    /// <summary>
    /// Tracked load with PageTags (and their Tags) included, but without Backlinks.
    /// Backlinks include SourcePage navigation which can reference other pages that
    /// are already tracked in the context, causing tracking conflicts on attach.
    /// Use for updates that need to modify PageTags collections.
    /// </summary>
    public async Task<Page?> GetByIdTrackedWithTagsAsync(Guid id, Guid userId) =>
        await _db.Pages
            .Include(p => p.PageTags).ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    /// <summary>
    /// Like GetByIdTrackedAsync but ignores the global soft-delete query filter
    /// so it can load pages regardless of IsDeleted status.
    /// No navigation includes — scalar properties only.
    /// </summary>
    public async Task<Page?> GetByIdIncludingDeletedTrackedAsync(Guid id, Guid userId) =>
        await _db.Pages
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public async Task<Page?> GetByIdIncludingDeletedAsync(Guid id, Guid userId) =>
        await _db.Pages
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Include(p => p.PageTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.Backlinks).ThenInclude(b => b.SourcePage)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public async Task<IEnumerable<Page>> GetByParentAsync(Guid? parentId, Guid userId) =>
        await _db.Pages.AsNoTracking().Where(p => p.ParentPageId == parentId && p.UserId == userId).OrderBy(p => p.SortOrder).ThenBy(p => p.CreatedAt).ToListAsync();

    public async Task<IEnumerable<Page>> GetRootPagesAsync(Guid userId) =>
        await _db.Pages.AsNoTracking().Where(p => p.ParentPageId == null && p.UserId == userId).OrderBy(p => p.SortOrder).ThenBy(p => p.CreatedAt).ToListAsync();

    public async Task<IEnumerable<Page>> SearchAsync(string query, Guid userId)
    {
        var q = query.ToLower();
        return await _db.Pages.AsNoTracking().Where(p => p.UserId == userId && (p.Title.ToLower().Contains(q) || (p.Content != null && p.Content.ToLower().Contains(q))))
            .OrderByDescending(p => p.UpdatedAt).Take(20).ToListAsync();
    }

    public async Task<Page> CreateAsync(Page page) { _db.Pages.Add(page); await _db.SaveChangesAsync(); return page; }

    public async Task UpdateAsync(Page page)
    {
        // Entity is already tracked (loaded via GetByIdTrackedWithTagsAsync),
        // so EF auto-detects changes. Mark Modified to force update of all
        // scalar properties even if they haven't changed (e.g. UpdatedAt).
        _db.Entry(page).State = EntityState.Modified;
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Page page) => await SoftDeleteAsync(page);

    public async Task SoftDeleteAsync(Page page)
    {
        var now = DateTime.UtcNow;
        page.IsDeleted = true;
        page.DeletedAt = now;
        page.UpdatedAt = now;

        await SoftDeleteChildrenRecursiveAsync(page.Id, page.UserId, now);
        await _db.SaveChangesAsync();
    }

    private async Task SoftDeleteChildrenRecursiveAsync(Guid parentId, Guid userId, DateTime now)
    {
        var children = await _db.Pages
            .IgnoreQueryFilters()
            .Where(p => p.ParentPageId == parentId && p.UserId == userId && !p.IsDeleted)
            .ToListAsync();

        foreach (var child in children)
        {
            child.IsDeleted = true;
            child.DeletedAt = now;
            _db.Entry(child).State = EntityState.Modified;
            await SoftDeleteChildrenRecursiveAsync(child.Id, userId, now);
        }
    }

    public async Task HardDeleteAsync(Page page)
    {
        await HardDeleteRecursiveAsync(page.Id, page.UserId);
        await _db.SaveChangesAsync();
    }

    private async Task HardDeleteRecursiveAsync(Guid pageId, Guid userId)
    {
        var children = await _db.Pages
            .IgnoreQueryFilters()
            .Where(p => p.ParentPageId == pageId && p.UserId == userId)
            .ToListAsync();

        foreach (var child in children)
        {
            await HardDeleteRecursiveAsync(child.Id, userId);
        }

        var backlinks = await _db.Backlinks
            .Where(b => b.SourcePageId == pageId || b.TargetPageId == pageId)
            .ToListAsync();
        _db.Backlinks.RemoveRange(backlinks);

        var targetPage = await _db.Pages
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (targetPage != null)
        {
            _db.Pages.Remove(targetPage);
        }
    }

    public async Task RestoreAsync(Page page)
    {
        page.IsDeleted = false;
        page.DeletedAt = null;

        await RestoreChildrenRecursiveAsync(page.Id, page.UserId);
        await _db.SaveChangesAsync();
    }

    private async Task RestoreChildrenRecursiveAsync(Guid parentId, Guid userId)
    {
        var children = await _db.Pages
            .IgnoreQueryFilters()
            .Where(p => p.ParentPageId == parentId && p.UserId == userId && p.IsDeleted)
            .ToListAsync();

        foreach (var child in children)
        {
            child.IsDeleted = false;
            child.DeletedAt = null;
            _db.Entry(child).State = EntityState.Modified;
            await RestoreChildrenRecursiveAsync(child.Id, userId);
        }
    }

    public async Task<IEnumerable<Page>> GetSubtreeIncludingDeletedAsync(Guid id, Guid userId)
    {
        var result = new List<Page>();
        var root = await _db.Pages
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (root == null) return result;

        result.Add(root);
        await CollectSubtreeRecursiveAsync(root.Id, userId, result);
        return result;
    }

    private async Task CollectSubtreeRecursiveAsync(Guid parentId, Guid userId, List<Page> accumulator)
    {
        var children = await _db.Pages
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Where(p => p.ParentPageId == parentId && p.UserId == userId)
            .ToListAsync();

        foreach (var child in children)
        {
            accumulator.Add(child);
            await CollectSubtreeRecursiveAsync(child.Id, userId, accumulator);
        }
    }

    public async Task<IEnumerable<Page>> GetDeletedAsync(Guid userId) =>
        await _db.Pages
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Where(p => p.UserId == userId && p.IsDeleted)
            .OrderByDescending(p => p.DeletedAt)
            .ToListAsync();

    public async Task<IEnumerable<Page>> GetRecentAsync(Guid userId, int count = 10) =>
        await _db.Pages.AsNoTracking().Where(p => p.UserId == userId).OrderByDescending(p => p.UpdatedAt).Take(count).ToListAsync();

    public async Task<string?> GetContentAsync(Guid pageId, Guid userId)
    {
        var page = await _db.Pages.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);
        return page?.Content;
    }

    public async Task SetContentAsync(Guid pageId, string content)
    {
        await _db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Pages\" SET \"Content\" = {0}, \"UpdatedAt\" = {1} WHERE \"Id\" = {2}",
            content, DateTime.UtcNow, pageId);
    }
}
