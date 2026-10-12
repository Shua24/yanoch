using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Yanoch.Ui.Components.Editor;

namespace Yanoch.Ui.Interop;

/// <summary>
/// Loads the bundled ProseMirror editor module once per circuit and forwards calls to it. Each
/// block editor lives in a small wrapper returned by <c>create</c>; this class keeps the module
/// reference so callers never re-import it.
/// </summary>
public sealed class BlockEditorInterop : IAsyncDisposable
{
    private const string ModulePath = "./js/yanoch-editor.js";

    private readonly IJSRuntime jsRuntime;
    private IJSObjectReference? editorModule;

    public BlockEditorInterop(IJSRuntime jsRuntime)
    {
        this.jsRuntime = jsRuntime;
    }

    public async Task<IJSObjectReference> EnsureModuleAsync()
    {
        if (editorModule is null)
        {
            editorModule = await jsRuntime.InvokeAsync<IJSObjectReference>("import", ModulePath);
        }
        return editorModule;
    }

    public async Task<IJSObjectReference> CreateEditorAsync(string editorId, ElementReference element, string contentJson, DotNetObjectReference<BlockEditor> dotNetReference, bool autoFocus)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        IJSObjectReference editor = await module.InvokeAsync<IJSObjectReference>(
            "create",
            editorId,
            element,
            contentJson,
            dotNetReference,
            new { autoFocus });
        return editor;
    }

    /// <summary>
    /// True when the block's editor is no longer mounted in the page. An entry can outlive the
    /// DOM that a Blazor re-render discarded, so this asks the editor whether its own nodes are
    /// still connected rather than trusting the registry alone.
    /// </summary>
    public async Task<bool> IsSurfaceEmptyAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        bool isMounted = await module.InvokeAsync<bool>("isMounted", editorId);
        return !isMounted;
    }

    public async Task<string> GetContentAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        string contentJson = await module.InvokeAsync<string>("getContent", editorId);
        return contentJson;
    }

    /// <summary>
    /// True when the block holds no text. Enter on an empty list item outdents it (or resets it
    /// to a paragraph at level zero) rather than creating another block.
    /// </summary>
    public async Task<bool> IsEmptyBlockAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        bool isEmpty = await module.InvokeAsync<bool>("isEmptyBlock", editorId);
        return isEmpty;
    }

    /// <summary>
    /// True when the caret sits at the very start of the block, which is when Backspace merges
    /// with the block above instead of deleting a character.
    /// </summary>
    public async Task<bool> IsCaretAtBlockStartAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        bool isAtStart = await module.InvokeAsync<bool>("isCaretAtBlockStart", editorId);
        return isAtStart;
    }

    public async Task FocusAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("focus", editorId);
    }

    public async Task PlaceCaretAtStartAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("placeCaretAtStart", editorId);
    }

    public async Task PlaceCaretAtEndAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("placeCaretAtEnd", editorId);
    }

    public async Task ReplaceBlockTypeAsync(string editorId, string nodeName, object? attributes)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("replaceBlockType", editorId, nodeName, attributes);
    }

    public async Task ClearContentAsync(string editorId)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("clearContent", editorId);
    }

    public async Task SetContentAsync(string editorId, string contentJson)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("setContent", editorId, contentJson);
    }

    /// <summary>
    /// Adds or removes the shell class that reveals the split bars while a drag is in flight.
    /// </summary>
    public async Task SetDraggingClassAsync(bool isDragging)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("setDraggingClass", isDragging);
    }

    /// <summary>
    /// Inserts a link to another page at the caret. The editor stores it as its ordinary link mark,
    /// which is the shape the backlink scan looks for.
    /// </summary>
    public async Task InsertPageLinkAsync(string editorId, string label, string href)
    {
        IJSObjectReference module = await EnsureModuleAsync();
        await module.InvokeVoidAsync("insertPageLink", editorId, label, href);
    }

    public async Task DestroyAsync(string editorId)
    {
        if (editorModule is null)
        {
            return;
        }
        try
        {
            await editorModule.InvokeVoidAsync("destroy", editorId);
        }
        catch (JSDisconnectedException)
        {
            // The circuit is already gone; nothing left to clean up in the browser.
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (editorModule is not null)
        {
            try
            {
                await editorModule.DisposeAsync();
            }
            catch (JSDisconnectedException)
            {
                // Circuit already disconnected.
            }
            editorModule = null;
        }
    }
}
