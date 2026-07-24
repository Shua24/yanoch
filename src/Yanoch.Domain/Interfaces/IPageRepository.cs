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
    Task ReplaceBlocksAsync(Guid pageId, List<Block> newBlocks);
    Task UpdateBlocksAsync(Guid pageId, List<Block> updatedBlocks);
    Task UpdateBlockContentAsync(Guid blockId, string content, Guid pageId);
    Task AddBlockAsync(Block block);
    Task DeleteBlockAsync(Guid blockId, Guid pageId);
    Task RenumberBlocksAsync(Guid pageId, List<Guid> blockIdsInOrder);
}
