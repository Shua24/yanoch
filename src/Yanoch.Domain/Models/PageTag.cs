namespace Yanoch.Domain.Models;

public class PageTag
{
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    public Guid TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}
