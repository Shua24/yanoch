namespace Yanoch.Application.DTOs;

public class PageVersionDto
{
    public Guid Id { get; set; }
    public int VersionNumber { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
