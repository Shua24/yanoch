namespace Yanoch.Application.DTOs;

public class BacklinkDto
{
    public Guid Id { get; set; }
    public Guid SourcePageId { get; set; }
    public string SourcePageTitle { get; set; } = "";
    public string? Context { get; set; }
}
