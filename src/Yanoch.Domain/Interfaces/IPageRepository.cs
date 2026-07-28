using Yanoch.Domain.Models;

namespace Yanoch.Domain.Interfaces;

public interface IPageRepository
{
    Task<Page?> GetByIdAsync(Guid id, Guid userId);
    Task<Page?> GetByIdTrackedAsync(Guid id, Guid userId);
    Task<Page?> GetByIdTrackedWithTagsAsync(Guid id, Guid userId);
    Task<Page?> GetByIdIncludingDeletedTrackedAsync(Guid id, Guid userId);
    Task<IEnumerable<Page>> GetByParentAsync(Guid? parentId, Guid userId);
    Task<IEnumerable<Page>> GetRootPagesAsync(Guid userId);
    Task<IEnumerable<Page>> SearchAsync(string query, Guid userId);
    Task<Page> CreateAsync(Page page);
    Task UpdateAsync(Page page);
    Task DeleteAsync(Page page);
    Task SoftDeleteAsync(Page page);
    Task HardDeleteAsync(Page page);
    Task RestoreAsync(Page page);
    Task<Page?> GetByIdIncludingDeletedAsync(Guid id, Guid userId);
    Task<IEnumerable<Page>> GetDeletedAsync(Guid userId);
    Task<IEnumerable<Page>> GetSubtreeIncludingDeletedAsync(Guid id, Guid userId);
    Task<IEnumerable<Page>> GetRecentAsync(Guid userId, int count = 10);
    Task<IReadOnlyDictionary<Guid, int>> GetChildCountsAsync(IEnumerable<Guid> parentIds, Guid userId);
    Task<string?> GetContentAsync(Guid pageId, Guid userId);
    Task SetContentAsync(Guid pageId, string content);
}
