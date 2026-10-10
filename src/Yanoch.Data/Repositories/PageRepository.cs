using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;
using Yanoch.Domain.Services;

namespace Yanoch.Data.Repositories;

/// <summary>
/// All reads and writes of <see cref="Page"/> and its <see cref="Block"/>s go through this
/// repository. It keeps three invariants the rest of the app relies on: a page's blocks are
/// always returned in sort order, a block's derived columns are only ever written through
/// <see cref="BlockContentService"/>, and ordering is scoped to the PARENT — a block's
/// <see cref="Block.SortOrder"/> is its index among its siblings, not among the whole page.
/// The column operations live in the sibling partial <c>PageRepository.Columns.cs</c>.
/// </summary>
public sealed partial class PageRepository
{
    private readonly YanochDbContext dbContext;

    public PageRepository(YanochDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<List<Page>> ListPagesAsync()
    {
        List<Page> pages = await dbContext.Pages
            .OrderByDescending(page => page.UpdatedAtUtc)
            .ToListAsync();
        return pages;
    }

    public async Task<Page?> GetPageAsync(Guid pageId)
    {
        Page? page = await dbContext.Pages
            .Include(page => page.Blocks)
            .FirstOrDefaultAsync(page => page.Id == pageId);
        if (page is not null)
        {
            page.Blocks = page.Blocks.OrderBy(block => block.SortOrder).ToList();
        }
        return page;
    }

    public async Task<Page> CreatePageAsync(string title)
    {
        Page page = new Page { Title = title };
        Block firstBlock = new Block
        {
            PageId = page.Id,
            SortOrder = 0,
            IndentLevel = 0,
        };
        BlockContentService.SetContentJson(firstBlock, ProseMirrorConverter.EmptyParagraphJson);
        page.Blocks.Add(firstBlock);

        dbContext.Pages.Add(page);
        await dbContext.SaveChangesAsync();
        return page;
    }

    public async Task DeletePageAsync(Guid pageId)
    {
        Page? page = await dbContext.Pages.FirstOrDefaultAsync(candidate => candidate.Id == pageId);
        if (page is null)
        {
            return;
        }
        dbContext.Pages.Remove(page);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Block> AppendBlockAsync(Guid pageId, int indentLevel)
    {
        int nextSortOrder = await ReadNextSortOrderAsync(pageId, null);
        Block block = new Block
        {
            PageId = pageId,
            ParentBlockId = null,
            SortOrder = nextSortOrder,
            IndentLevel = indentLevel,
        };
        BlockContentService.SetContentJson(block, ProseMirrorConverter.EmptyParagraphJson);

        dbContext.Blocks.Add(block);
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();
        return block;
    }

    /// <summary>
    /// Inserts a new block directly after the block at <paramref name="afterSortOrder"/> and
    /// shifts its later SIBLINGS down by one. The caller supplies the content so a split can
    /// store the caret's right-hand half instead of an empty paragraph.
    /// </summary>
    public async Task<Block> InsertBlockAfterAsync(
        Guid pageId,
        Guid? parentBlockId,
        int afterSortOrder,
        int indentLevel,
        string contentJson)
    {
        List<Block> followingBlocks = await ReadSiblingsAsync(pageId, parentBlockId);
        foreach (Block followingBlock in followingBlocks.Where(block => block.SortOrder > afterSortOrder))
        {
            followingBlock.SortOrder = followingBlock.SortOrder + 1;
        }

        Block block = new Block
        {
            PageId = pageId,
            ParentBlockId = parentBlockId,
            SortOrder = afterSortOrder + 1,
            IndentLevel = indentLevel,
        };
        BlockContentService.SetContentJson(block, contentJson);

        dbContext.Blocks.Add(block);
        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();
        return block;
    }

    public async Task SaveBlockAsync(Block block)
    {
        dbContext.Blocks.Update(block);
        await TouchPageAsync(block.PageId);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteBlockAsync(Guid blockId)
    {
        Block? block = await dbContext.Blocks.FirstOrDefaultAsync(candidate => candidate.Id == blockId);
        if (block is null)
        {
            return;
        }
        dbContext.Blocks.Remove(block);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdatePageTitleAsync(Guid pageId, string title)
    {
        Page? page = await dbContext.Pages.FirstOrDefaultAsync(candidate => candidate.Id == pageId);
        if (page is null)
        {
            return;
        }
        page.Title = title;
        page.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Replaces the ordered SIBLINGS under one parent with the given blocks. Used by the editor
    /// when a structural change (reorder) affects several siblings at once.
    /// </summary>
    /// <remarks>
    /// Only blocks whose <see cref="Block.ParentBlockId"/> matches are touched, so reordering the
    /// top level cannot disturb the contents of a column. The deletes are flushed in their own
    /// <c>SaveChanges</c> before the re-inserts: doing both in one call makes the change tracker
    /// hold the same primary key as both Deleted and Added and EF emits the INSERT first, which
    /// fails with a UNIQUE constraint violation.
    /// </remarks>
    public async Task ReplaceSiblingsAsync(Guid pageId, Guid? parentBlockId, IReadOnlyList<Block> orderedSiblings)
    {
        List<Block> existingSiblings = await ReadSiblingsAsync(pageId, parentBlockId);
        dbContext.Blocks.RemoveRange(existingSiblings);
        await dbContext.SaveChangesAsync();

        for (int index = 0; index < orderedSiblings.Count; index++)
        {
            Block block = orderedSiblings[index];
            block.PageId = pageId;
            block.ParentBlockId = parentBlockId;
            block.SortOrder = index;
            dbContext.Blocks.Add(block);
        }

        await TouchPageAsync(pageId);
        await dbContext.SaveChangesAsync();
    }

    private async Task<List<Block>> ReadSiblingsAsync(Guid pageId, Guid? parentBlockId)
    {
        List<Block> siblings = await dbContext.Blocks
            .Where(block => block.PageId == pageId && block.ParentBlockId == parentBlockId)
            .ToListAsync();
        return siblings;
    }

    private async Task<int> ReadNextSortOrderAsync(Guid pageId, Guid? parentBlockId)
    {
        List<Block> siblings = await ReadSiblingsAsync(pageId, parentBlockId);
        if (siblings.Count == 0)
        {
            return 0;
        }
        return siblings.Max(block => block.SortOrder) + 1;
    }

    private async Task TouchPageAsync(Guid pageId)
    {
        Page? page = await dbContext.Pages.FirstOrDefaultAsync(candidate => candidate.Id == pageId);
        if (page is not null)
        {
            page.UpdatedAtUtc = DateTime.UtcNow;
        }
    }
}
