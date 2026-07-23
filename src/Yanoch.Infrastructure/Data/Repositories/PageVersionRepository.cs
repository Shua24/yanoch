using Microsoft.EntityFrameworkCore;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;
using Yanoch.Infrastructure.Data;

namespace Yanoch.Infrastructure.Data.Repositories;

public class PageVersionRepository : IPageVersionRepository
{
    private readonly AppDbContext _db;
    public PageVersionRepository(AppDbContext db) => _db = db;

    public async Task<PageVersion?> GetByIdAsync(Guid id) => await _db.PageVersions.FindAsync(id);
    public async Task<IEnumerable<PageVersion>> GetByPageAsync(Guid pageId) => await _db.PageVersions.Where(v => v.PageId == pageId).OrderByDescending(v => v.VersionNumber).ToListAsync();
    public async Task<PageVersion> CreateAsync(PageVersion version) { _db.PageVersions.Add(version); return version; }
    public async Task<PageVersion?> GetLatestAsync(Guid pageId) => await _db.PageVersions.Where(v => v.PageId == pageId).OrderByDescending(v => v.VersionNumber).FirstOrDefaultAsync();
}
