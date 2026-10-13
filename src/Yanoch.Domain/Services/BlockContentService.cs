using System.Text.Json.Nodes;
using Yanoch.Domain.ProseMirror;

namespace Yanoch.Domain.Services;

/// <summary>
/// The single writer that keeps a <see cref="Block"/>'s ProseMirror JSON and its derived
/// columns (<see cref="Block.BlockType"/>, <see cref="Block.IsChecked"/>,
/// <see cref="Block.Language"/>) in step. Every mutation of a block's content must go
/// through one of these methods so the two never drift apart.
/// </summary>
public static class BlockContentService
{
    /// <summary>
    /// Replaces the block's document and refreshes the derived columns from it. Returns the
    /// refreshed block so callers can keep using the same reference.
    /// </summary>
    public static Block SetContentJson(Block block, string contentJson)
    {
        JsonObject document = ProseMirrorConverter.ParseDocument(contentJson);
        block.ContentJson = ProseMirrorConverter.SerializeDocument(document);
        block.BlockType = ProseMirrorConverter.ReadBlockType(document);
        block.IsChecked = ProseMirrorConverter.ReadIsChecked(document);
        block.Language = ProseMirrorConverter.ReadLanguage(document);
        block.UpdatedAtUtc = DateTime.UtcNow;
        return block;
    }

    /// <summary>
    /// Replaces the block's document with the parsed form of the given Markdown, then
    /// refreshes the derived columns.
    /// </summary>
    public static Block SetMarkdown(Block block, string markdown)
    {
        JsonObject document = MarkdownReader.ReadDocument(markdown);
        block.ContentJson = ProseMirrorConverter.SerializeDocument(document);
        block.BlockType = ProseMirrorConverter.ReadBlockType(document);
        block.IsChecked = ProseMirrorConverter.ReadIsChecked(document);
        block.Language = ProseMirrorConverter.ReadLanguage(document);
        block.UpdatedAtUtc = DateTime.UtcNow;
        return block;
    }

    /// <summary>
    /// Converts the block into the given type, preserving its text. Paragraph, headings,
    /// list items, quotes and to dos keep their inline content; code and dividers rebuild it.
    /// </summary>
    public static Block ConvertType(Block block, BlockType targetType)
    {
        JsonObject currentDocument = ProseMirrorConverter.ParseDocument(block.ContentJson);
        JsonArray? existingContent = ReadFirstNodeContent(currentDocument);
        JsonObject? newBlock = BuildBlockNode(targetType, existingContent);
        JsonArray newContent = new JsonArray { newBlock };
        JsonObject newDocument = ProseMirrorNodes.CreateDocument(newContent);

        block.ContentJson = ProseMirrorConverter.SerializeDocument(newDocument);
        block.BlockType = ProseMirrorConverter.ReadBlockType(newDocument);
        block.IsChecked = ProseMirrorConverter.ReadIsChecked(newDocument);
        block.Language = ProseMirrorConverter.ReadLanguage(newDocument);
        block.UpdatedAtUtc = DateTime.UtcNow;
        return block;
    }

    /// <summary>
    /// Toggles a to do block between checked and unchecked. Returns the block unchanged if it
    /// is not a to do block.
    /// </summary>
    public static Block ToggleToDoChecked(Block block)
    {
        if (block.BlockType != BlockType.ToDo)
        {
            return block;
        }
        JsonObject document = ProseMirrorConverter.ParseDocument(block.ContentJson);
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        if (firstBlock is null)
        {
            return block;
        }
        JsonObject attributes = firstBlock["attrs"] as JsonObject ?? new JsonObject();
        bool currentChecked = ProseMirrorConverter.ReadIsChecked(document);
        attributes["checked"] = !currentChecked;
        firstBlock["attrs"] = attributes;

        block.ContentJson = ProseMirrorConverter.SerializeDocument(document);
        block.IsChecked = !currentChecked;
        block.UpdatedAtUtc = DateTime.UtcNow;
        return block;
    }

    public static string ReadMarkdown(Block block)
    {
        JsonObject document = ProseMirrorConverter.ParseDocument(block.ContentJson);
        string markdown = MarkdownWriter.WriteDocument(document);
        return markdown;
    }

