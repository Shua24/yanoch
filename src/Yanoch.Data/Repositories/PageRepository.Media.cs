using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data.Repositories;

/// <summary>
/// The media operations of <see cref="PageRepository"/>: finding which stored image files are still
/// referenced, and which can be cleaned up.
///
/// An uploaded image is referenced by the stored name inside a block's ProseMirror JSON, so the
/// question "is this file still used?" is a scan over every block on every page. The scan is scoped
/// to the WHOLE database rather than to one page on purpose: a sweep that only looked at the page
/// being loaded would delete the images belonging to every other page.
///
/// Like the backlink scan, this is a read-time scan and a deliberate MVP divergence from Notion,
/// which stores its references server-side.
/// </summary>
public sealed partial class PageRepository
{
    /// <summary>
    /// Every stored media name referenced by any block on any page. The returned set is what a
    /// cleanup sweep must treat as in use.
    /// </summary>
    /// <remarks>
    /// The names are extracted in memory rather than in SQL. A SQLite <c>LIKE</c> can tell whether a
    /// block mentions a KNOWN name, but the sweep needs the opposite direction: the full set of
    /// names that appear anywhere, to compare against the files on disk. Pulling the image-bearing
    /// blocks and reading their attribute values is the honest way to get that set.
    /// </remarks>
    public async Task<HashSet<string>> ReadReferencedMediaNamesAsync()
    {
        // Only blocks that can hold an image are read: the scan looks for the image node's type
        // marker, so an unrelated block whose text happens to contain the word is not pulled in.
        List<string> imageBlockContents = await dbContext.Blocks
            .Where(block => block.ContentJson.Contains(ProseMirrorConverter.ImageNodeMarker))
            .Select(block => block.ContentJson)
            .ToListAsync();

        HashSet<string> referencedNames = new HashSet<string>(StringComparer.Ordinal);
        foreach (string contentJson in imageBlockContents)
        {
            ProseMirrorConverter.AppendReferencedMediaNames(contentJson, referencedNames);
        }
        return referencedNames;
    }
}
