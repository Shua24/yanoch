namespace Yanoch.Domain.Models;

public class Block
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    public Guid? ParentBlockId { get; set; }
    public Block? ParentBlock { get; set; }
    public string Type { get; set; } = "text";
    public string Content { get; set; } = "";
    public string? Metadata { get; set; }
    public int SortOrder { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Block> Children { get; set; } = new List<Block>();
}
