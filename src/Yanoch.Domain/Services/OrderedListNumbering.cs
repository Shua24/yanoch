namespace Yanoch.Domain.Services;

/// <summary>
/// Computes the visible marker for ordered (numbered) list items.
///
/// The ordinal is COMPUTED from a block's position among its consecutive numbered siblings, never
/// stored. This mirrors Notion, which keeps only <c>list_format</c> and an optional
/// <c>list_start_index</c> on a numbered block and derives the index by walking the run — there is
/// no per-block ordinal field, and its renderer PAINTS the number rather than relying on browser
/// <c>&lt;ol&gt;</c> numbering.
///
/// One implementation feeds BOTH the editor's rendering and the Markdown export. Two copies would
/// drift, and a numbered list that renders 1,2,3 but exports 1,1,1 is exactly the class of bug this
/// replaces.
/// </summary>
public static class OrderedListNumbering
{
    /// <summary>
    /// The marker ("1.", "2.", …) for every numbered item in ONE sibling list, keyed by block id.
    /// Blocks that are not numbered items are absent from the result.
    ///
    /// The run rules, taken from Notion's recovered counter:
    /// - a numbered item after another numbered item AT THE SAME indent continues the run (+1);
    /// - a numbered item at a DIFFERENT indent is a nesting boundary, and the run RESTARTS at 1;
    /// - any non-numbered sibling ENDS the run, so the next numbered item starts at 1 again.
    ///
    /// A known divergence: Notion tracks depth through the block TREE and lets an UNINDENTED item
    /// rejoin the outer run. This walks IndentLevel instead, so unindenting restarts the run at 1.
    /// Recorded as a gap, not an oversight — closing it needs the tree, not the indent integer.
    /// </summary>
    public static IReadOnlyDictionary<Guid, string> ComputeMarkers(IReadOnlyList<Block> orderedSiblings)
    {
        Dictionary<Guid, string> markers = new Dictionary<Guid, string>();
        int runNumber = 0;
        int? runIndentLevel = null;

        foreach (Block block in orderedSiblings)
        {
            if (block.BlockType != BlockType.NumberedListItem)
            {
                // A non-numbered sibling breaks the run entirely, so a later numbered item that is
                // not adjacent to this run starts again at 1.
                runNumber = 0;
                runIndentLevel = null;
                continue;
            }

            bool continuesRun = runIndentLevel == block.IndentLevel;
            if (continuesRun)
            {
                runNumber += 1;
            }
            else
            {
                runNumber = 1;
                runIndentLevel = block.IndentLevel;
            }

            markers[block.Id] = runNumber.ToString() + ".";
        }

        return markers;
    }
}
