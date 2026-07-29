namespace Yanoch.Web.Components.Services;

/// <summary>
/// Scoped notifier that broadcasts page-data changes within a single Blazor
/// circuit. Each notification carries the ID of the page that changed so
/// subscribers can decide whether they need to reload.
/// </summary>
public interface IPageDataNotifier
{
    /// <summary>
    /// Raised when a page's data (title, icon, content, child list, etc.) has
    /// changed. The <c>pageId</c> parameter identifies the page that was
    /// directly affected; <c>null</c> means "something changed — reload if in
    /// doubt".
    /// </summary>
    event Action<Guid?>? PageDataChanged;

    /// <summary>
    /// Notify subscribers that a page was modified.
    /// </summary>
    /// <param name="pageId">
    /// The ID of the page that changed, or <c>null</c> for a broad
    /// "something changed" signal.
    /// </param>
    void NotifyPageDataChanged(Guid? pageId = null);
}
