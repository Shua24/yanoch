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

    public string EditorId => $"yanoch-block-{BlockId:N}";
}
