using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Yanoch.Domain;
using Yanoch.Domain.Services;
using Yanoch.Ui.Components.Editor;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// The block operations that do not change a block's text division: type conversion, to do
/// toggling, appending, deleting, drag reordering and the drag-to-side column split. The
/// operations that divide or join text (split, merge, indent, caret navigation) live in
/// <c>Editor.SplitOperations.razor.cs</c>. The shared state is declared in
/// <c>Editor.razor.cs</c>.
/// </summary>
public partial class Editor
{
    /// <summary>
    /// The entries of the slash command menu, in the order they are offered. It lives here with
    /// the other block operations because applying an entry is a block operation.
    /// </summary>
    private static readonly IReadOnlyList<BlockTypeOption> BlockTypeOptions = new List<BlockTypeOption>
    {
        new BlockTypeOption(BlockType.Paragraph, "Text", "plain text", "paragraph"),
        new BlockTypeOption(BlockType.Heading1, "Heading 1", "big section heading", "heading", 1),
        new BlockTypeOption(BlockType.Heading2, "Heading 2", "medium section heading", "heading", 2),
        new BlockTypeOption(BlockType.Heading3, "Heading 3", "small section heading", "heading", 3),
        new BlockTypeOption(BlockType.BulletedListItem, "Bulleted list", "unordered list", "bulleted_list_item"),
        new BlockTypeOption(BlockType.NumberedListItem, "Numbered list", "ordered list", "ordered_list_item"),
        new BlockTypeOption(BlockType.ToDo, "To-do", "task with a checkbox", "todo_item"),
        new BlockTypeOption(BlockType.Quote, "Quote", "captured quote", "blockquote"),
        new BlockTypeOption(BlockType.Code, "Code", "code with syntax highlighting", "code_block"),
        new BlockTypeOption(BlockType.Divider, "Divider", "visual separator", "horizontal_rule"),
        new BlockTypeOption(BlockType.Image, "Image", "picture from a URL", "image"),
    };

    private async Task HandleApplyBlockTypeAsync(BlockTypeSelection selection)
    {
        await ApplyBlockTypeAsync(selection.BlockId, selection.Option);
    }

    private async Task ApplyBlockTypeAsync(Guid blockId, BlockTypeOption option)
    {
        slashMenuBlockId = null;
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null || block.IsContainer)
        {
            return;
        }

        BlockContentService.ConvertType(block, option.BlockType);
        await Repository.SaveBlockAsync(block);

