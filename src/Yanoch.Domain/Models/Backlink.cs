namespace Yanoch.Domain.Models;

public class Backlink
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SourcePageId { get; set; }
    public Page SourcePage { get; set; } = null!;
    public Guid TargetPageId { get; set; }
    public Page TargetPage { get; set; } = null!;
    public string? Context { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
