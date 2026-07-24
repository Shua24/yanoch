using Yanoch.Application.DTOs;

namespace Yanoch.Application.Interfaces;

public interface ITagService
{
    Task<IEnumerable<TagDto>> GetAllAsync(Guid userId);
    Task<TagDto> CreateAsync(string name, string? color, Guid userId);
    Task DeleteAsync(Guid id, Guid userId);
    Task<IEnumerable<TagDto>> SearchAsync(string query, Guid userId);
}
