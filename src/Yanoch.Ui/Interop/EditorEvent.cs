namespace Yanoch.Ui.Interop;

/// <summary>
/// The block level actions the ProseMirror editor reports back to Blazor. A single editor
/// instance owns one block, so every event carries the block id it happened in.
/// </summary>
public enum EditorEventKind
{
    Changed,
    Focused,
    Enter,
    Split,
    BackspaceAtStart,
    ArrowUp,
    ArrowDown,
    Indent,
    Outdent,
    Slash,
    DividerShortcut,
}

/// <summary>
/// The two halves a caret split produced inside one block, computed by ProseMirror (which is the
/// only side that knows the caret offset and the inline marks). Both documents already carry the
/// original block's node type and attributes, so the host only has to decide where to store them.
/// </summary>
/// <param name="BeforeJson">The document for the text left of the caret.</param>
/// <param name="AfterJson">The document for the text right of the caret.</param>
/// <param name="IsAtStart">True when the caret sat at position 0, so the block's text stays put.</param>
/// <param name="IsEmpty">True when the block held no text at all.</param>
public sealed record BlockSplitRequest(
    string BeforeJson,
    string AfterJson,
    bool IsAtStart,
    bool IsEmpty);

/// <summary>
/// One message from a block editor to the Blazor page that owns the block list.
/// <see cref="ContentJson"/> is only set for <see cref="EditorEventKind.Changed"/> and
/// <see cref="SplitRequest"/> only for <see cref="EditorEventKind.Split"/>.
/// </summary>
public sealed record EditorEvent(
    EditorEventKind Kind,
    Guid BlockId,
    string? ContentJson,
    BlockSplitRequest? SplitRequest = null);
