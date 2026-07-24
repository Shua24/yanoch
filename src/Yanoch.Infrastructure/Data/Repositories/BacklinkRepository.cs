using Microsoft.EntityFrameworkCore;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;
using Yanoch.Infrastructure.Data;

namespace Yanoch.Infrastructure.Data.Repositories;

public class BacklinkRepository : IBacklinkRepository
{
    private readonly AppDbContext _db;
    public BacklinkRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Backlink>> GetByTargetPageAsync(Guid targetId) =>
        await _db.Backlinks.Include(b => b.SourcePage).Where(b => b.TargetPageId == targetId).ToListAsync();
    public async Task<IEnumerable<Backlink>> GetBySourcePageAsync(Guid sourceId) =>
        await _db.Backlinks.Where(b => b.SourcePageId == sourceId).ToListAsync();
    public async Task CreateAsync(Backlink backlink) { _db.Backlinks.Add(backlink); await _db.SaveChangesAsync(); }
    public async Task DeleteBySourcePageAsync(Guid sourceId) { _db.Backlinks.RemoveRange(_db.Backlinks.Where(b => b.SourcePageId == sourceId)); await _db.SaveChangesAsync(); }
}
