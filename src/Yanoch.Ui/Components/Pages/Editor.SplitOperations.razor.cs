using Microsoft.AspNetCore.Components;
using Yanoch.Domain;
using Yanoch.Domain.ProseMirror;
using Yanoch.Domain.Services;
using Yanoch.Ui.Components.Editor;
using Yanoch.Ui.Interop;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// The operations that divide or join blocks: Enter at the caret, Enter on an empty block,
/// Backspace merging upward, indentation and caret navigation. Every lookup is scoped to the
/// block's own PARENT, so splitting or merging inside a column cannot touch the top level and
/// vice versa. The shared state is declared in <c>Editor.razor.cs</c>.
/// </summary>
public partial class Editor
{
    /// <summary>
    /// Enter on a block whose text was divided at the caret. The editor computed both halves;
    /// this decides where the right half goes and what type the new block gets.
    /// </summary>
    private async Task SplitBlockAtCaretAsync(Guid blockId, BlockSplitRequest splitRequest)
    {
        Block? currentBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (currentBlock is null)
        {
            return;
        }

        // Enter on an empty list item outdents it instead of creating another item.
        if (splitRequest.IsEmpty)
        {
            await HandleEmptyBlockEnterAsync(currentBlock);
            return;
        }

        // Enter at the very start of a block inserts an empty block above and leaves the text
        // where it is, which is what Notion does.
        if (splitRequest.IsAtStart)
        {
            Block insertedBlock = await Repository.InsertBlockAfterAsync(
                PageId,
                currentBlock.ParentBlockId,
                currentBlock.SortOrder - 1,
                currentBlock.IndentLevel,
                ProseMirrorConverter.EmptyParagraphJson);
            await ReloadBlocksAsync(insertedBlock.Id, true);
            return;
        }

        // The text left of the caret stays in this block.
        BlockContentService.SetContentJson(currentBlock, splitRequest.BeforeJson);
        await Repository.SaveBlockAsync(currentBlock);

        // The text right of the caret becomes the next sibling. List items continue their own
        // type; headings and quotes drop to a paragraph.
        Block newBlock = await Repository.InsertBlockAfterAsync(
            PageId,
            currentBlock.ParentBlockId,
            currentBlock.SortOrder,
            currentBlock.IndentLevel,
            splitRequest.AfterJson);

        BlockType splitType = DetermineSplitType(currentBlock.BlockType);
        if (newBlock.BlockType != splitType)
        {
            BlockContentService.ConvertType(newBlock, splitType);
            await Repository.SaveBlockAsync(newBlock);
        }

        await ReloadBlocksAsync(newBlock.Id, false);
    }

    /// <summary>
    /// Enter on an empty block. A list item outdents one level and becomes a paragraph at level
    /// zero; any other empty block simply gets a fresh empty block after it.
    /// </summary>
    private async Task HandleEmptyBlockEnterAsync(Block currentBlock)
    {
        if (IsListBlock(currentBlock.BlockType))
        {
            if (currentBlock.IndentLevel > 0)
            {
                currentBlock.IndentLevel -= 1;
                await Repository.SaveBlockAsync(currentBlock);
                await ReloadBlocksAsync(currentBlock.Id, false);
                return;
            }

            BlockContentService.ConvertType(currentBlock, BlockType.Paragraph);
            await Repository.SaveBlockAsync(currentBlock);
            await ReloadBlocksAsync(currentBlock.Id, false, true);
            return;
        }

        Block newBlock = await Repository.InsertBlockAfterAsync(
            PageId,
            currentBlock.ParentBlockId,
            currentBlock.SortOrder,
            currentBlock.IndentLevel,
            ProseMirrorConverter.EmptyParagraphJson);
        await ReloadBlocksAsync(newBlock.Id, true);
    }

