using Yanoch.Data.Repositories;
using Yanoch.Domain;
using Yanoch.Ui.Components.Editor;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// Creating a reference to another page. A reference is an ordinary `link` mark whose href is the
/// page path — the same shape the backlink scan looks for, so the two halves of the feature cannot
/// disagree about what a reference is.
///
/// Notion instead writes a mention annotation when you type `@` and its server maintains the
/// backlink index from that. This app has no annotation model and no server index, so the MVP
/// reuses the link mark the editor already has, and the backlinks panel finds it by scanning.
///
/// The link is inserted into the block the user was last editing, at the caret. With no focused
/// block there is nowhere to put it, so the picker refuses rather than guessing a target.
/// </summary>
public partial class Editor
{
    private bool isLinkPickerOpen;
    private IReadOnlyList<Page> linkPickerPages = Array.Empty<Page>();

    private async Task ToggleLinkPickerAsync()
    {
        if (isLinkPickerOpen)
        {
            isLinkPickerOpen = false;
            return;
        }

        if (focusedBlockId is null)
        {
            // No caret, no insertion point: say so instead of silently doing nothing.
            return;
        }

        List<Page> allPages = await Repository.ListPagesAsync();
        linkPickerPages = allPages.Where(candidate => candidate.Id != PageId).ToList();
        isLinkPickerOpen = true;
    }

    private async Task InsertPageLinkAsync(Page targetPage)
    {
        isLinkPickerOpen = false;
        if (focusedBlockId is not Guid blockId)
        {
            return;
        }

        BlockEditor? editor = ReadEditorComponent(blockId);
        if (editor is null)
        {
            return;
        }

        string pageLabel = string.IsNullOrWhiteSpace(targetPage.Title) ? "Untitled" : targetPage.Title;
        string pageHref = PageRepository.BuildPageReferenceFragment(targetPage.Id);
        await editor.InsertPageLinkAsync(pageLabel, pageHref);
        await editor.FocusAsync();
    }
}
