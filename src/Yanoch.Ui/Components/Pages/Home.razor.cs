using Microsoft.AspNetCore.Components;
using Yanoch.Data.Repositories;
using Yanoch.Domain;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// Lists the workspace pages and creates or deletes them. The markup lives in Home.razor; the
/// data work lives here so the page stays small.
/// </summary>
public partial class Home
{
    [Inject]
    private PageRepository Repository { get; set; } = default!;

    [Inject]
    private NavigationManager Navigation { get; set; } = default!;

    private List<Page> pages = new List<Page>();
    private bool isLoading = true;

    protected override async Task OnInitializedAsync()
    {
        isLoading = true;
        pages = await Repository.ListPagesAsync();
        isLoading = false;
    }

    private async Task CreatePageAsync()
    {
        Page createdPage = await Repository.CreatePageAsync("Untitled");
        Navigation.NavigateTo($"/page/{createdPage.Id}");
    }

    private async Task DeletePageAsync(Guid pageId)
    {
        await Repository.DeletePageAsync(pageId);
        pages = await Repository.ListPagesAsync();
    }

    private string BuildPageHref(Guid pageId)
    {
        string href = $"/page/{pageId}";
        return href;
    }
}