    /// <summary>
    /// The fallback for Enter on a block that cannot be divided (a divider, for example): add an
    /// empty block after it.
    /// </summary>
    private async Task SplitBlockAsync(Guid blockId)
    {
        Block? currentBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (currentBlock is null)
        {
            return;
        }

        Block newBlock = await Repository.InsertBlockAfterAsync(
            PageId,
            currentBlock.ParentBlockId,
            currentBlock.SortOrder,
            currentBlock.IndentLevel,
            ProseMirrorConverter.EmptyParagraphJson);
        await ReloadBlocksAsync(newBlock.Id, true);
    }

    /// <summary>
    /// Backspace at the start of a block. A list item outdents one level first and only merges
    /// once it is at level zero. Otherwise the block's content is appended to its PREVIOUS
    /// SIBLING, which keeps that block's type.
    /// </summary>
    private async Task MergeBlockUpwardAsync(Guid blockId)
    {
        Block? currentBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (currentBlock is null)
        {
            return;
        }

        if (IsListBlock(currentBlock.BlockType) && currentBlock.IndentLevel > 0)
        {
            currentBlock.IndentLevel -= 1;
            await Repository.SaveBlockAsync(currentBlock);
            await ReloadBlocksAsync(blockId, false);
            return;
        }

        List<Block> siblings = ReadChildren(currentBlock.ParentBlockId).ToList();
        int index = siblings.FindIndex(candidate => candidate.Id == blockId);
        if (index <= 0)
        {
            return;
        }

        Block previousBlock = siblings[index - 1];

        // An empty block just disappears.
        if (BlockContentService.ReadPlainText(currentBlock).Length == 0)
        {
            await Repository.DeleteBlockAsync(currentBlock.Id);
            await ReloadBlocksAsync(previousBlock.Id, true, true);
            return;
        }

        // Merge as inline content, keeping the previous block's node type and marks. Joining the
        // two blocks' Markdown instead would weld their types together (a heading would swallow
        // the paragraph after it).
        BlockContentService.MergeInto(previousBlock, currentBlock);
        await Repository.SaveBlockAsync(previousBlock);
        await Repository.DeleteBlockAsync(currentBlock.Id);
        await ReloadBlocksAsync(previousBlock.Id, true, true);
    }

    private async Task ChangeIndentAsync(Guid blockId, int direction)
    {
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null)
        {
            return;
        }

        int newIndentLevel = block.IndentLevel + direction;
        if (newIndentLevel < 0)
        {
            newIndentLevel = 0;
        }
        if (newIndentLevel > 5)
        {
            newIndentLevel = 5;
        }
        block.IndentLevel = newIndentLevel;
        await Repository.SaveBlockAsync(block);
        await ReloadBlocksAsync(blockId, false);
    }

    /// <summary>
    /// Moves the caret to the previous or next SIBLING of the given block.
    /// </summary>
    private async Task MoveFocusAsync(Guid blockId, int offset)
    {
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null)
        {
            return;
        }

        List<Block> siblings = ReadChildren(block.ParentBlockId).ToList();
        int index = siblings.FindIndex(candidate => candidate.Id == blockId);
        int targetIndex = index + offset;
        if (index < 0 || targetIndex < 0 || targetIndex >= siblings.Count)
        {
            return;
        }

        Guid targetBlockId = siblings[targetIndex].Id;
        focusedBlockId = targetBlockId;
        if (editorComponents.TryGetValue(targetBlockId, out BlockEditor? targetEditor))
        {
            if (offset < 0)
            {
                await targetEditor.PlaceCaretAtEndAsync();
            }
            else
            {
                await targetEditor.PlaceCaretAtStartAsync();
            }
        }
    }

    /// <summary>
    /// The type the right-hand half of a split becomes. List items continue their own type so
    /// Enter extends a list; headings, quotes and code drop to a paragraph.
    /// </summary>
    private static BlockType DetermineSplitType(BlockType sourceType)
    {
        if (IsListBlock(sourceType))
        {
            return sourceType;
        }
        return BlockType.Paragraph;
    }

    private static bool IsListBlock(BlockType blockType)
    {
        return blockType == BlockType.BulletedListItem
            || blockType == BlockType.NumberedListItem
            || blockType == BlockType.ToDo;
    }
}
