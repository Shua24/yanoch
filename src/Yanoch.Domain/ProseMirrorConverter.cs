using System.Text;
using System.Text.Json.Nodes;
using Yanoch.Domain.ProseMirror;

namespace Yanoch.Domain;

/// <summary>
/// The single place that understands the relationship between a block's ProseMirror
/// <c>ContentJson</c> and the derived columns stored on <see cref="Block"/>.
///
/// Read the derived values with the Apply... helpers; write them with
/// <see cref="BlockContentService"/>, which is the only caller that should assign the
/// derived columns. Nothing else may set <see cref="Block.BlockType"/>,
/// <see cref="Block.IsChecked"/> or <see cref="Block.Language"/>.
/// </summary>
public static class ProseMirrorConverter
{
    public static string EmptyParagraphJson => "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\"}]}";

    public static JsonObject ParseDocument(string contentJson)
    {
        JsonNode? parsedNode = JsonNode.Parse(string.IsNullOrWhiteSpace(contentJson) ? EmptyParagraphJson : contentJson);
        JsonObject document = parsedNode as JsonObject ?? new JsonObject();
        return document;
    }

    public static string SerializeDocument(JsonObject document)
    {
        string serialized = document.ToJsonString();
        return serialized;
    }

    /// <summary>
    /// Reads the first block node of the document and returns the derived block type. A
    /// document with several top level nodes is not produced by this app; the first node wins.
    /// </summary>
    public static BlockType ReadBlockType(JsonObject document)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        string nodeType = firstBlock?["type"]?.GetValue<string>() ?? ProseMirrorNodes.ParagraphType;
        BlockType blockType = MapNodeTypeToBlockType(nodeType);
        return blockType;
    }

    public static bool ReadIsChecked(JsonObject document)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        if (firstBlock?["attrs"] is JsonObject attributes && attributes["checked"] is JsonValue checkedValue)
        {
            bool isChecked = checkedValue.GetValue<bool>();
            return isChecked;
        }
        return false;
    }

    public static string ReadLanguage(JsonObject document)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        if (firstBlock?["attrs"] is JsonObject attributes && attributes["language"] is JsonValue languageValue)
        {
            string language = languageValue.GetValue<string>();
            return language;
        }
        return string.Empty;
    }

    /// <summary>
    /// Flattens a block document to plain text, used for search indexing and list previews.
    /// </summary>
    public static string ReadPlainText(JsonObject document)
    {
        StringBuilder builder = new StringBuilder();
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        JsonArray? content = firstBlock?["content"] as JsonArray;
        AppendTextNodes(builder, content);
        string result = builder.ToString();
        return result;
    }

    public static BlockType MapNodeTypeToBlockType(string nodeType)
    {
        switch (nodeType)
        {
            case ProseMirrorNodes.HeadingType:
                return BlockType.Heading1;
            case ProseMirrorNodes.BulletedListType:
                return BlockType.BulletedListItem;
            case ProseMirrorNodes.NumberedListType:
                return BlockType.NumberedListItem;
            case ProseMirrorNodes.ToDoType:
                return BlockType.ToDo;
            case ProseMirrorNodes.QuoteType:
                return BlockType.Quote;
            case ProseMirrorNodes.CodeBlockType:
                return BlockType.Code;
            case ProseMirrorNodes.DividerType:
                return BlockType.Divider;
            default:
                return BlockType.Paragraph;
        }
    }

    private static JsonObject? ReadFirstBlockNode(JsonObject document)
    {
        JsonArray? content = document["content"] as JsonArray;
        if (content is null || content.Count == 0)
        {
            return null;
        }
        JsonObject? firstBlock = content[0] as JsonObject;
        return firstBlock;
    }

    private static void AppendTextNodes(StringBuilder builder, JsonArray? content)
    {
        if (content is null)
        {
            return;
        }
        foreach (JsonNode? node in content)
        {
            if (node is not JsonObject nodeObject)
            {
                continue;
            }
            if (nodeObject["text"] is JsonValue textValue)
            {
                builder.Append(textValue.GetValue<string>());
            }
            JsonArray? childContent = nodeObject["content"] as JsonArray;
            if (childContent is not null)
            {
                AppendTextNodes(builder, childContent);
            }
        }
    }
}
