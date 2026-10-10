using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The column operations of <see cref="PageRepository"/>: wrapping a block into a column, adding
/// a block as a new column beside an existing one, moving a block out of a column, and the
/// collapse that keeps a degenerate column list from surviving.
///
/// The shape follows Notion's recovered behaviour: a side drop wraps the TARGET block into a new
/// <see cref="BlockType.Column"/>, and the dragged block is MOVED into a new sibling column
/// (never copied). When a column is emptied the column list is unwrapped back into plain blocks.
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

        return newColumn.Id;
    }

    /// <summary>
    /// Moves a block out of its column and back to the top level, placing it directly after the
    /// column list. Then collapses the column list if that leaves a degenerate shape.
    /// </summary>
    public async Task MoveBlockToTopLevelAsync(Guid pageId, Guid blockId)
    {
        Block? block = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == blockId);
        if (block?.ParentBlockId is not Guid columnId)
        {
            return;
        }

        Block? column = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == columnId);
        if (column?.ParentBlockId is not Guid columnListId)
        {
            return;
        }

        Block? columnList = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == columnListId);
        if (columnList is null)
        {
            return;
        }

        int insertionSortOrder = columnList.SortOrder + 1;
        await ShiftSiblingsAsync(pageId, null, insertionSortOrder, 1);

        block.ParentBlockId = null;
        block.SortOrder = insertionSortOrder;
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();

        await CollapseColumnListAsync(pageId, columnList.Id);
    }

    /// <summary>
    /// The empty-column collapse. Every column with no children is removed; if the list is then
    /// empty it is removed from the page; if exactly one column remains the list is UNWRAPPED —
    /// its children are moved out to the top level in place of the list and the list is deleted.
    /// A degenerate one-column column list is therefore never left behind.
    /// </summary>
    public async Task CollapseColumnListAsync(Guid pageId, Guid columnListId)
    {
        Block? columnList = await dbContext.Blocks.FirstOrDefaultAsync(block => block.Id == columnListId);
        if (columnList is null || columnList.BlockType != BlockType.ColumnList)
        {
            return;
        }

        List<Block> columns = await dbContext.Blocks
            .Where(block => block.ParentBlockId == columnListId)
            .OrderBy(block => block.SortOrder)
            .ToListAsync();

        foreach (Block column in columns)
        {
            bool isEmptyColumn = !await dbContext.Blocks.AnyAsync(block => block.ParentBlockId == column.Id);
            if (isEmptyColumn)
            {
                dbContext.Blocks.Remove(column);
            }
        }
        await dbContext.SaveChangesAsync();

        List<Block> remainingColumns = await dbContext.Blocks
            .Where(block => block.ParentBlockId == columnListId)
            .OrderBy(block => block.SortOrder)
            .ToListAsync();

        if (remainingColumns.Count == 0)
        {
            dbContext.Blocks.Remove(columnList);
            await dbContext.SaveChangesAsync();
            return;
        }

        if (remainingColumns.Count > 1)
        {
            return;
        }

        await UnwrapColumnListAsync(pageId, columnList, remainingColumns[0]);
    }

    private async Task UnwrapColumnListAsync(Guid pageId, Block columnList, Block survivingColumn)
    {
        List<Block> survivorsChildren = await dbContext.Blocks
            .Where(block => block.ParentBlockId == survivingColumn.Id)
            .OrderBy(block => block.SortOrder)
            .ToListAsync();

        int insertionSortOrder = columnList.SortOrder;
        await ShiftSiblingsAsync(pageId, null, insertionSortOrder, survivorsChildren.Count);

        int offset = 0;
        foreach (Block child in survivorsChildren)
        {
            child.ParentBlockId = null;
            child.SortOrder = insertionSortOrder + offset;
            offset++;
        }
        await dbContext.SaveChangesAsync();

        dbContext.Blocks.Remove(survivingColumn);
        dbContext.Blocks.Remove(columnList);
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();
    }

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

    private async Task<bool> IsColumnAsync(Guid blockId)
    {
        BlockType? blockType = await dbContext.Blocks
            .Where(block => block.Id == blockId)
            .Select(block => (BlockType?)block.BlockType)
            .FirstOrDefaultAsync();
        return blockType == BlockType.Column;
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
