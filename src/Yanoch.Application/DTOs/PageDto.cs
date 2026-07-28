namespace Yanoch.Application.DTOs;

public class PageDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string? Icon { get; set; }
    public string? CoverUrl { get; set; }
    public Guid? ParentPageId { get; set; }
    public int SortOrder { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public List<TagDto> Tags { get; set; } = new();
    public int ChildCount { get; set; }
    public int VersionCount { get; set; }
    public List<BacklinkDto> Backlinks { get; set; } = new();
}
