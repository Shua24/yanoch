namespace Yanoch.Web.Components.Services;

/// <summary>
/// Default scoped implementation of <see cref="IPageDataNotifier"/>.
/// Registered as scoped so each Blazor Server circuit (or WebAssembly
/// instance) gets its own event pipeline.
/// </summary>
public sealed class PageDataNotifier : IPageDataNotifier
{
    /// <inheritdoc />
    public event Action<Guid?>? PageDataChanged;

    /// <inheritdoc />
    public void NotifyPageDataChanged(Guid? pageId = null)
    {
        PageDataChanged?.Invoke(pageId);
    }
}
