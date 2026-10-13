namespace Yanoch.Ui.Services;

/// <summary>
/// Tracks which toggles are open, for this browser session.
///
/// This is deliberately NOT stored on the block. Notion keeps the open/closed state client-side —
/// a keyed in-memory store plus a per-user preference — and the block itself carries no field for
/// it, so persisting it here would make the state travel with the document instead of with the
/// viewer. Anyone opening the page sees toggles collapsed until they open them.
///
/// The store is keyed by BLOCK ID rather than by position, so a toggle stays open across a reorder
/// or a sibling being inserted above it.
/// </summary>
public sealed class ToggleStateService
{
    private readonly HashSet<Guid> openToggleIds = new HashSet<Guid>();

    /// <summary>
    /// True when the given toggle is open. An unknown toggle is CLOSED, which matches Notion's own
    /// default: a store with no entry for a block reads as not open.
    /// </summary>
    public bool IsOpen(Guid blockId)
    {
        return openToggleIds.Contains(blockId);
    }

    /// <summary>
    /// Flips a toggle and returns its new state, so the caller can re-render without re-reading.
    /// </summary>
    public bool Toggle(Guid blockId)
    {
        if (openToggleIds.Remove(blockId))
        {
            return false;
        }
        openToggleIds.Add(blockId);
        return true;
    }

    /// <summary>
    /// Opens a toggle without flipping it. Used when indenting a block into a toggle: Notion forces
    /// the toggle open at that moment, because otherwise the block would be indented into something
    /// the user cannot see.
    /// </summary>
    public void Open(Guid blockId)
    {
        openToggleIds.Add(blockId);
    }

    /// <summary>
    /// Forgets a toggle, called when its block is deleted so the set cannot grow without bound.
    /// </summary>
    public void Forget(Guid blockId)
    {
        openToggleIds.Remove(blockId);
    }
}
