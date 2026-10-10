using Microsoft.JSInterop;

namespace Yanoch.Ui.Interop;

/// <summary>
/// Wraps the browser file helpers used to import a Markdown file and export a page back to
/// Markdown. The file is read in the browser and returned as text, so the server never touches
/// the user's filesystem.
/// </summary>
public sealed class FileInterop
{
    private readonly IJSRuntime jsRuntime;

    public FileInterop(IJSRuntime jsRuntime)
    {
        this.jsRuntime = jsRuntime;
    }

    public async Task DownloadTextAsync(string fileName, string text)
    {
        await jsRuntime.InvokeVoidAsync("yanochFiles.downloadText", fileName, text);
    }

    public async Task<PickedTextFile?> PickTextFileAsync(string accept)
    {
        PickedTextFile? picked = await jsRuntime.InvokeAsync<PickedTextFile?>("yanochFiles.pickTextFile", accept);
        return picked;
    }
}

/// <summary>
/// The result of a browser file pick: the file name and its text content.
/// </summary>
public sealed class PickedTextFile
{
    public string Name { get; set; } = string.Empty;

    public string Text { get; set; } = string.Empty;
}
