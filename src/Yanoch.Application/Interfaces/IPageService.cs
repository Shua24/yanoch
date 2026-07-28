using Yanoch.Application.DTOs;

namespace Yanoch.Application.Interfaces;

public interface IPageService
{
    Task<PageDto?> GetByIdAsync(Guid id, Guid userId);
    Task<IEnumerable<PageDto>> GetTreeAsync(Guid userId);
    Task<IEnumerable<PageDto>> GetChildrenAsync(Guid? parentId, Guid userId);
    Task<PageDto> CreateAsync(CreatePageDto dto, Guid userId);
    Task<PageDto?> UpdateAsync(Guid id, UpdatePageDto dto, Guid userId);
    Task DeleteAsync(Guid id, Guid userId);
    Task SoftDeleteAsync(Guid id, Guid userId);
    Task HardDeleteAsync(Guid id, Guid userId);
    Task<PageDto?> RestoreAsync(Guid id, Guid userId);
    Task<IEnumerable<PageDto>> GetDeletedAsync(Guid userId);
    Task<IEnumerable<SearchResultDto>> SearchAsync(string query, Guid userId);
    Task<IEnumerable<PageDto>> GetRecentAsync(Guid userId);
    Task<IEnumerable<PageVersionDto>> GetVersionsAsync(Guid pageId, Guid userId);
    Task<PageDto?> RestoreVersionAsync(Guid pageId, Guid versionId, Guid userId);
    Task<string?> GetContentAsync(Guid pageId, Guid userId);
    Task SetContentAsync(Guid pageId, string content, Guid userId);
    Task<PageDto?> GetSubtreeIncludingDeletedAsync(Guid id, Guid userId);
    Task ReorderSubpagesAsync(Guid parentId, List<Guid> pageIds, Guid userId);

}
