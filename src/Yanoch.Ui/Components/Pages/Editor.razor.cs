using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Yanoch.Data;
using Yanoch.Data.Repositories;
using Yanoch.Domain;
using Yanoch.Domain.Services;
using Yanoch.Ui.Components.Editor;
using Yanoch.Ui.Interop;
using Yanoch.Ui.Services;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// Page editor coordination. Markup lives in Editor.razor; the block mutations live in the
/// sibling partials <c>Editor.BlockOperations.razor.cs</c> and
/// <c>Editor.SplitOperations.razor.cs</c>; Markdown import and export live in
/// <c>Editor.Markdown.razor.cs</c>. This file owns the shared state, the lifecycle, the editor
/// event router and the block-tree helpers.
/// </summary>
public partial class Editor
{
    [Parameter]
    public Guid PageId { get; set; }

    [Inject]
    private PageRepository Repository { get; set; } = default!;

    [Inject]
    private MediaCleanupService MediaCleanup { get; set; } = default!;

    [Inject]
    private BlockEditorInterop EditorInterop { get; set; } = default!;

    [Inject]
    private FileInterop FileInterop { get; set; } = default!;

    [Inject]
    private ThemeService ThemeService { get; set; } = default!;

    [Inject]
    private ToggleStateService ToggleState { get; set; } = default!;

    [Inject]
    private NavigationManager Navigation { get; set; } = default!;

    private Page? currentPage;

    /// <summary>
    /// Every block of the page, flat. Ordering is per PARENT, so use <see cref="ReadChildren"/>
    /// to get an ordered sibling list rather than sorting this directly.
    /// </summary>
    private List<Block> orderedBlocks = new List<Block>();

    private List<BlockEditorModel> editorModels = new List<BlockEditorModel>();
    private Dictionary<Guid, BlockEditor> editorComponents = new Dictionary<Guid, BlockEditor>();

    /// <summary>
    /// The pages that reference this one, shown under the editor. Loaded once per page load by the
    /// read-time scan in the repository; there is no reference index to keep in step.
    /// </summary>
    private IReadOnlyList<Page> backlinkPages = Array.Empty<Page>();
    private Guid? focusedBlockId;
    private Guid? slashMenuBlockId;
    private Guid? draggingBlockId;
    private Guid? dragOverBlockId;
    private bool isLoading = true;
    private bool isDarkMode = true;

    /// <summary>
    /// Sentinel drop target meaning "after the last block". It is not a real block id, so the
    /// move code treats it as the end of the list.
    /// </summary>
    private static readonly Guid EndDropTargetId = Guid.Empty;

    protected override async Task OnParametersSetAsync()
    {
        isLoading = true;
        currentPage = await Repository.GetPageAsync(PageId);
        if (currentPage is null)
        {
            isLoading = false;
            return;
        }

        orderedBlocks = currentPage.Blocks.ToList();
        BuildEditorModels();
        backlinkPages = await Repository.ReadBacklinkPagesAsync(PageId);
        isDarkMode = ThemeService.IsDarkMode;
        isLoading = false;

        // Sweep orphaned media once the page has loaded. Deleting an image block leaves its file on
        // disk so an undo can still reach it; this is what eventually collects those files, after a
        // grace period and only when no page anywhere still references them. It runs off the render
        // path so a slow or failing sweep cannot delay or break the page.
        _ = SweepMediaInBackgroundAsync();
    }

