namespace Yanoch.Application.DTOs;

public class BlockDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "text";
    public string Content { get; set; } = "";
    public string? Metadata { get; set; }
    public int SortOrder { get; set; }
    public Guid? ParentBlockId { get; set; }
    public List<BlockDto> Children { get; set; } = new();
    public bool IsUpdating { get; set; } = false;
}
