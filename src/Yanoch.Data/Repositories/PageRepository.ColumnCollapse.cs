using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The column operations of <see cref="PageRepository"/> that REMOVE columns: moving a block out
/// of its column, removing an emptied column, and the collapse that unwraps a degenerate column
/// list back into plain blocks.
///
/// The rule these exist to enforce: a column list never survives with fewer than two columns, and
/// no column survives with no children. An emptied column left behind renders as a stray blank
/// cell, and — worse — the list around it stays alive, so the next side drop nests a second column
/// list inside the first instead of reusing it.
/// </summary>
public sealed partial class PageRepository
{
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
    /// Removes a column an operation has left empty, then collapses its list if that leaves a
    /// degenerate shape (a one-column list, or none at all).
    ///
    /// Every path that pulls a block out of a column must call this with the column captured
    /// BEFORE the parentage was rewritten.
    /// </summary>
    public async Task CollapseEmptiedColumnAsync(Guid pageId, Guid? columnId)
    {
        if (columnId is not Guid targetColumnId)
        {
            return;
        }

        Block? column = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == targetColumnId);
        if (column is null || column.BlockType != BlockType.Column)
        {
            return;
        }

        Guid? columnListId = column.ParentBlockId;
        bool isEmptied = !await dbContext.Blocks.AnyAsync(candidate => candidate.ParentBlockId == targetColumnId);
        if (!isEmptied)
        {
            return;
        }

        dbContext.Blocks.Remove(column);
        await dbContext.SaveChangesAsync();

        if (columnListId is not null)
        {
            await CollapseColumnListAsync(pageId, columnListId.Value);
        }
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
}
