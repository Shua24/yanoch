namespace Yanoch.Application.DTOs;

public class CreatePageDto
{
    public string Title { get; set; } = "Untitled";
    public string? Icon { get; set; }
    public string? Content { get; set; }
    public Guid? ParentPageId { get; set; }
    public List<Guid>? TagIds { get; set; }
}

public class UpdatePageDto
{
    public string? Title { get; set; }
    public string? Icon { get; set; }
    public string? CoverUrl { get; set; }
    public Guid? ParentPageId { get; set; }
    public int? SortOrder { get; set; }
    public List<Guid>? TagIds { get; set; }
}

public class SearchResultDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string? Icon { get; set; }
    public string? Snippet { get; set; }
    public DateTime UpdatedAt { get; set; }
}
