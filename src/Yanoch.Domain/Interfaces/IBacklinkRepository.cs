using Yanoch.Domain.Models;

namespace Yanoch.Domain.Interfaces;

public interface IBacklinkRepository
{
    Task<IEnumerable<Backlink>> GetByTargetPageAsync(Guid targetPageId);
    Task<IEnumerable<Backlink>> GetBySourcePageAsync(Guid sourcePageId);
    Task CreateAsync(Backlink backlink);
    Task DeleteBySourcePageAsync(Guid sourcePageId);
}
