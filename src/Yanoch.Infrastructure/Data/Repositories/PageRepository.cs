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
        _db.Entry(page).State = EntityState.Modified;
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Page page) { page.IsDeleted = true; page.DeletedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }

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
