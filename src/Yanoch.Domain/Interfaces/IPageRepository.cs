using Yanoch.Domain.Models;

namespace Yanoch.Domain.Interfaces;

public interface IPageRepository
{
    Task<Page?> GetByIdAsync(Guid id, Guid userId);
    Task<IEnumerable<Page>> GetByParentAsync(Guid? parentId, Guid userId);
    Task<IEnumerable<Page>> GetRootPagesAsync(Guid userId);
    Task<IEnumerable<Page>> SearchAsync(string query, Guid userId);
    Task<Page> CreateAsync(Page page);
    Task UpdateAsync(Page page);
    Task DeleteAsync(Page page);
    Task<IEnumerable<Page>> GetRecentAsync(Guid userId, int count = 10);
    Task<string?> GetContentAsync(Guid pageId, Guid userId);
    Task SetContentAsync(Guid pageId, string content);
}
