using Microsoft.JSInterop;

namespace Yanoch.Ui.Services;

/// <summary>
/// Tracks and applies the light/dark theme of the workspace. The choice is written to browser
/// storage through the small theme helper so it survives a reload.
/// </summary>
public sealed class ThemeService
{
    private readonly IJSRuntime jsRuntime;
    private bool isDarkMode = true;

    public ThemeService(IJSRuntime jsRuntime)
    {
        this.jsRuntime = jsRuntime;
    }

    public bool IsDarkMode => isDarkMode;

    public event Action? ThemeChanged;

    public async Task InitialiseAsync()
    {
        string storedTheme = await jsRuntime.InvokeAsync<string>("yanochTheme.read");
        isDarkMode = storedTheme != "light";
        await jsRuntime.InvokeVoidAsync("yanochTheme.apply", isDarkMode ? "dark" : "light");
        ThemeChanged?.Invoke();
    }

    public async Task ToggleAsync()
    {
        isDarkMode = !isDarkMode;
        string themeName = isDarkMode ? "dark" : "light";
        await jsRuntime.InvokeVoidAsync("yanochTheme.apply", themeName);
        await jsRuntime.InvokeVoidAsync("yanochTheme.persist", themeName);
        ThemeChanged?.Invoke();
    }
}
