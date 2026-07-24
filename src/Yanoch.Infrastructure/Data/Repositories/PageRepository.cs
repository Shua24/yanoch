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
            .Include(p => p.Blocks.OrderBy(b => b.SortOrder))
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
        return await _db.Pages.AsNoTracking().Where(p => p.UserId == userId && (p.Title.ToLower().Contains(q) || p.Blocks.Any(b => b.Content.ToLower().Contains(q))))
            .OrderByDescending(p => p.UpdatedAt).Take(20).ToListAsync();
    }

    public async Task<Page> CreateAsync(Page page) { _db.Pages.Add(page); await _db.SaveChangesAsync(); return page; }

    public async Task UpdateAsync(Page page)
    {
        _db.Entry(page).State = EntityState.Modified;
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Page page) { page.IsDeleted = true; page.DeletedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }

    public async Task<IEnumerable<Page>> GetRecentAsync(Guid userId, int count = 10) =>
        await _db.Pages.AsNoTracking().Where(p => p.UserId == userId).OrderByDescending(p => p.UpdatedAt).Take(count).ToListAsync();

    public async Task ReplaceBlocksAsync(Guid pageId, List<Block> newBlocks)
    {
        var oldBlocks = await _db.Blocks.Where(b => b.PageId == pageId && !b.IsDeleted).ToListAsync();
        foreach (var ob in oldBlocks)
            ob.IsDeleted = true;

        foreach (var block in newBlocks)
        {
            block.Id = Guid.NewGuid();
            block.PageId = pageId;
            _db.Blocks.Add(block);
        }

        // Touch UpdatedAt on the page so it reflects the change
        var page = await _db.Pages.FindAsync(pageId);
        if (page != null)
        {
            page.UpdatedAt = DateTime.UtcNow;
            _db.Entry(page).State = EntityState.Modified;
        }

        await _db.SaveChangesAsync();
    }

    public async Task UpdateBlocksAsync(Guid pageId, List<Block> updatedBlocks)
    {
        // Update blocks in place — preserve IDs so component state stays valid
        var existingBlocks = await _db.Blocks
            .Where(b => b.PageId == pageId && !b.IsDeleted)
            .ToListAsync();

        var existingById = existingBlocks.ToDictionary(b => b.Id);

        foreach (var updated in updatedBlocks)
        {
            if (updated.Id != Guid.Empty && existingById.TryGetValue(updated.Id, out var existing))
            {
                // Update existing block in place — preserves ID, avoids component remount
                existing.Type = updated.Type;
                existing.Content = updated.Content ?? "";
                existing.Metadata = updated.Metadata;
                existing.SortOrder = updated.SortOrder;
                existing.ParentBlockId = updated.ParentBlockId;
                _db.Entry(existing).State = EntityState.Modified;
            }
            else
            {
                // New block — add it
                if (updated.Id == Guid.Empty) updated.Id = Guid.NewGuid();
                updated.PageId = pageId;
                _db.Blocks.Add(updated);
            }
        }

        // Remove blocks that no longer exist in the update
        var updatedIds = updatedBlocks.Where(b => b.Id != Guid.Empty).Select(b => b.Id).ToHashSet();
        foreach (var existing in existingBlocks)
        {
            if (!updatedIds.Contains(existing.Id))
            {
                existing.IsDeleted = true;
                _db.Entry(existing).State = EntityState.Modified;
            }
        }

        // Touch UpdatedAt
        var page = await _db.Pages.FindAsync(pageId);
        if (page != null)
        {
            page.UpdatedAt = DateTime.UtcNow;
            _db.Entry(page).State = EntityState.Modified;
        }

        await _db.SaveChangesAsync();
    }

    public async Task UpdateBlockContentAsync(Guid blockId, string content, Guid pageId)
    {
        await _db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Blocks\" SET \"Content\" = {0} WHERE \"Id\" = {1}",
            content ?? "", blockId);
        await _db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Pages\" SET \"UpdatedAt\" = {0} WHERE \"Id\" = {1}",
            DateTime.UtcNow, pageId);
    }

    public async Task AddBlockAsync(Block block)
    {
        if (block.Id == Guid.Empty) block.Id = Guid.NewGuid();
        _db.Blocks.Add(block);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteBlockAsync(Guid blockId, Guid pageId)
    {
        await _db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Blocks\" SET \"IsDeleted\" = 1 WHERE \"Id\" = {0}",
            blockId);
        await _db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Pages\" SET \"UpdatedAt\" = {0} WHERE \"Id\" = {1}",
            DateTime.UtcNow, pageId);
    }

    public async Task RenumberBlocksAsync(Guid pageId, List<Guid> blockIdsInOrder)
    {
        for (int i = 0; i < blockIdsInOrder.Count; i++)
        {
            await _db.Database.ExecuteSqlRawAsync(
                "UPDATE \"Blocks\" SET \"SortOrder\" = {0} WHERE \"Id\" = {1}",
                i, blockIdsInOrder[i]);
        }
        await _db.Database.ExecuteSqlRawAsync(
            "UPDATE \"Pages\" SET \"UpdatedAt\" = {0} WHERE \"Id\" = {1}",
            DateTime.UtcNow, pageId);
    }
}
