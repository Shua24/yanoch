using System.Text.Json.Nodes;

namespace Yanoch.Domain.ProseMirror;

/// <summary>
/// Builds the ProseMirror node objects the editor consumes. Every method returns a fresh
/// node so callers never share mutable JSON between blocks.
/// </summary>
public static class ProseMirrorNodes
{
    public const string DocumentType = "doc";
    public const string ParagraphType = "paragraph";
    public const string HeadingType = "heading";
    public const string TextType = "text";
    public const string BulletedListType = "bulleted_list_item";
    public const string NumberedListType = "ordered_list_item";
    public const string ToDoType = "todo_item";
    public const string QuoteType = "blockquote";
    public const string CodeBlockType = "code_block";
    public const string DividerType = "horizontal_rule";
    public const string HardBreakType = "hard_break";
    public const string ImageType = "image";

    public static JsonObject CreateDocument(JsonArray content)
    {
        JsonObject document = new JsonObject
        {
            ["type"] = DocumentType,
            ["content"] = content,
        };
        return document;
    }

    public static JsonObject CreateText(string value, JsonArray? marks)
    {
        JsonObject text = new JsonObject
        {
            ["type"] = TextType,
            ["text"] = value,
        };
        if (marks is not null && marks.Count > 0)
        {
            text["marks"] = marks;
        }
        return text;
    }

    public static JsonObject CreateMark(string markType, JsonObject? attributes)
    {
        JsonObject mark = new JsonObject
        {
            ["type"] = markType,
        };
        if (attributes is not null)
        {
            mark["attrs"] = attributes;
        }
        return mark;
    }

    public static JsonObject CreateLeafBlock(string blockType, JsonArray? content, JsonObject? attributes)
    {
        JsonObject block = new JsonObject
        {
            ["type"] = blockType,
        };
        if (attributes is not null)
        {
            block["attrs"] = attributes;
        }
        if (content is not null && content.Count > 0)
        {
            block["content"] = content;
        }
        return block;
    }

    public static JsonObject CreateParagraph(JsonArray? content)
    {
        JsonObject paragraph = CreateLeafBlock(ParagraphType, content, null);
        return paragraph;
    }

    public static JsonObject CreateHeading(int level, JsonArray? content)
    {
        JsonObject attributes = new JsonObject
        {
            ["level"] = level,
        };
        JsonObject heading = CreateLeafBlock(HeadingType, content, attributes);
        return heading;
    }

    public static JsonObject CreateToDo(bool isChecked, JsonArray? content)
    {
        JsonObject attributes = new JsonObject
        {
            ["checked"] = isChecked,
        };
        JsonObject toDo = CreateLeafBlock(ToDoType, content, attributes);
        return toDo;
    }

    public static JsonObject CreateCodeBlock(string language, JsonArray? content)
    {
        JsonObject attributes = new JsonObject
        {
            ["language"] = language,
        };
        JsonObject codeBlock = CreateLeafBlock(CodeBlockType, content, attributes);
        return codeBlock;
    }

    public static JsonObject CreateDivider()
    {
        JsonObject divider = CreateLeafBlock(DividerType, null, null);
        return divider;
    }

    /// <summary>
    /// Creates the inline node that represents a line break inside a block. The editor's schema
    /// spells this <c>hard_break</c> and uses it for Shift+Enter, so Markdown breaks must map to
    /// this node rather than to a newline character inside a text node: the editor does not render
    /// a bare newline as a break, and the Markdown writer would silently drop it on export.
    /// </summary>
    public static JsonObject CreateHardBreak()
    {
        JsonObject hardBreak = new JsonObject
        {
            ["type"] = HardBreakType,
        };
        return hardBreak;
    }

    /// <summary>
    /// Creates an image block. The image is a LEAF with no text content, so it is modelled exactly
    /// like a divider: one node, no inline content. The caption is a separate field on the node's
    /// attributes rather than a child block, which keeps the one-node-per-block invariant intact.
    /// </summary>
    public static JsonObject CreateImage(string source, string altText, string caption)
    {
        JsonObject attributes = new JsonObject
        {
            ["src"] = source,
            ["alt"] = altText,
            ["caption"] = caption,
        };
        JsonObject image = CreateLeafBlock(ImageType, null, attributes);
        return image;
    }
}
