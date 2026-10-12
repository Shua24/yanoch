using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The column operations of <see cref="PageRepository"/> that CREATE columns: wrapping a block
/// into a new column list, and adding a block as a new column beside an existing one.
///
/// The shape follows Notion's recovered behaviour: a side drop wraps the TARGET block into a new
/// <see cref="BlockType.Column"/>, and the dragged block is MOVED into a new sibling column
/// (never copied). When a column is emptied the column list is unwrapped back into plain blocks —
/// that half lives in <c>PageRepository.ColumnCollapse.cs</c>.
/// </summary>
public sealed partial class PageRepository
{
    /// <summary>
    /// Splits <paramref name="targetBlockId"/> sideways: the target block becomes the first
    /// column of a new column list and <paramref name="movedBlockId"/> becomes the second. When
    /// the target already lives inside a column, a new column is added to that existing list
    /// instead of nesting a second list inside it (nesting is capped at one level).
    /// </summary>
    /// <param name="placeMovedBefore">
    /// True when the dragged block was dropped on the LEFT of the target, so its column goes
    /// before the target's column.
    /// </param>
    /// <returns>The id of the moved block's new column, or null when nothing changed.</returns>
    public async Task<Guid?> SplitIntoColumnsAsync(Guid pageId, Guid targetBlockId, Guid movedBlockId, bool placeMovedBefore)
    {
        if (targetBlockId == movedBlockId)
        {
            return null;
        }

        Block? targetBlock = await dbContext.Blocks.FirstOrDefaultAsync(block => block.Id == targetBlockId);
        Block? movedBlock = await dbContext.Blocks.FirstOrDefaultAsync(block => block.Id == movedBlockId);
        if (targetBlock is null || movedBlock is null)
        {
            return null;
        }

        // The column the moved block is leaving, captured BEFORE the move: pulling the block out
        // can empty that column, and an emptied column leaves a degenerate shape behind unless it
        // is collapsed afterwards. Recorded here because the parentage is rewritten below and the
        // source would otherwise be unrecoverable.
        Guid? sourceColumnId = await ReadEnclosingColumnIdAsync(movedBlockId);

        Block columnList;
        Block targetColumn;
        if (targetBlock.ParentBlockId is Guid existingColumnId && await IsColumnAsync(existingColumnId))
        {
            // The target already sits in a column, so reuse the existing list.
            Block? existingColumn = await dbContext.Blocks.FirstOrDefaultAsync(block => block.Id == existingColumnId);
            if (existingColumn?.ParentBlockId is not Guid existingListId)
            {
                return null;
            }
            Block? existingList = await dbContext.Blocks.FirstOrDefaultAsync(block => block.Id == existingListId);
            if (existingList is null)
            {
                return null;
            }
            columnList = existingList;
            targetColumn = existingColumn;
        }
        else
        {
            (columnList, targetColumn) = await WrapBlockIntoNewColumnListAsync(pageId, targetBlock);
        }

        int newColumnSortOrder = placeMovedBefore ? targetColumn.SortOrder : targetColumn.SortOrder + 1;
        await ShiftSiblingsAsync(pageId, columnList.Id, newColumnSortOrder, 1);

        Block newColumn = new Block
        {
            PageId = pageId,
            ParentBlockId = columnList.Id,
            SortOrder = newColumnSortOrder,
            BlockType = BlockType.Column,
            ContentJson = ProseMirrorConverter.EmptyParagraphJson,
        };
        dbContext.Blocks.Add(newColumn);
        await dbContext.SaveChangesAsync();

        // Move the dragged block into the new column and normalise its position there.
        movedBlock.ParentBlockId = newColumn.Id;
        movedBlock.SortOrder = 0;
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();

        // The move may have emptied the column the block came out of. Collapsing it here keeps the
        // tree from accumulating a stray blank cell, and stops a chain of side drops from nesting
        // column lists inside each other.
        await CollapseEmptiedColumnAsync(pageId, sourceColumnId);

        return newColumn.Id;
    }

    /// <summary>
    /// Wraps a top level block into a brand new column list: the list takes the block's place and
    /// the block becomes its first column.
    /// </summary>
    private async Task<(Block ColumnList, Block TargetColumn)> WrapBlockIntoNewColumnListAsync(Guid pageId, Block targetBlock)
    {
        int listSortOrder = targetBlock.SortOrder;
        Guid? listParentBlockId = targetBlock.ParentBlockId;

        await ShiftSiblingsAsync(pageId, listParentBlockId, listSortOrder, 1);

        Block columnList = new Block
        {
            PageId = pageId,
            ParentBlockId = listParentBlockId,
            SortOrder = listSortOrder,
            BlockType = BlockType.ColumnList,
            ContentJson = ProseMirrorConverter.EmptyParagraphJson,
        };
        dbContext.Blocks.Add(columnList);
        await dbContext.SaveChangesAsync();

        Block targetColumn = new Block
        {
            PageId = pageId,
            ParentBlockId = columnList.Id,
            SortOrder = 0,
            BlockType = BlockType.Column,
            ContentJson = ProseMirrorConverter.EmptyParagraphJson,
        };
        dbContext.Blocks.Add(targetColumn);
        await dbContext.SaveChangesAsync();

        targetBlock.ParentBlockId = targetColumn.Id;
        targetBlock.SortOrder = 0;
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();

        return (columnList, targetColumn);
    }

    /// <summary>
    /// Makes room at <paramref name="fromSortOrder"/> among one parent's children by pushing
    /// every sibling at or after it down by <paramref name="amount"/>.
    /// </summary>
    private async Task ShiftSiblingsAsync(Guid pageId, Guid? parentBlockId, int fromSortOrder, int amount)
    {
        List<Block> siblings = await ReadSiblingsAsync(pageId, parentBlockId);
        foreach (Block sibling in siblings.Where(block => block.SortOrder >= fromSortOrder))
        {
            sibling.SortOrder = sibling.SortOrder + amount;
        }
    }
}
