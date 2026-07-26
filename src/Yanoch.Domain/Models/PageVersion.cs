namespace Yanoch.Domain.Models;

public class PageVersion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public string? Description { get; set; }
    public int VersionNumber { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
