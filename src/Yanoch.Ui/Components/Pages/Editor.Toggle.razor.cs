using Yanoch.Domain;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// Toggle behaviour: the disclosure flip, and nesting a block into the toggle above it.
///
/// Split out of <c>Editor.SplitOperations.razor.cs</c> to keep that file inside the project's size
/// budget, and because a toggle is the only block that owns children in the tree, so this is the
/// one place that has to know about parentage outside the column code.
/// </summary>
public partial class Editor
{
    /// <summary>
    /// Flips a toggle open or closed. The state lives in <see cref="Services.ToggleStateService"/>,
    /// not on the block, because Notion keeps it client-side: it is a property of the viewer, not
    /// of the document, so it must not be written to the database or travel with an export.
    /// </summary>
    private Task HandleToggleDisclosureAsync(Guid blockId)
    {
        ToggleState.Toggle(blockId);
        return Task.CompletedTask;
    }

    /// <summary>
    /// True for a block that can hold CHILDREN in the block tree. Only a toggle does today: the
    /// column containers hold cells rather than content, and Notion's own callout version 2 child is
    /// an internal representation detail this project does not model.
    /// </summary>
    private static bool IsNestableBlock(BlockType blockType)
    {
        return blockType == BlockType.Toggle;
    }

    /// <summary>
    /// True when <paramref name="block"/> is a toggle that is currently open. A CLOSED toggle is
    /// what makes Enter continue the toggle type; an OPEN one drops the new block to a paragraph.
    /// </summary>
    private bool IsOpenToggle(Block block)
    {
        return block.BlockType == BlockType.Toggle && ToggleState.IsOpen(block.Id);
    }

    /// <summary>
    /// Moves a block into the toggle directly above it, when there is one. Returns false when the
    /// block is not directly below a toggle, so the caller falls back to a list indent.
    ///
    /// The toggle is opened as part of the move: a block indented into a collapsed toggle would be
    /// invisible, which is the state Notion's own rule avoids by forcing the toggle open.
    /// </summary>
    private async Task<bool> TryNestIntoPrecedingToggleAsync(Block block)
    {
        // Already inside something: a column cell has its own rules, and a toggle's child nests only
        // one level, so a second Tab on it must fall through to the list indent.
        if (block.ParentBlockId is not null)
        {
            return false;
        }

        List<Block> siblings = ReadChildren(null).ToList();
        int index = siblings.FindIndex(candidate => candidate.Id == block.Id);
        if (index <= 0)
        {
            return false;
        }

        Block precedingBlock = siblings[index - 1];
        if (precedingBlock.BlockType != BlockType.Toggle)
        {
            return false;
        }

        ToggleState.Open(precedingBlock.Id);
        await Repository.MoveBlockIntoParentAsync(PageId, block.Id, precedingBlock.Id);
        await ReloadBlocksAsync(block.Id, false);
        return true;
    }
}
