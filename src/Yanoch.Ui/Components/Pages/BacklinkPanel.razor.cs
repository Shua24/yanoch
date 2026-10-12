using Yanoch.Domain;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// The backlinks panel: the list of pages that reference this page, shown under the editor.
///
/// Notion's equivalent is a "linked references" section whose entries resolve to the referencing
/// BLOCK and scroll to it. This MVP lists the referencing PAGES and navigates to them, because the
/// read-time scan returns pages (see <c>PageRepository.ReadBacklinkPagesAsync</c>) and resolving an
/// entry to an exact block would need the reference index Notion has and this does not.
///
/// The panel renders NOTHING when there are no backlinks, which is what Notion does: an empty
/// "Linked references" heading would be noise on every page.
/// </summary>
public partial class BacklinkPanel
{
    [Microsoft.AspNetCore.Components.Parameter]
    public IReadOnlyList<Page> Pages { get; set; } = Array.Empty<Page>();

    private string BuildPageHref(Guid pageId)
    {
        string href = $"/page/{pageId}";
        return href;
    }

    private string ReadPageLabel(Page backlinkPage)
    {
        if (!string.IsNullOrWhiteSpace(backlinkPage.Title))
        {
            return backlinkPage.Title;
        }
        return "Untitled";
    }
}
