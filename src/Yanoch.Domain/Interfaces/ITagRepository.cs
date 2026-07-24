using Yanoch.Domain.Models;

namespace Yanoch.Domain.Interfaces;

public interface ITagRepository
{
    Task<Tag?> GetByIdAsync(Guid id);
    Task<IEnumerable<Tag>> GetByUserAsync(Guid userId);
    Task<Tag> CreateAsync(Tag tag);
    Task UpdateAsync(Tag tag);
    Task DeleteAsync(Tag tag);
    Task<IEnumerable<Tag>> SearchAsync(string query, Guid userId);
}
