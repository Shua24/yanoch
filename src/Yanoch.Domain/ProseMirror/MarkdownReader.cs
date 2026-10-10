using System.Text;
using System.Text.Json.Nodes;
using Markdig;
using Markdig.Extensions.TaskLists;
using Markdig.Helpers;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;

namespace Yanoch.Domain.ProseMirror;

/// <summary>
/// Reads Markdown into a ProseMirror document by walking Markdig's abstract syntax tree.
/// Markdig owns the Markdown grammar (CommonMark plus the task list extension); this class maps
/// the block level and delegates inline content to <see cref="MarkdownInlineReader"/>.
///
/// A ProseMirror block in Yanoch is a single block node inside a document, so a Markdown
/// construct that expands to several blocks (a list with several items) is flattened into one
/// document node per item. That keeps every stored block exactly one node, which the editor and
/// the block list both rely on.
/// </summary>
public static class MarkdownReader
{
    private static readonly MarkdownPipeline Pipeline =
        new MarkdownPipelineBuilder().UseTaskLists().Build();

    public static JsonObject ReadDocument(string markdown)
    {
        MarkdownDocument markdownDocument = Markdown.Parse(markdown ?? string.Empty, Pipeline);
        JsonArray blocks = new JsonArray();

        foreach (Markdig.Syntax.Block markdownBlock in markdownDocument)
        {
            List<JsonObject> mappedBlocks = MapBlocks(markdownBlock);
            foreach (JsonObject mappedBlock in mappedBlocks)
            {
                blocks.Add(mappedBlock);
            }
        }

        if (blocks.Count == 0)
        {
            blocks.Add(ProseMirrorNodes.CreateParagraph(null));
        }

        JsonObject document = ProseMirrorNodes.CreateDocument(blocks);
        return document;
    }

    private static List<JsonObject> MapBlocks(Markdig.Syntax.Block markdownBlock)
    {
        switch (markdownBlock)
        {
            case HeadingBlock heading:
                JsonArray headingContent = MarkdownInlineReader.MapInline(heading.Inline);
                JsonObject headingNode = ProseMirrorNodes.CreateHeading(heading.Level, headingContent);
                return new List<JsonObject> { headingNode };

            case FencedCodeBlock fenced:
                string fenceLanguage = ReadFenceLanguage(fenced);
                JsonArray fencedContent = MapCodeContent(fenced.Lines);
                JsonObject fencedNode = ProseMirrorNodes.CreateCodeBlock(fenceLanguage, fencedContent);
                return new List<JsonObject> { fencedNode };

            case CodeBlock indented:
                JsonArray indentedContent = MapCodeContent(indented.Lines);
                JsonObject indentedNode = ProseMirrorNodes.CreateCodeBlock(string.Empty, indentedContent);
                return new List<JsonObject> { indentedNode };

            case ListBlock list:
                return MapListBlock(list);

            case QuoteBlock quote:
                JsonObject quoteNode = MapQuoteBlock(quote);
                return new List<JsonObject> { quoteNode };

            case ThematicBreakBlock:
                return new List<JsonObject> { ProseMirrorNodes.CreateDivider() };

            case ParagraphBlock paragraph:
                JsonArray paragraphContent = MarkdownInlineReader.MapInline(paragraph.Inline);
                JsonObject paragraphNode = ProseMirrorNodes.CreateParagraph(paragraphContent);
                return new List<JsonObject> { paragraphNode };

            default:
                return new List<JsonObject>();
        }
    }

    private static List<JsonObject> MapListBlock(ListBlock list)
    {
        List<JsonObject> itemNodes = new List<JsonObject>();
        foreach (Markdig.Syntax.Block listItemBlock in list)
        {
            if (listItemBlock is not ListItemBlock listItem)
            {
                continue;
            }
            JsonObject? itemNode = MapListItem(listItem, list.IsOrdered);
            if (itemNode is not null)
            {
                itemNodes.Add(itemNode);
            }
        }
        return itemNodes;
    }

    private static JsonObject? MapListItem(ListItemBlock listItem, bool isOrdered)
    {
        ParagraphBlock? firstParagraph = ReadFirstParagraph(listItem);
        bool isTask = false;
        bool isChecked = false;
        if (firstParagraph is not null && firstParagraph.Inline is not null)
        {
            TaskList? taskList = ReadLeadingTaskList(firstParagraph.Inline);
            if (taskList is not null)
            {
                isTask = true;
                isChecked = taskList.Checked;
            }
        }

        JsonArray itemContent = new JsonArray();
        foreach (Markdig.Syntax.Block child in listItem)
        {
            if (child is ParagraphBlock paragraph)
            {
                bool skipTaskMarker = isTask && ReferenceEquals(paragraph, firstParagraph);
                JsonArray inlineContent = MarkdownInlineReader.MapInline(paragraph.Inline, skipTaskMarker);
                MarkdownInlineReader.AppendInlineNodes(itemContent, inlineContent);
            }
            else
            {
                List<JsonObject> childBlocks = MapBlocks(child);
                foreach (JsonObject childBlock in childBlocks)
                {
                    JsonArray nestedContent = new JsonArray { childBlock.DeepClone() };
                    JsonObject nestedDocument = ProseMirrorNodes.CreateDocument(nestedContent);
                    itemContent.Add(nestedDocument);
                }
            }
        }

        if (isTask)
        {
            JsonObject toDoNode = ProseMirrorNodes.CreateToDo(isChecked, itemContent);
            return toDoNode;
        }

        string listItemType = isOrdered ? ProseMirrorNodes.NumberedListType : ProseMirrorNodes.BulletedListType;
        JsonObject listItemNode = ProseMirrorNodes.CreateLeafBlock(listItemType, itemContent, null);
        return listItemNode;
    }

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

        JsonObject quoteNode = ProseMirrorNodes.CreateLeafBlock(ProseMirrorNodes.QuoteType, quoteContent, null);
        return quoteNode;
    }

    private static ParagraphBlock? ReadFirstParagraph(ListItemBlock listItem)
    {
        foreach (Markdig.Syntax.Block child in listItem)
        {
            if (child is ParagraphBlock paragraph)
            {
                return paragraph;
            }
        }
        return null;
    }

    private static TaskList? ReadLeadingTaskList(ContainerInline container)
    {
        foreach (Inline inline in container)
        {
            if (inline is TaskList taskList)
            {
                return taskList;
            }
            return null;
        }
        return null;
    }

    private static JsonArray MapCodeContent(StringLineGroup lines)
    {
        StringBuilder builder = new StringBuilder();
        foreach (StringLine line in lines.Lines)
        {
            if (builder.Length > 0)
            {
                builder.Append('\n');
            }
            builder.Append(line.ToString());
        }

        string codeText = builder.ToString().TrimEnd('\n');
        JsonArray content = new JsonArray();
        if (codeText.Length > 0)
        {
            content.Add(ProseMirrorNodes.CreateText(codeText, null));
        }
        return content;
    }

    private static string ReadFenceLanguage(FencedCodeBlock fenced)
    {
        if (fenced.Info is null)
        {
            return string.Empty;
        }
        string info = fenced.Info.Trim();
        int spaceIndex = info.IndexOf(' ');
        string language = spaceIndex > 0 ? info.Substring(0, spaceIndex) : info;
        return language;
    }
}
