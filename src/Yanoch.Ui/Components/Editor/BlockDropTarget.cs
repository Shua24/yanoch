using Yanoch.Ui.Components.Pages;

namespace Yanoch.Ui.Components.Editor;

/// <summary>
/// Which side of a block a dragged block was dropped on. The middle of a row is not a side — that
/// is a plain reorder and is handled by <c>EditorEventKind</c>/<c>OnDropOnBlock</c> instead.
/// </summary>
public enum BlockDropSide
{
    Left,
    Right,
}

/// <summary>
/// A side drop: the dragged block should become a column beside <see cref="TargetBlockId"/>.
/// </summary>
public sealed record BlockDropTarget(Guid TargetBlockId, BlockDropSide Side);

/// <summary>
/// One entry of the slash menu was chosen for a block.
/// </summary>
public sealed record BlockTypeSelection(Guid BlockId, BlockTypeOption Option);
