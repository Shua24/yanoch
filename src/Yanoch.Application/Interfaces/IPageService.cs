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
    Task<IEnumerable<SearchResultDto>> SearchAsync(string query, Guid userId);
    Task<IEnumerable<PageDto>> GetRecentAsync(Guid userId);
    Task<IEnumerable<PageVersionDto>> GetVersionsAsync(Guid pageId, Guid userId);
    Task<PageDto?> RestoreVersionAsync(Guid pageId, Guid versionId, Guid userId);
    Task UpdateBlockContentAsync(Guid pageId, Guid blockId, string content, Guid userId);
    Task UpdateBlockTypeAsync(Guid pageId, Guid blockId, string type, Guid userId);
    Task AddBlockAsync(CreateBlockDto dto, Guid pageId);
    Task DeleteBlockAsync(Guid pageId, Guid blockId, Guid userId);
    Task RenumberBlocksAsync(Guid pageId, List<Guid> blockIdsInOrder);
    Task<string?> GetContentAsync(Guid pageId, Guid userId);
    Task SetContentAsync(Guid pageId, string content);
}
