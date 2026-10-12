using Yanoch.Domain;
using Yanoch.Domain.ProseMirror;
using Yanoch.Domain.Services;
using Yanoch.Ui.Components.Editor;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// The one markdown shorthand that needs the host: the divider. Every other shortcut converts the
/// block in place inside the editor, and the debounced content change that follows carries the new
/// node to the server, which re-derives the block type from it. A divider cannot work that way,
/// because a horizontal rule holds no text — the caret has to move into a new block, and only the
/// page owns the block list. The shared state is declared in <c>Editor.razor.cs</c>.
/// </summary>
public partial class Editor
{
    /// <summary>
    /// Finishes the divider shorthand: stores the divider the editor already put in the block,
    /// then adds the empty block the caret moves into. Without the second step the user is left
    /// with a rule and nowhere to type.
    /// </summary>
    private async Task CompleteDividerShortcutAsync(Guid blockId)
    {
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null || block.IsContainer)
        {
            return;
        }

        BlockEditor? editor = ReadEditorComponent(blockId);
        if (editor is not null)
        {
            // Read the content back rather than rebuilding a divider here: the editor is the side
            // that actually made the change, and the server's derived type follows whatever it holds.
            string dividerJson = await editor.ReadContentAsync();
            BlockContentService.SetContentJson(block, dividerJson);
            await Repository.SaveBlockAsync(block);
        }

        Block newBlock = await Repository.InsertBlockAfterAsync(
            PageId,
            block.ParentBlockId,
            block.SortOrder,
            block.IndentLevel,
            ProseMirrorConverter.EmptyParagraphJson);
        await ReloadBlocksAsync(newBlock.Id, true);
    }
}
