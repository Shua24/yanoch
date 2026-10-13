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

    /// <summary>
    /// The text that marks a block as holding an image node. Used to narrow a database scan to the
    /// blocks that could reference a stored image file, without parsing every block's document.
    /// </summary>
    public static string ImageNodeMarker => $"\"{ProseMirrorNodes.ImageType}\"";

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
    /// A heading's LEVEL decides which heading type it is, so the node's attributes are read
    /// too: without that, a level two or three heading would be derived as a level one heading
    /// and the next keystroke would rewrite its stored type.
    /// </summary>
    public static BlockType ReadBlockType(JsonObject document)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        string nodeType = firstBlock?["type"]?.GetValue<string>() ?? ProseMirrorNodes.ParagraphType;
        int headingLevel = ReadHeadingLevel(firstBlock);
        BlockType blockType = MapNodeTypeToBlockType(nodeType, headingLevel);
        return blockType;
    }

    /// <summary>
    /// Reads a heading node's level attribute, defaulting to one. Any other node type has no
    /// level and gets the default.
    /// </summary>
    public static int ReadHeadingLevel(JsonObject? firstBlock)
    {
        if (firstBlock?["attrs"] is JsonObject attributes && attributes["level"] is JsonValue levelValue)
        {
            int level = levelValue.GetValue<int>();
            return level;
        }
        return 1;
    }

    /// <summary>
    /// Reads an image node's source URL, for search indexing and list previews.
    /// </summary>
    public static string ReadImageSource(JsonObject document)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        if (firstBlock?["attrs"] is JsonObject attributes && attributes["src"] is JsonValue sourceValue)
        {
            string source = sourceValue.GetValue<string>();
            return source;
        }
        return string.Empty;
    }

    /// <summary>
    /// Collects the stored media names referenced by one block's document.
    /// </summary>
    /// <remarks>
    /// Two shapes reach this method, and both must be handled. A block the EDITOR wrote is a
    /// document wrapping the image (<c>{"type":"doc","content":[{"type":"image",…}]}</c>), because
    /// the editor serialises its whole state. A block built by <c>ProseMirrorNodes.CreateImage</c>
    /// is the BARE image node instead, because that factory returns a node rather than a document —
    /// the same shape <c>CreateDivider</c> produces. Reading only the wrapped form would silently
    /// treat every such image as unreferenced, and the cleanup sweep would then delete a file that
    /// is still in use.
    /// </remarks>
    public static void AppendReferencedMediaNames(string contentJson, HashSet<string> referencedNames)
    {
        JsonObject document = ParseDocument(contentJson);

        // The wrapped form: walk the document's top level children.
        if (document["content"] is JsonArray content)
        {
            foreach (JsonNode? node in content)
            {
                if (node is JsonObject blockObject)
                {
                    AppendMediaNameFromNode(blockObject, referencedNames);
                }
            }
            return;
        }

        // The bare form: the parsed object IS the block node.
        AppendMediaNameFromNode(document, referencedNames);
    }

    private static void AppendMediaNameFromNode(JsonObject blockObject, HashSet<string> referencedNames)
    {
        if (blockObject["attrs"] is not JsonObject attributes
            || attributes["src"] is not JsonValue sourceValue)
        {
            return;
        }

        string source = sourceValue.GetValue<string>();
        if (source.Length > 0)
        {
            referencedNames.Add(source);
        }
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

    public static BlockType MapNodeTypeToBlockType(string nodeType, int headingLevel = 1)
    {
        switch (nodeType)
        {
            case ProseMirrorNodes.HeadingType:
                return MapHeadingLevelToBlockType(headingLevel);
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
            case ProseMirrorNodes.ImageType:
                return BlockType.Image;
            case ProseMirrorNodes.ToggleType:
                return BlockType.Toggle;
            case ProseMirrorNodes.CalloutType:
                return BlockType.Callout;
            default:
                return BlockType.Paragraph;
        }
    }

    /// <summary>
    /// Maps a heading level to its block type. Levels outside one to four are clamped into that
    /// range, because the app offers four heading kinds — matching Notion, which has header,
    /// sub_header, sub_sub_header and header_4 and NO fifth or sixth level.
    /// </summary>
    public static BlockType MapHeadingLevelToBlockType(int headingLevel)
    {
        switch (headingLevel)
        {
            case 2:
                return BlockType.Heading2;
            case 3:
                return BlockType.Heading3;
            case 4:
                return BlockType.Heading4;
            default:
                return BlockType.Heading1;
        }
    }

    /// <summary>
    /// Reads a callout's icon, falling back to the default when the attribute is absent. Used by
    /// the Markdown writer and by any consumer that needs the icon without parsing the node itself.
    /// </summary>
    public static string ReadCalloutIcon(JsonObject document)
    {
        return ReadStringAttribute(document, "icon", ProseMirrorNodes.DefaultCalloutIcon);
    }

    /// <summary>
    /// Reads a callout's colour key, falling back to Notion's own default key.
    /// </summary>
    public static string ReadCalloutColor(JsonObject document)
    {
        return ReadStringAttribute(document, "color", ProseMirrorNodes.DefaultCalloutColor);
    }

    private static string ReadStringAttribute(JsonObject document, string attributeName, string fallback)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        if (firstBlock?["attrs"] is JsonObject attributes
            && attributes[attributeName] is JsonValue attributeValue)
        {
            string attributeText = attributeValue.GetValue<string>();
            return attributeText;
        }
        return fallback;
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
