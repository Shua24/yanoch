using Yanoch.Application.DTOs;
using Yanoch.Application.Interfaces;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;

namespace Yanoch.Application.Services;

public class TagService : ITagService
{
    private readonly ITagRepository _tags;
    public TagService(ITagRepository tags) => _tags = tags;

    public async Task<IEnumerable<TagDto>> GetAllAsync(Guid userId)
    {
        var tags = await _tags.GetByUserAsync(userId);
        return tags.Select(t => new TagDto { Id = t.Id, Name = t.Name, Color = t.Color });
    }

    public async Task<TagDto> CreateAsync(string name, string? color, Guid userId)
    {
        var tag = await _tags.CreateAsync(new Tag { Name = name, Color = color, UserId = userId });
        return new TagDto { Id = tag.Id, Name = tag.Name, Color = tag.Color };
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var tag = await _tags.GetByIdAsync(id);
        if (tag != null && tag.UserId == userId) await _tags.DeleteAsync(tag);
    }

    public async Task<IEnumerable<TagDto>> SearchAsync(string query, Guid userId)
    {
        var tags = await _tags.SearchAsync(query, userId);
        return tags.Select(t => new TagDto { Id = t.Id, Name = t.Name, Color = t.Color });
    }
}
