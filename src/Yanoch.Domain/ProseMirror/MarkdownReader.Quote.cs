using System.Text.Json.Nodes;
using Markdig.Syntax;

namespace Yanoch.Domain.ProseMirror;

/// <summary>
/// The quote mapping, which is also where a CALLOUT is recognised on import.
///
/// A callout has no Markdown construct of its own, and Notion has no callout shortcut either, so
/// the writer emits one as a blockquote carrying its icon. That makes this the one place that has
/// to tell the two apart, which is why it lives in its own partial: the marker rule is narrow and
/// easy to loosen by accident.
/// </summary>
public static partial class MarkdownReader
{
    private static JsonObject MapQuoteBlock(QuoteBlock quote)
    {
        JsonArray quoteContent = new JsonArray();
        foreach (Markdig.Syntax.Block child in quote)
        {
            if (child is ParagraphBlock paragraph)
            {
                JsonArray inlineContent = MarkdownInlineReader.MapInline(paragraph.Inline);
                MarkdownInlineReader.AppendInlineNodes(quoteContent, inlineContent);
            }
            else
            {
                List<JsonObject> childBlocks = MapBlocks(child);
                foreach (JsonObject childBlock in childBlocks)
                {
                    quoteContent.Add(childBlock.DeepClone());
                }
            }
        }

        // A callout has no Markdown construct of its own, so the writer emits one as a blockquote
        // whose first inline run is the default icon. Recognising that marker here is what lets an
        // exported callout come back as a callout instead of losing its icon to an ordinary quote.
        // Only the DEFAULT icon is treated as a marker: recognising any leading word would turn
        // every quote into a callout. A callout with a custom icon therefore does not round trip —
        // a recorded limitation, and the reason the check is deliberately narrow.
        string markerPrefix = ProseMirrorNodes.DefaultCalloutIcon + " ";
        if (ReadLeadingText(quoteContent) is string leadingText
            && leadingText.StartsWith(markerPrefix, StringComparison.Ordinal))
        {
            StripLeadingText(quoteContent, markerPrefix.Length);
            JsonObject calloutNode = ProseMirrorNodes.CreateCallout(
                ProseMirrorNodes.DefaultCalloutIcon,
                ProseMirrorNodes.DefaultCalloutColor,
                quoteContent);
            return calloutNode;
        }

        JsonObject quoteNode = ProseMirrorNodes.CreateLeafBlock(ProseMirrorNodes.QuoteType, quoteContent, null);
        return quoteNode;
    }

    /// <summary>
    /// The text of the first inline node, or null when the content does not begin with a text node.
    /// </summary>
    private static string? ReadLeadingText(JsonArray content)
    {
        if (content.Count > 0
            && content[0] is JsonObject firstNode
            && firstNode["text"] is JsonValue textValue)
        {
            return textValue.GetValue<string>();
        }
        return null;
    }

    /// <summary>
    /// Removes the first <paramref name="length"/> characters from the leading text node, dropping
    /// the node entirely when nothing is left of it.
    /// </summary>
    private static void StripLeadingText(JsonArray content, int length)
    {
        if (content[0] is not JsonObject firstNode || firstNode["text"] is not JsonValue textValue)
        {
            return;
        }
        string remainder = textValue.GetValue<string>().Substring(length);
        if (remainder.Length == 0)
        {
            content.RemoveAt(0);
            return;
        }
        firstNode["text"] = remainder;
    }
}
