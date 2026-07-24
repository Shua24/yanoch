using Yanoch.Domain.Models;

namespace Yanoch.Domain.Interfaces;

public interface IPageVersionRepository
{
    Task<PageVersion?> GetByIdAsync(Guid id);
    Task<IEnumerable<PageVersion>> GetByPageAsync(Guid pageId);
    Task<PageVersion> CreateAsync(PageVersion version);
    Task<PageVersion?> GetLatestAsync(Guid pageId);
}
