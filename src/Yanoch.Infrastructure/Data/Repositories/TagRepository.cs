using Microsoft.EntityFrameworkCore;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;
using Yanoch.Infrastructure.Data;

namespace Yanoch.Infrastructure.Data.Repositories;

public class TagRepository : ITagRepository
{
    private readonly AppDbContext _db;
    public TagRepository(AppDbContext db) => _db = db;

    public async Task<Tag?> GetByIdAsync(Guid id) => await _db.Tags.FindAsync(id);
    public async Task<IEnumerable<Tag>> GetByUserAsync(Guid userId) => await _db.Tags.Where(t => t.UserId == userId).ToListAsync();
    public async Task<Tag> CreateAsync(Tag tag) { _db.Tags.Add(tag); await _db.SaveChangesAsync(); return tag; }
    public async Task UpdateAsync(Tag tag) { _db.Tags.Update(tag); await _db.SaveChangesAsync(); }
    public async Task DeleteAsync(Tag tag) { _db.Tags.Remove(tag); await _db.SaveChangesAsync(); }
    public async Task<IEnumerable<Tag>> SearchAsync(string query, Guid userId) =>
        await _db.Tags.Where(t => t.UserId == userId && t.Name.ToLower().Contains(query.ToLower())).ToListAsync();
}
