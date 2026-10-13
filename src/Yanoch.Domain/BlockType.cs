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

    /// <summary>
    /// A toggle: a block with its own text AND child blocks whose visibility the disclosure
    /// control flips. Notion models the OPEN/CLOSED state client-side rather than on the block
    /// (recovered: a keyed in-memory Store plus a per-user preference, with no format or property
    /// field for it), so no column stores it here either — see <c>ToggleState</c> in the UI.
    /// </summary>
    Toggle = 13,

    /// <summary>
    /// A callout: a TEXT block with an icon and a background colour. Notion keeps the colour in the
    /// block's FORMAT under <c>block_color</c> (default <c>"default"</c>) and the icon in a store;
    /// both live on the node's attributes here, exactly as an image's source does, so no column is
    /// added. Notion's version 2 callout also holds a child <c>empty_text</c>, which is an internal
    /// representation detail this project does not need.
    /// </summary>
    Callout = 14,

    /// <summary>
    /// The fourth heading level. Notion renders <c>header_4</c> as an h5 element and has NO level 5
    /// or 6 (verified: <c>header_5</c>, <c>header_6</c> and <c>sub_sub_sub_header</c> are absent).
    /// </summary>
    Heading4 = 15,
}
