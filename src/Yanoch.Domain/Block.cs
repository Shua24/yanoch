namespace Yanoch.Domain;

/// <summary>
/// A single content block inside a page.
///
/// <see cref="ContentJson"/> holds the ProseMirror document for the block and is the
/// authoritative representation. <see cref="BlockType"/>, <see cref="IsChecked"/> and
/// <see cref="Language"/> are derived caches kept in step with <see cref="ContentJson"/>
/// by a single writer (<see cref="Services.BlockContentService"/>) so they can be queried
/// without parsing JSON.
///
/// A block sits either at the top level of its page (<see cref="ParentBlockId"/> is null) or
/// inside a container block such as a <see cref="BlockType.Column"/>. Nesting is therefore real
/// parentage, and <see cref="SortOrder"/> is scoped to the parent: each parent owns its own
/// 0,1,2… sequence. List indentation is a SEPARATE mechanism (<see cref="IndentLevel"/>); the
/// two coexist on purpose and unifying them is a later change.
///
/// The structural containers (<see cref="BlockType.ColumnList"/>, <see cref="BlockType.Column"/>)
/// hold no text. Their <see cref="ContentJson"/> is a placeholder that must never be passed to
/// <c>BlockContentService.SetContentJson</c>, which derives the type from the document and would
/// overwrite the container type with Paragraph.
/// </summary>
public sealed class Block
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PageId { get; set; }

    /// <summary>
    /// The container block this block lives in, or null when it sits at the top level of the
    /// page. With <see cref="SortOrder"/> this gives the block's position in the tree.
    /// </summary>
    public Guid? ParentBlockId { get; set; }

    public int SortOrder { get; set; }

    public int IndentLevel { get; set; }

    public string ContentJson { get; set; } = ProseMirrorConverter.EmptyParagraphJson;

    public BlockType BlockType { get; set; } = BlockType.Paragraph;

    public bool IsChecked { get; set; }

    public string Language { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public Page? Page { get; set; }

    public Block? Parent { get; set; }

    public ICollection<Block> Children { get; set; } = new List<Block>();

    /// <summary>
    /// True for the structural containers that hold child blocks rather than text.
    /// </summary>
    public bool IsContainer => BlockType == BlockType.ColumnList || BlockType == BlockType.Column;
}
