using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The TOGGLE operations of <see cref="PageRepository"/>: moving a block under a toggle so it
/// becomes one of the toggle's children.
///
/// A toggle is the only block that owns children through real parentage rather than through a
/// column cell, so this is the one place outside the column code that rewrites
/// <see cref="Block.ParentBlockId"/>. It is a different nesting mechanism from list indentation
/// (<see cref="Block.IndentLevel"/>), which is untouched here.
/// </summary>
public sealed partial class PageRepository
{
    /// <summary>
    /// Moves a block so it becomes the LAST child of <paramref name="newParentBlockId"/>, and
    /// compacts the sibling ordering it left behind.
    ///
    /// Compacting matters: <see cref="Block.SortOrder"/> is scoped to the parent, and a gap left in
    /// the old parent's sequence is the same latent bug the column code guards against — the next
    /// insert at a computed index lands in the wrong place.
    /// </summary>
    /// <returns>True when the block moved, false when either block is missing or the move is a no-op.</returns>
    public async Task<bool> MoveBlockIntoParentAsync(Guid pageId, Guid blockId, Guid newParentBlockId)
    {
        if (blockId == newParentBlockId)
        {
            return false;
        }

        Block? block = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == blockId);
        Block? newParent = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == newParentBlockId);
        if (block is null || newParent is null)
        {
            return false;
        }

        Guid? previousParentBlockId = block.ParentBlockId;

        // Detach from the old parent's ordering FIRST, so the two sibling sets are never both
        // rewritten against a half-updated block.
        if (previousParentBlockId is Guid previousParentId)
        {
            await CompactSiblingOrderAsync(pageId, previousParentId);
        }

        int nextSortOrder = await ReadNextSortOrderAsync(pageId, newParentBlockId);
        block.ParentBlockId = newParentBlockId;
        block.SortOrder = nextSortOrder;

        // A block indented into a toggle keeps its list indentation; the two mechanisms are
        // independent, and clearing it here would silently drop a nested list level.
        dbContext.Blocks.Update(block);
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Renumbers a parent's children to 0, 1, 2 … in their current order, closing any gap left by a
    /// departure. Skipped entirely when the parent has no children left, which is the normal case
    /// when the moved block was its only child.
    /// </summary>
    private async Task CompactSiblingOrderAsync(Guid pageId, Guid parentBlockId)
    {
        List<Block> remainingSiblings = await ReadSiblingsAsync(pageId, parentBlockId);
        if (remainingSiblings.Count == 0)
        {
            return;
        }

        int expectedOrder = 0;
        foreach (Block sibling in remainingSiblings.OrderBy(candidate => candidate.SortOrder))
        {
            if (sibling.SortOrder != expectedOrder)
            {
                sibling.SortOrder = expectedOrder;
                dbContext.Blocks.Update(sibling);
            }
            expectedOrder += 1;
        }
    }
}