    private async Task SweepMediaInBackgroundAsync()
    {
        try
        {
            await MediaCleanup.SweepUnreferencedFilesAsync();
        }
        catch (Exception sweepException)
        {
            // A sweep is housekeeping. A failure here must never surface as a broken page.
            Console.Error.WriteLine($"Media sweep failed: {sweepException.Message}");
        }
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await ThemeService.InitialiseAsync();
            isDarkMode = ThemeService.IsDarkMode;
            StateHasChanged();
        }
    }

    /// <summary>
    /// The ordered children of one parent, or the top level blocks when the parent is null.
    /// </summary>
    private IReadOnlyList<Block> ReadChildren(Guid? parentBlockId)
    {
        return orderedBlocks
            .Where(block => block.ParentBlockId == parentBlockId)
            .OrderBy(block => block.SortOrder)
            .ToList();
    }

    private IReadOnlyDictionary<Guid, BlockEditorModel> ReadEditorModelMap()
    {
        return editorModels.ToDictionary(model => model.BlockId);
    }

    private void BuildEditorModels()
    {
        // The numbered-list markers are computed per SIBLING LIST, so the pass runs over the
        // children of every parent rather than over the flat list. Doing it flat would run the
        // numbering straight through a column boundary or a toggle's children.
        Dictionary<Guid, string> listMarkers = new Dictionary<Guid, string>();
        foreach (Guid? parentBlockId in orderedBlocks
            .Select(block => block.ParentBlockId)
            .Distinct()
            .ToList())
        {
            IReadOnlyDictionary<Guid, string> parentMarkers = OrderedListNumbering.ComputeMarkers(ReadChildren(parentBlockId));
            foreach (KeyValuePair<Guid, string> marker in parentMarkers)
            {
                listMarkers[marker.Key] = marker.Value;
            }
        }

        editorModels = orderedBlocks
            .Where(block => !block.IsContainer)
            .Select(block => new BlockEditorModel
            {
                BlockId = block.Id,
                ContentJson = block.ContentJson,
                IndentLevel = block.IndentLevel,
                AutoFocus = focusedBlockId == block.Id,
                ListMarker = listMarkers.TryGetValue(block.Id, out string? marker) ? marker : string.Empty,
            })
            .ToList();
    }

    private void CaptureEditorComponent(BlockEditor editorComponent)
    {
        editorComponents[editorComponent.Model.BlockId] = editorComponent;
    }

    private BlockEditorModel ReadEditorModel(Guid blockId)
    {
        BlockEditorModel? model = editorModels.FirstOrDefault(candidate => candidate.BlockId == blockId);
        return model ?? new BlockEditorModel { BlockId = blockId };
    }

    private async Task HandleEditorEventAsync(EditorEvent editorEvent)
    {
        switch (editorEvent.Kind)
        {
            case EditorEventKind.Changed:
                await ApplyContentChangeAsync(editorEvent);
                break;
            case EditorEventKind.Focused:
                focusedBlockId = editorEvent.BlockId;
                break;
            case EditorEventKind.Enter:
                await SplitBlockAsync(editorEvent.BlockId);
                break;
            case EditorEventKind.Split:
                if (editorEvent.SplitRequest is not null)
                {
                    await SplitBlockAtCaretAsync(editorEvent.BlockId, editorEvent.SplitRequest);
                }
                break;
            case EditorEventKind.BackspaceAtStart:
                await MergeBlockUpwardAsync(editorEvent.BlockId);
                break;
            case EditorEventKind.ArrowUp:
                await MoveFocusAsync(editorEvent.BlockId, -1);
                break;
            case EditorEventKind.ArrowDown:
                await MoveFocusAsync(editorEvent.BlockId, 1);
                break;
            case EditorEventKind.Indent:
                await ChangeIndentAsync(editorEvent.BlockId, 1);
                break;
            case EditorEventKind.Outdent:
                await ChangeIndentAsync(editorEvent.BlockId, -1);
                break;
            case EditorEventKind.Slash:
                slashMenuBlockId = editorEvent.BlockId;
                break;
            case EditorEventKind.DividerShortcut:
                await CompleteDividerShortcutAsync(editorEvent.BlockId);
                break;
        }
    }

    private async Task ApplyContentChangeAsync(EditorEvent editorEvent)
    {
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == editorEvent.BlockId);
        if (block is null || editorEvent.ContentJson is null || block.IsContainer)
        {
            return;
        }
        BlockContentService.SetContentJson(block, editorEvent.ContentJson);
        await Repository.SaveBlockAsync(block);
    }

    private async Task ToggleThemeAsync()
    {
        await ThemeService.ToggleAsync();
        isDarkMode = ThemeService.IsDarkMode;
        StateHasChanged();
    }

    private BlockEditor? ReadEditorComponent(Guid blockId)
    {
        editorComponents.TryGetValue(blockId, out BlockEditor? editorComponent);
        return editorComponent;
    }

    private async Task ReloadBlocksAsync(Guid? focusBlockId, bool focusAtEnd, bool pushContent = false)
    {
        Page? reloadedPage = await Repository.GetPageAsync(PageId);
        if (reloadedPage is null)
        {
            return;
        }
        currentPage = reloadedPage;
        orderedBlocks = reloadedPage.Blocks.ToList();
        focusedBlockId = focusBlockId;
        BuildEditorModels();
        StateHasChanged();

        if (focusBlockId is not null && editorComponents.TryGetValue(focusBlockId.Value, out BlockEditor? editor))
        {
            if (pushContent)
            {
                Block? serverBlock = orderedBlocks.FirstOrDefault(candidate => candidate.Id == focusBlockId.Value);
                if (serverBlock is not null)
                {
                    await editor.SetContentAsync(serverBlock.ContentJson);
                }
            }
            if (focusAtEnd)
            {
                await editor.PlaceCaretAtEndAsync();
            }
            else
            {
                await editor.FocusAsync();
            }
        }
    }
}
