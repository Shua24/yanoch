namespace Yanoch.Domain;

/// <summary>
/// A page is the top level document. A page owns an ordered, possibly indented list
/// of content blocks. Timestamps are stored as UTC <see cref="DateTime"/> so the same
/// ordering works on both SQLite and PostgreSQL.
/// </summary>
public sealed class Page
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = "Untitled";

    public string Icon { get; set; } = "\U0001F4C4";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<Block> Blocks { get; set; } = new List<Block>();
}