    /// <summary>
    /// Appends <paramref name="source"/>'s inline content to the end of <paramref name="target"/>,
    /// keeping the target's node type and attributes. This is the Backspace-at-the-start merge.
    ///
    /// Joining the two blocks' Markdown instead would weld their types together, so a heading
    /// would swallow the paragraph after it and turn the paragraph's text into heading text.
    /// Only inline nodes move across, so both blocks' marks survive the join.
    /// </summary>
    public static Block MergeInto(Block target, Block source)
    {
        JsonObject targetDocument = ProseMirrorConverter.ParseDocument(target.ContentJson);
        JsonObject? targetBlock = ReadFirstBlockNode(targetDocument);
        JsonObject sourceDocument = ProseMirrorConverter.ParseDocument(source.ContentJson);
        JsonObject? sourceBlock = ReadFirstBlockNode(sourceDocument);
        if (targetBlock is null || sourceBlock is null)
        {
            return target;
        }

        JsonArray mergedContent = new JsonArray();
        AppendClonedInlineNodes(mergedContent, targetBlock["content"] as JsonArray);
        AppendClonedInlineNodes(mergedContent, sourceBlock["content"] as JsonArray);

        targetBlock["content"] = mergedContent;
        target.ContentJson = ProseMirrorConverter.SerializeDocument(targetDocument);
        target.UpdatedAtUtc = DateTime.UtcNow;
        return target;
    }

    /// <summary>
    /// Copies every inline node into the destination array. The nodes are deep cloned because a
    /// JsonNode may only have one parent; re-parenting the originals throws.
    /// </summary>
    private static void AppendClonedInlineNodes(JsonArray destination, JsonArray? inlineNodes)
    {
        if (inlineNodes is null)
        {
            return;
        }
        foreach (JsonNode? inlineNode in inlineNodes)
        {
            if (inlineNode is not null)
            {
                destination.Add(inlineNode.DeepClone());
            }
        }
    }

    public static string ReadPlainText(Block block)
    {
        JsonObject document = ProseMirrorConverter.ParseDocument(block.ContentJson);
        string plainText = ProseMirrorConverter.ReadPlainText(document);
        return plainText;
    }

    private static JsonObject BuildBlockNode(BlockType targetType, JsonArray? existingContent)
    {
        switch (targetType)
        {
            case BlockType.Heading1:
                return ProseMirrorNodes.CreateHeading(1, existingContent);
            case BlockType.Heading2:
                return ProseMirrorNodes.CreateHeading(2, existingContent);
            case BlockType.Heading3:
                return ProseMirrorNodes.CreateHeading(3, existingContent);
            case BlockType.Heading4:
                return ProseMirrorNodes.CreateHeading(4, existingContent);
            case BlockType.BulletedListItem:
                return ProseMirrorNodes.CreateLeafBlock(ProseMirrorNodes.BulletedListType, existingContent, null);
            case BlockType.NumberedListItem:
                return ProseMirrorNodes.CreateLeafBlock(ProseMirrorNodes.NumberedListType, existingContent, null);
            case BlockType.ToDo:
                return ProseMirrorNodes.CreateToDo(false, existingContent);
            case BlockType.Quote:
                return ProseMirrorNodes.CreateLeafBlock(ProseMirrorNodes.QuoteType, existingContent, null);
            case BlockType.Code:
                return ProseMirrorNodes.CreateCodeBlock(string.Empty, existingContent);
            case BlockType.Divider:
                return ProseMirrorNodes.CreateDivider();
            case BlockType.Image:
                // An image block's own content is rebuilt from the document, so nothing to carry
                // over: the source and caption live on the node's attributes, not in its content.
                return ProseMirrorNodes.CreateImage(string.Empty, string.Empty, string.Empty);
            case BlockType.Toggle:
                return ProseMirrorNodes.CreateToggle(existingContent);
            case BlockType.Callout:
                // The colour and icon survive a type change: converting a paragraph to a callout
                // must not silently reset styling the user already chose on another callout, and
                // the defaults match Notion's own ("default" colour).
                return ProseMirrorNodes.CreateCallout(
                    ProseMirrorNodes.DefaultCalloutIcon,
                    ProseMirrorNodes.DefaultCalloutColor,
                    existingContent);
            default:
                return ProseMirrorNodes.CreateParagraph(existingContent);
        }
    }

    private static JsonObject? ReadFirstBlockNode(JsonObject document)
    {
        JsonArray? content = document["content"] as JsonArray;
        JsonObject? firstBlock = content?.Count > 0 ? content[0] as JsonObject : null;
        return firstBlock;
    }

    private static JsonArray? ReadFirstNodeContent(JsonObject document)
    {
        JsonObject? firstBlock = ReadFirstBlockNode(document);
        JsonArray? content = firstBlock?["content"] as JsonArray;
        return content;
    }
}
