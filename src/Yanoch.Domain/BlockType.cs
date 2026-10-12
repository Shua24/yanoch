namespace Yanoch.Domain;

/// <summary>
/// The kind of a single content block, mirroring the block kinds a Notion page is
/// built from. Databases are explicitly out of scope for this project.
/// </summary>
public enum BlockType
{
    Paragraph = 0,
    Heading1 = 1,
    Heading2 = 2,
    Heading3 = 3,
    BulletedListItem = 4,
    NumberedListItem = 5,
    ToDo = 6,
    Quote = 7,
    Code = 8,
    Divider = 9,
    ColumnList = 10,
    Column = 11,
    /// <summary>
    /// An image block. APPENDED, never inserted mid-list: the enum is stored as an int, so
    /// renumbering an existing member would silently reinterpret every stored row.
    /// </summary>
    Image = 12,
}
