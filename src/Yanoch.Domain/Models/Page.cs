using Yanoch.Domain.Enums;

namespace Yanoch.Domain.Models;

public class Page
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = "Untitled";
    public string? Icon { get; set; }
    public string? CoverUrl { get; set; }
    public Guid UserId { get; set; }
    public Guid? ParentPageId { get; set; }
    public Page? ParentPage { get; set; }
    public int SortOrder { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
    public ICollection<Page> Children { get; set; } = new List<Page>();
    public string? Content { get; set; } // Markdown source of truth
    public ICollection<Block> Blocks { get; set; } = new List<Block>();
    public ICollection<PageTag> PageTags { get; set; } = new List<PageTag>();
    public ICollection<PageVersion> Versions { get; set; } = new List<PageVersion>();
    public ICollection<Backlink> Backlinks { get; set; } = new List<Backlink>();
    public ICollection<Backlink> References { get; set; } = new List<Backlink>();
}
