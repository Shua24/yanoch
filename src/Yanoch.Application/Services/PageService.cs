using System.Text.RegularExpressions;
using Yanoch.Application.DTOs;
using Yanoch.Application.Interfaces;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;

namespace Yanoch.Application.Services;

public class PageService : IPageService
{
    private readonly IPageRepository _pages;
    private readonly ITagRepository _tags;
    private readonly IPageVersionRepository _versions;
    private readonly IBacklinkRepository _backlinks;

    public PageService(IPageRepository pages, ITagRepository tags, IPageVersionRepository versions, IBacklinkRepository backlinks)
    {
        _pages = pages; _tags = tags; _versions = versions; _backlinks = backlinks;
    }

    public async Task<PageDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var page = await _pages.GetByIdAsync(id, userId);
        return page == null ? null : MapToDto(page);
    }

    public async Task<IEnumerable<PageDto>> GetTreeAsync(Guid userId)
    {
        var pages = await _pages.GetRootPagesAsync(userId);
        var result = new List<PageDto>();
        foreach (var p in pages)
        {
            var dto = MapToDto(p);
            var children = await _pages.GetByParentAsync(p.Id, userId);
            dto.ChildCount = children.Count();
            result.Add(dto);
        }
        return result;
    }

    public async Task<IEnumerable<PageDto>> GetChildrenAsync(Guid? parentId, Guid userId)
    {
        var pages = await _pages.GetByParentAsync(parentId, userId);
        var result = new List<PageDto>();
        foreach (var p in pages)
        {
            var dto = MapToDto(p);
            dto.ChildCount = (await _pages.GetByParentAsync(p.Id, userId)).Count();
            result.Add(dto);
        }
        return result;
    }

    public async Task<PageDto> CreateAsync(CreatePageDto dto, Guid userId)
    {
        var page = new Page
        {
            Title = dto.Title,
            Icon = dto.Icon,
            ParentPageId = dto.ParentPageId,
            UserId = userId,
            Content = dto.Content ?? ""
        };
        if (dto.TagIds != null)
        {
            foreach (var tagId in dto.TagIds)
                page.PageTags.Add(new PageTag { PageId = page.Id, TagId = tagId });
        }
        await _pages.CreateAsync(page);
        return MapToDto(page);
    }

    public async Task<PageDto?> UpdateAsync(Guid id, UpdatePageDto dto, Guid userId)
    {
        var page = await _pages.GetByIdAsync(id, userId);
        if (page == null) return null;

        if (dto.Title != null) page.Title = dto.Title;
        if (dto.Icon != null) page.Icon = dto.Icon;
        if (dto.CoverUrl != null) page.CoverUrl = dto.CoverUrl;
        if (dto.ParentPageId != null) page.ParentPageId = dto.ParentPageId;
        if (dto.SortOrder != null) page.SortOrder = dto.SortOrder.Value;
        page.UpdatedAt = DateTime.UtcNow;

        if (dto.TagIds != null)
        {
            page.PageTags.Clear();
            foreach (var tagId in dto.TagIds)
                page.PageTags.Add(new PageTag { PageId = page.Id, TagId = tagId });
        }

        await _pages.UpdateAsync(page);
        var updated = await _pages.GetByIdAsync(page.Id, page.UserId);
        return MapToDto(updated!);
    }

    public async Task<string?> GetContentAsync(Guid pageId, Guid userId) =>
        await _pages.GetContentAsync(pageId, userId);

    public async Task SetContentAsync(Guid pageId, string content)
    {
        await _pages.SetContentAsync(pageId, content);
        await UpdateBacklinksFromContent(pageId, content);
    }

    private async Task UpdateBacklinksFromContent(Guid sourcePageId, string content)
    {
        var page = await _pages.GetByIdAsync(sourcePageId, Guid.Empty);
        if (page == null) return;
        var userId = page.UserId;

        await _backlinks.DeleteBySourcePageAsync(sourcePageId);
        var matches = Regex.Matches(content, @"\[\[([^\]]+)\]\]");
        foreach (Match m in matches)
        {
            var title = m.Groups[1].Value;
            var target = await FindPageByTitle(title, userId);
            if (target != null)
            {
                await _backlinks.CreateAsync(new Backlink
                {
                    SourcePageId = sourcePageId,
                    TargetPageId = target.Id,
                    Context = content.Length > 200 ? content[..200] : content
                });
            }
        }
    }

    private async Task<Page?> FindPageByTitle(string title, Guid userId)
    {
        var roots = await _pages.GetRootPagesAsync(userId);
        return await FindPageByTitleRecursive(roots, title, userId);
    }

    private async Task<Page?> FindPageByTitleRecursive(IEnumerable<Page> pages, string title, Guid userId)
    {
        foreach (var p in pages)
        {
            if (string.Equals(p.Title, title, StringComparison.OrdinalIgnoreCase)) return p;
            var children = await _pages.GetByParentAsync(p.Id, userId);
            var found = await FindPageByTitleRecursive(children, title, userId);
            if (found != null) return found;
        }
        return null;
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var page = await _pages.GetByIdAsync(id, userId);
        if (page != null) await _pages.DeleteAsync(page);
    }

    public async Task<IEnumerable<SearchResultDto>> SearchAsync(string query, Guid userId)
    {
        var pages = await _pages.SearchAsync(query, userId);
        return pages.Select(p => new SearchResultDto
        {
            Id = p.Id,
            Title = p.Title,
            Icon = p.Icon,
            Snippet = (p.Content ?? "")[..Math.Min(200, (p.Content ?? "").Length)],
            UpdatedAt = p.UpdatedAt
        });
    }

    public async Task<IEnumerable<PageDto>> GetRecentAsync(Guid userId)
    {
        var pages = await _pages.GetRecentAsync(userId, 10);
        return pages.Select(MapToDto);
    }

    public async Task<IEnumerable<PageVersionDto>> GetVersionsAsync(Guid pageId, Guid userId)
    {
        var page = await _pages.GetByIdAsync(pageId, userId);
        if (page == null) return Enumerable.Empty<PageVersionDto>();
        var versions = await _versions.GetByPageAsync(pageId);
        return versions.Select(v => new PageVersionDto
        {
            Id = v.Id, VersionNumber = v.VersionNumber, Title = v.Title, Description = v.Description, CreatedAt = v.CreatedAt
        });
    }

    public async Task<PageDto?> RestoreVersionAsync(Guid pageId, Guid versionId, Guid userId)
    {
        var page = await _pages.GetByIdAsync(pageId, userId);
        if (page == null) return null;
        var version = await _versions.GetByIdAsync(versionId);
        if (version == null || version.PageId != pageId) return null;

        page.Title = version.Title;
        page.Content = version.Content;
        page.UpdatedAt = DateTime.UtcNow;
        await _pages.UpdateAsync(page);

        var updated = await _pages.GetByIdAsync(page.Id, page.UserId);
        return MapToDto(updated!);
    }

    private static PageDto MapToDto(Page p) => new()
    {
        Id = p.Id,
        Title = p.Title,
        Icon = p.Icon,
        CoverUrl = p.CoverUrl,
        ParentPageId = p.ParentPageId,
        SortOrder = p.SortOrder,
        Content = p.Content,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt,
        Tags = p.PageTags?.Select(pt => new TagDto { Id = pt.TagId, Name = pt.Tag?.Name ?? "", Color = pt.Tag?.Color }).ToList() ?? new(),
        VersionCount = p.Versions?.Count ?? 0,
        Backlinks = p.Backlinks?.Select(b => new BacklinkDto
        {
            Id = b.Id,
            SourcePageId = b.SourcePageId,
            SourcePageTitle = b.SourcePage?.Title ?? "",
            Context = b.Context
        }).ToList() ?? new()
    };
}
