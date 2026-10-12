using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The column LOOKUPS of <see cref="PageRepository"/>: resolving a block to the column or column
/// list that contains it, and testing a block's type.
///
/// Every one of these is a read. Callers use them to capture a container's identity BEFORE they
/// rewrite parentage, because after a move the old container is no longer reachable from the block
/// — and an emptied container has to be collapsed afterwards.
/// </summary>
public sealed partial class PageRepository
{
    /// <summary>
    /// The column that directly holds the given block, or null when the block sits at the top
    /// level or directly under a column list.
    /// </summary>
    public async Task<Guid?> ReadEnclosingColumnIdAsync(Guid blockId)
    {
        Block? block = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == blockId);
        if (block is null)
        {
            return null;
        }
        Block? column = await ReadEnclosingColumnAsync(block);
        return column?.Id;
    }

    /// <summary>
    /// The column list a block belongs to: the list itself when the block IS a column, or the list
    /// above the block's column when it sits inside one. Null at the top level.
    /// </summary>
    public async Task<Guid?> ReadEnclosingColumnListIdAsync(Guid blockId)
    {
        Block? block = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == blockId);
        if (block is null)
        {
            return null;
        }
        return await ReadEnclosingColumnListAsync(block);
    }

    private async Task<Block?> ReadEnclosingColumnAsync(Block block)
    {
        if (block.ParentBlockId is not Guid parentId)
        {
            return null;
        }
        Block? parent = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == parentId);
        return parent?.BlockType == BlockType.Column ? parent : null;
    }

    private async Task<Guid?> ReadEnclosingColumnListAsync(Block block)
    {
        if (block.BlockType == BlockType.ColumnList)
        {
            return block.Id;
        }
        if (block.ParentBlockId is not Guid parentId)
        {
            return null;
        }

        Block? parent = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == parentId);
        if (parent is null)
        {
            return null;
        }
        if (parent.BlockType == BlockType.ColumnList)
        {
            return parent.Id;
        }
        if (parent.BlockType == BlockType.Column)
        {
            return parent.ParentBlockId;
        }
        return null;
    }

    private async Task<bool> IsColumnAsync(Guid blockId)
    {
        BlockType? blockType = await dbContext.Blocks
            .Where(block => block.Id == blockId)
            .Select(block => (BlockType?)block.BlockType)
            .FirstOrDefaultAsync();
        return blockType == BlockType.Column;
    }
}
