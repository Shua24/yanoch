namespace Yanoch.Ui.Components.Editor;

/// <summary>
/// The view model a block editor renders from. It carries only what the ProseMirror editor
/// needs; the authoritative block record stays on the server.
/// </summary>
public sealed class BlockEditorModel
{
    public Guid BlockId { get; set; }

    public string ContentJson { get; set; } = string.Empty;

    public int IndentLevel { get; set; }

    public bool AutoFocus { get; set; }

    /// <summary>
    /// The visible marker for a numbered list item ("1.", "2.", …), computed from the block's
    /// position among its consecutive numbered siblings. Empty for every other block type.
    ///
    /// It rides the model rather than the stored document because the ordinal is DERIVED, never
    /// persisted: deleting item 2 must make the old item 3 render as 2, which a stored number
    /// could not do without a rewrite pass.
    /// </summary>
    public string ListMarker { get; set; } = string.Empty;

    public string EditorId => $"yanoch-block-{BlockId:N}";
}