        BlockEditor? editor = ReadEditorComponent(blockId);
        if (editor is not null)
        {
            await editor.ApplyBlockTypeAsync(option.NodeName, option.BuildAttributes());
            await editor.FocusAsync();
        }
        await ReloadBlocksAsync(blockId, false, true);
    }

    private async Task ToggleToDoAsync(Guid blockId)
    {
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null || block.BlockType != BlockType.ToDo)
        {
            return;
        }
        BlockContentService.ToggleToDoChecked(block);
        await Repository.SaveBlockAsync(block);

        BlockEditor? editor = ReadEditorComponent(blockId);
        if (editor is not null)
        {
            await editor.ApplyBlockTypeAsync("todo_item", new { @checked = block.IsChecked });
        }
    }

    private async Task AddBlockAtEndAsync()
    {
        IReadOnlyList<Block> topLevel = ReadChildren(null);

        // A page with no blocks at all is a state the editor can reach (deleting the last leaf of
        // a column list empties the page), and it used to be a DEAD END: this method returned
        // early, so the page rendered nothing and no gesture could ever add a block back. The
        // button's whole job is to give the page somewhere to type, so it recreates the first
        // block instead of giving up.
        if (topLevel.Count == 0)
        {
            Block firstBlock = await Repository.AppendBlockAsync(PageId, 0);
            await ReloadBlocksAsync(firstBlock.Id, true);
            return;
        }

        Block lastBlock = topLevel[^1];
        Block newBlock = await Repository.AppendBlockAsync(PageId, lastBlock.IndentLevel);
        await ReloadBlocksAsync(newBlock.Id, true);
    }

    /// <summary>
    /// Deletes a block. A block that was the last one inside its column also collapses the column
    /// list, so an emptied column cannot linger.
    /// </summary>
    /// <remarks>
    /// The "last block" guard counts TEXT BLOCKS, not every row. Counting every row was wrong
    /// because the structural containers inflate the total: a page holding a single paragraph
    /// inside a column list has three rows, so the guard never fired, the delete went through, and
    /// the collapse that followed removed the column, the list and the paragraph together —
    /// leaving the page with ZERO blocks and no way to add one back.
    /// </remarks>
    private async Task DeleteBlockAsync(Guid blockId)
    {
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null)
        {
            return;
        }

        Guid? columnListId = await Repository.ReadEnclosingColumnListIdAsync(blockId);
        int textBlockCount = orderedBlocks.Count(candidate => !candidate.IsContainer);
        if (textBlockCount <= 1)
        {
            // The page's last piece of text: deleting it would leave nothing to edit.
            return;
        }

        await Repository.DeleteBlockAsync(blockId);
        if (columnListId is not null)
        {
            await Repository.CollapseColumnListAsync(PageId, columnListId.Value);
        }
        await ReloadBlocksAsync(null, false);
    }

    private void HandleDragStart(Guid blockId)
    {
        draggingBlockId = blockId;
        _ = ToggleDraggingClassAsync(true);
    }

    /// <summary>
    /// Adds the shell-level class that reveals every row's split bars for the duration of a drag.
    /// The per-bar highlight itself is done in JS (js/src/splitzones.js) so it needs no round trip.
    /// </summary>
    private async Task ToggleDraggingClassAsync(bool isDragging)
    {
        try
        {
            await EditorInterop.SetDraggingClassAsync(isDragging);
        }
        catch (JSDisconnectedException)
        {
            // The circuit is gone; there is no DOM left to class.
        }
    }

    private void HandleDragOver(Guid targetBlockId)
    {
        if (draggingBlockId is null || draggingBlockId == targetBlockId)
        {
            return;
        }
        if (dragOverBlockId != targetBlockId)
        {
            dragOverBlockId = targetBlockId;
            StateHasChanged();
        }
    }

    /// <summary>
    /// A drop on the row body: reorder the dragged block so it sits just before the target,
    /// within the target's own parent.
    /// </summary>
    private async Task HandleDropAsync(Guid targetBlockId)
    {
        Guid? movedBlockId = draggingBlockId;
        HandleDragEnd();
        if (movedBlockId is null || movedBlockId == targetBlockId)
        {
            return;
        }

        Block? targetBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == targetBlockId);
        Block? movedBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == movedBlockId.Value);
        if (targetBlock is null || movedBlock is null || targetBlock.IsContainer)
        {
            return;
        }

        // A reorder that moves a block out of a column can empty that column, which would leave a
        // degenerate one-column list rendering as a stray empty cell. Captured before the move,
        // because the parentage is rewritten by it.
        Guid? sourceColumnId = await Repository.ReadEnclosingColumnIdAsync(movedBlockId.Value);

        List<Block> siblings = ReadChildren(targetBlock.ParentBlockId).ToList();
        siblings.RemoveAll(candidate => candidate.Id == movedBlockId.Value);
        int targetIndex = siblings.FindIndex(candidate => candidate.Id == targetBlockId);
        if (targetIndex < 0)
        {
            return;
        }

        siblings.Insert(targetIndex, movedBlock);
        await Repository.ReplaceSiblingsAsync(PageId, targetBlock.ParentBlockId, siblings);
        await Repository.CollapseEmptiedColumnAsync(PageId, sourceColumnId);
        await ReloadBlocksAsync(movedBlockId, false);
    }

    /// <summary>
    /// A drop on one of the row's side zones: split the layout so the dragged block becomes a
    /// column beside the target. This is the drag-to-side "split a block sideways" gesture.
    /// </summary>
    private async Task HandleDropBesideAsync(BlockDropTarget dropTarget)
    {
        Guid? movedBlockId = draggingBlockId;
        HandleDragEnd();
        if (movedBlockId is null || movedBlockId == dropTarget.TargetBlockId)
        {
            return;
        }

        Block? targetBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == dropTarget.TargetBlockId);
        if (targetBlock is null || targetBlock.IsContainer)
        {
            return;
        }

        bool placeMovedBefore = dropTarget.Side == BlockDropSide.Left;
        Guid? newColumnId = await Repository.SplitIntoColumnsAsync(
            PageId,
            dropTarget.TargetBlockId,
            movedBlockId.Value,
            placeMovedBefore);

        await ReloadBlocksAsync(movedBlockId, false);
    }

    private async Task HandleDropAtEndAsync()
    {
        Guid? movedBlockId = draggingBlockId;
        HandleDragEnd();
        if (movedBlockId is null)
        {
            return;
        }

        Block? movedBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == movedBlockId.Value);
        if (movedBlock is null)
        {
            return;
        }

        // Dropping in the end zone takes the block out of any column it was in.
        if (movedBlock.ParentBlockId is not null)
        {
            await Repository.MoveBlockToTopLevelAsync(PageId, movedBlockId.Value);
            await ReloadBlocksAsync(movedBlockId, false);
            return;
        }

        List<Block> topLevel = ReadChildren(null).ToList();
        topLevel.RemoveAll(candidate => candidate.Id == movedBlockId.Value);
        topLevel.Add(movedBlock);
        await Repository.ReplaceSiblingsAsync(PageId, null, topLevel);
        await ReloadBlocksAsync(movedBlockId, false);
    }

    private void HandleDragEnd()
    {
        draggingBlockId = null;
        dragOverBlockId = null;
        StateHasChanged();
    }

    private async Task HandleDragEndAsync()
    {
        HandleDragEnd();
        await ToggleDraggingClassAsync(false);
    }

    private async Task UpdateTitleAsync(ChangeEventArgs changeEvent)
    {
        if (currentPage is null)
        {
            return;
        }
        string newTitle = changeEvent.Value?.ToString() ?? "Untitled";
        currentPage.Title = newTitle;
        await Repository.UpdatePageTitleAsync(currentPage.Id, newTitle);
    }
}
