using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The backlink operations of <see cref="PageRepository"/>: finding which pages reference a given
/// page.
///
/// Notion keeps a STORED, server-pushed backlink index (recovered from its cache: the client merges
/// `createdBacklinks` / `deletedBacklinks` deltas and never scans). Yanoch has no server to maintain
/// such an index and no reference table, so this is a READ-TIME SCAN of the stored ProseMirror JSON
/// for a link to the page. That is a deliberate MVP divergence: it produces the same answer for a
/// local workspace, and it costs a scan instead of an indexed lookup.
///
/// What it does NOT give, and what the dev-branch version would need: delta updates, and Notion's
/// `inaccessibleBacklinkCount` semantics (a reference to a page the viewer may not read is counted,
/// never shown). With a single shared local workspace every page is readable, so the count has no
/// meaning yet.
/// </summary>
public sealed partial class PageRepository
{
    /// <summary>
    /// The pages that reference <paramref name="targetPageId"/> from one of their blocks, ordered
    /// by most recently updated. The page itself is excluded, so a page linking to itself does not
    /// appear in its own list.
    /// </summary>
    /// <remarks>
    /// A reference is a `link` mark whose href is the page path, which is the only cross-page
    /// reference this app can currently create. The match is on the stored JSON text rather than on
    /// a parsed structure because the reference can sit anywhere inside a block's document, and
    /// SQLite is doing the filtering: pulling every block into memory to parse it would be the
    /// wrong trade for a scan that is already the MVP shortcut.
    /// </remarks>
    public async Task<List<Page>> ReadBacklinkPagesAsync(Guid targetPageId)
    {
        string pagePathFragment = BuildPageReferenceFragment(targetPageId);

        List<Guid> referencingPageIds = await dbContext.Blocks
            .Where(block => block.ContentJson.Contains(pagePathFragment))
            .Select(block => block.PageId)
            .Distinct()
            .ToListAsync();

        if (referencingPageIds.Count == 0)
        {
            return new List<Page>();
        }

        List<Page> referencingPages = await dbContext.Pages
            .Where(page => referencingPageIds.Contains(page.Id) && page.Id != targetPageId)
            .OrderByDescending(page => page.UpdatedAtUtc)
            .ToListAsync();
        return referencingPages;
    }

    /// <summary>
    /// The path fragment a reference to a page carries, e.g. <c>/page/&lt;guid&gt;</c>. Both the
    /// reference creator and this scan build it here, so the two cannot disagree about the shape.
    /// </summary>
    public static string BuildPageReferenceFragment(Guid pageId)
    {
        string fragment = $"/page/{pageId:D}";
        return fragment;
    }
}
