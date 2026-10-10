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
            default:
                return WriteInline(content);
        }
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
