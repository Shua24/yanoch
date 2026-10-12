using Yanoch.Ui.Components.Editor;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// The image block's own operations, kept out of <c>Editor.BlockOperations.razor.cs</c> so that file
/// stays within its size budget. An image is a leaf whose source lives in an ATTRIBUTE rather than in
/// the block's text, so none of the text-editing operations apply to it and it needs its own path.
/// </summary>
public partial class Editor
{
    /// <summary>
    /// Opens the file picker for a block that has just been converted into an image, and stores the
    /// chosen file under it.
    /// </summary>
    /// <remarks>
    /// The caller must have finished reloading the blocks first. The reload re-renders every block
    /// from the database, and the upload writes the stored name into the block's src, so an upload
    /// that ran before the reload would have its source overwritten by the still-empty content.
    /// </remarks>
    private async Task BeginImageUploadAsync(Guid blockId)
    {
        BlockEditor? editor = ReadEditorComponent(blockId);
        if (editor is null)
        {
            return;
        }
        await editor.StartImageUploadAsync();
    }
}
