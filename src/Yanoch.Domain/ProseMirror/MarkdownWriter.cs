using System.Text;
using System.Text.Json.Nodes;

namespace Yanoch.Domain.ProseMirror;

/// <summary>
/// Serialises a ProseMirror document back to Markdown. The output is stable and round trips
/// with <see cref="MarkdownReader"/> for the block and mark subset this project supports.
/// </summary>
public static class MarkdownWriter
{
    public static string WriteDocument(JsonObject document)
    {
        StringBuilder builder = new StringBuilder();
        JsonArray? blocks = document["content"] as JsonArray;
        if (blocks is null)
        {
            return string.Empty;
        }

        bool isFirstBlock = true;
        foreach (JsonNode? blockNode in blocks)
        {
            if (blockNode is not JsonObject block)
            {
                continue;
            }
            if (!isFirstBlock)
            {
                builder.Append('\n');
            }
            string blockMarkdown = WriteBlock(block);
            builder.Append(blockMarkdown);
            isFirstBlock = false;
        }

        string result = builder.ToString();
        return result;
    }

    private static string WriteBlock(JsonObject block)
    {
        string blockType = block["type"]?.GetValue<string>() ?? ProseMirrorNodes.ParagraphType;
        JsonArray? content = block["content"] as JsonArray;

        switch (blockType)
        {
            case ProseMirrorNodes.HeadingType:
                return WriteHeading(block, content);
            case ProseMirrorNodes.BulletedListType:
                return "- " + WriteInline(content);
            case ProseMirrorNodes.NumberedListType:
                return "1. " + WriteInline(content);
            case ProseMirrorNodes.ToDoType:
                return WriteToDo(block, content);
            case ProseMirrorNodes.QuoteType:
                return "> " + WriteInline(content);
            case ProseMirrorNodes.CodeBlockType:
                return WriteCodeBlock(block, content);
            case ProseMirrorNodes.DividerType:
                return "---";
            case ProseMirrorNodes.ImageType:
                return WriteImage(block);
            case ProseMirrorNodes.CalloutType:
                // Markdown has no callout construct, and Notion has no callout shortcut either, so
                // there is no canonical form to copy. A blockquote carrying the icon is the closest
                // lossless-ish shape: the icon and text survive a round trip through the reader,
                // which a bare paragraph would silently drop. The colour is NOT representable and
                // is lost on export — a recorded limitation, not an oversight.
                return "> " + WriteCalloutIcon(block) + " " + WriteInline(content);
            case ProseMirrorNodes.ToggleType:
                // A toggle's own text is written as a bulleted item; its CHILDREN are separate
                // blocks in the tree and are written by the caller, indented, like any nested list.
                return "- " + WriteInline(content);
            default:
                return WriteInline(content);
        }
    }

    /// <summary>
    /// Reads a callout's icon for the Markdown form, defaulting when the attribute is missing.
    /// </summary>
    private static string WriteCalloutIcon(JsonObject block)
    {
        string icon = ProseMirrorNodes.DefaultCalloutIcon;
        if (block["attrs"] is JsonObject attributes && attributes["icon"] is JsonValue iconValue)
        {
            icon = iconValue.GetValue<string>();
        }
        return icon;
    }

    /// <summary>
    /// Writes an image block as Markdown. The caption is preferred over the alt text when both are
    /// present, because the caption is what the user sees under the picture; Markdown's bracket
    /// slot is the closest equivalent to it.
    /// </summary>
    private static string WriteImage(JsonObject block)
    {
        string source = string.Empty;
        string altText = string.Empty;
        string caption = string.Empty;
        if (block["attrs"] is JsonObject attributes)
        {
            source = attributes["src"]?.GetValue<string>() ?? string.Empty;
            altText = attributes["alt"]?.GetValue<string>() ?? string.Empty;
            caption = attributes["caption"]?.GetValue<string>() ?? string.Empty;
        }

        string label = caption.Length > 0 ? caption : altText;
        string result = $"![{label}]({source})";
        return result;
    }

    private static string WriteHeading(JsonObject block, JsonArray? content)
    {
        int level = 1;
        if (block["attrs"] is JsonObject attributes && attributes["level"] is JsonValue levelValue)
        {
            level = levelValue.GetValue<int>();
        }
        string hashes = new string('#', level);
        string result = hashes + " " + WriteInline(content);
        return result;
    }

    private static string WriteToDo(JsonObject block, JsonArray? content)
    {
        bool isChecked = false;
        if (block["attrs"] is JsonObject attributes && attributes["checked"] is JsonValue checkedValue)
        {
            isChecked = checkedValue.GetValue<bool>();
        }
        string marker = isChecked ? "- [x] " : "- [ ] ";
        string result = marker + WriteInline(content);
        return result;
    }

    private static string WriteCodeBlock(JsonObject block, JsonArray? content)
    {
        string language = string.Empty;
        if (block["attrs"] is JsonObject attributes && attributes["language"] is JsonValue languageValue)
        {
            language = languageValue.GetValue<string>();
        }
        string body = WriteInline(content);
        StringBuilder builder = new StringBuilder();
        builder.Append("```");
        builder.Append(language);
        builder.Append('\n');
        builder.Append(body);
        builder.Append('\n');
        builder.Append("```");
        string result = builder.ToString();
        return result;
    }

    private static string WriteInline(JsonArray? content)
    {
        StringBuilder builder = new StringBuilder();
        if (content is null)
        {
            return string.Empty;
        }
        foreach (JsonNode? node in content)
        {
            if (node is not JsonObject textNode)
            {
                continue;
            }
            // A hard break is an inline node, not text. Markdown spells a hard break as two
            // trailing spaces before the newline; writing nothing would drop the break entirely.
            if (textNode["type"]?.GetValue<string>() == ProseMirrorNodes.HardBreakType)
            {
                builder.Append("  \n");
                continue;
            }
            string text = textNode["text"]?.GetValue<string>() ?? string.Empty;
            string marked = ApplyMarks(text, textNode["marks"] as JsonArray);
            builder.Append(marked);
        }
        string result = builder.ToString();
        return result;
    }

    private static string ApplyMarks(string text, JsonArray? marks)
    {
        if (marks is null || marks.Count == 0 || text.Length == 0)
        {
            return text;
        }

        bool isBold = false;
        bool isItalic = false;
        bool isStrike = false;
        bool isCode = false;
        string linkHref = string.Empty;

        foreach (JsonNode? markNode in marks)
        {
            if (markNode is not JsonObject mark)
            {
                continue;
            }
            string markType = mark["type"]?.GetValue<string>() ?? string.Empty;
            switch (markType)
            {
                case "strong":
                    isBold = true;
                    break;
                case "em":
                    isItalic = true;
                    break;
                case "strike":
                    isStrike = true;
                    break;
                case "code":
                    isCode = true;
                    break;
                case "link":
                    if (mark["attrs"] is JsonObject attributes && attributes["href"] is JsonValue hrefValue)
                    {
                        linkHref = hrefValue.GetValue<string>();
                    }
                    break;
            }
        }

        if (isCode)
        {
            return "`" + text + "`";
        }

        string result = text;
        if (isStrike)
        {
            result = "~~" + result + "~~";
        }
        if (isItalic)
        {
            result = "_" + result + "_";
        }
        if (isBold)
        {
            result = "**" + result + "**";
        }
        if (linkHref.Length > 0)
        {
            result = "[" + result + "](" + linkHref + ")";
        }
        return result;
    }
}
