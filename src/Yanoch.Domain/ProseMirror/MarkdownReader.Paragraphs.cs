using System.Text.Json.Nodes;
using Markdig.Syntax;

namespace Yanoch.Domain.ProseMirror;

/// <summary>
/// The paragraph mapping that can produce MORE than one block. Markdown puts an image INLINE
/// (`![alt](src)` sits inside a paragraph), but an image is a BLOCK here and in Notion, so a
/// paragraph containing one is split around it. Split out of <c>MarkdownReader</c> to keep that
/// file inside the project's size limit; the shared entry points live there.
/// </summary>
public static partial class MarkdownReader
{
    /// <summary>
    /// Maps a paragraph into one or more blocks: the text before an image becomes a paragraph, the
    /// image becomes its own image block, and the text after it becomes another paragraph. A
    /// paragraph with no image maps to a single paragraph, so the common case is unchanged.
    /// </summary>
    private static List<JsonObject> MapParagraphBlocks(ParagraphBlock paragraph)
    {
        JsonArray inlineContent = MarkdownInlineReader.MapInline(paragraph.Inline);

        List<JsonObject> blocks = new List<JsonObject>();
        JsonArray pendingText = new JsonArray();

        foreach (JsonNode? inlineNode in inlineContent)
        {
            bool isImage = inlineNode is JsonObject inlineObject
                && inlineObject["type"]?.GetValue<string>() == ProseMirrorNodes.ImageType;
            if (isImage)
            {
                FlushPendingParagraph(blocks, pendingText);
                pendingText = new JsonArray();
                blocks.Add((JsonObject)inlineNode!.DeepClone());
                continue;
            }

            if (inlineNode is not null)
            {
                pendingText.Add(inlineNode.DeepClone());
            }
        }

        FlushPendingParagraph(blocks, pendingText);

        if (blocks.Count == 0)
        {
            blocks.Add(ProseMirrorNodes.CreateParagraph(null));
        }

        return blocks;
    }

    /// <summary>
    /// Emits the accumulated inline nodes as a paragraph block, unless there is nothing to emit.
    /// </summary>
    private static void FlushPendingParagraph(List<JsonObject> blocks, JsonArray pendingText)
    {
        if (pendingText.Count == 0)
        {
            return;
        }
        JsonObject paragraphNode = ProseMirrorNodes.CreateParagraph(pendingText);
        blocks.Add(paragraphNode);
    }
}
