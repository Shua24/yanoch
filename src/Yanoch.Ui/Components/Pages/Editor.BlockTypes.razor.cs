using Microsoft.AspNetCore.Components;
using Yanoch.Domain;
using Yanoch.Domain.Services;
using Yanoch.Ui.Components.Editor;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// Choosing a block's type from the slash command menu. Kept apart from the other block operations
/// so that file stays within its size budget, and because converting a type has its own wrinkle: the
/// image case needs the upload started after the reload rather than a focus.
/// </summary>
public partial class Editor
{
    /// <summary>
    /// The entries of the slash command menu, in the order they are offered.
    /// </summary>
    private static readonly IReadOnlyList<BlockTypeOption> BlockTypeOptions = new List<BlockTypeOption>
    {
        new BlockTypeOption(BlockType.Paragraph, "Text", "plain text", "paragraph"),
        new BlockTypeOption(BlockType.Heading1, "Heading 1", "big section heading", "heading", 1),
        new BlockTypeOption(BlockType.Heading2, "Heading 2", "medium section heading", "heading", 2),
        new BlockTypeOption(BlockType.Heading3, "Heading 3", "small section heading", "heading", 3),
        new BlockTypeOption(BlockType.BulletedListItem, "Bulleted list", "unordered list", "bulleted_list_item"),
        new BlockTypeOption(BlockType.NumberedListItem, "Numbered list", "ordered list", "ordered_list_item"),
        new BlockTypeOption(BlockType.ToDo, "To-do", "task with a checkbox", "todo_item"),
        new BlockTypeOption(BlockType.Quote, "Quote", "captured quote", "blockquote"),
        new BlockTypeOption(BlockType.Code, "Code", "code with syntax highlighting", "code_block"),
        new BlockTypeOption(BlockType.Divider, "Divider", "visual separator", "horizontal_rule"),
        new BlockTypeOption(BlockType.Image, "Image", "picture from a URL", "image"),
    };

    private async Task HandleApplyBlockTypeAsync(BlockTypeSelection selection)
    {
        await ApplyBlockTypeAsync(selection.BlockId, selection.Option);
    }

    private async Task ApplyBlockTypeAsync(Guid blockId, BlockTypeOption option)
    {
        slashMenuBlockId = null;
        Block? block = orderedBlocks.FirstOrDefault(candidate => candidate.Id == blockId);
        if (block is null || block.IsContainer)
        {
            return;
        }

        BlockContentService.ConvertType(block, option.BlockType);
        await Repository.SaveBlockAsync(block);

        BlockEditor? editor = ReadEditorComponent(blockId);
        if (editor is not null)
        {
            await editor.ApplyBlockTypeAsync(option.NodeName, option.BuildAttributes());
            if (option.BlockType != BlockType.Image)
            {
                await editor.FocusAsync();
            }
        }
        await ReloadBlocksAsync(blockId, false, true);

        if (option.BlockType == BlockType.Image)
        {
            // AFTER the reload, deliberately. The upload writes the chosen file's stored name into
            // the block's src, and the reload re-renders every block from the database, so running
            // the upload first would have the reload overwrite that source with the still-empty
            // content saved a moment earlier. There is nothing to focus either: an image is a leaf
            // whose source is an attribute, not text.
            await BeginImageUploadAsync(blockId);
        }
    }
}
