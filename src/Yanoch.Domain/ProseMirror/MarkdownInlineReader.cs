using System.Text.Json.Nodes;
using Markdig.Extensions.TaskLists;
using Markdig.Syntax.Inlines;

namespace Yanoch.Domain.ProseMirror;

/// <summary>
/// Maps Markdig inline nodes into the ProseMirror text and mark nodes used by a block. Marks
/// accumulate down the inline tree (bold inside a link keeps both marks), and each text run
/// receives its own copy of the accumulated marks so nothing is shared between runs.
/// </summary>
public static class MarkdownInlineReader
{
    public static JsonArray MapInline(ContainerInline? container, bool skipLeadingTaskList = false)
    {
        JsonArray nodes = new JsonArray();
        if (container is null)
        {
            return nodes;
        }

        bool isFirst = true;
        foreach (Inline inline in container)
        {
            if (isFirst && skipLeadingTaskList && inline is TaskList)
            {
                isFirst = false;
                continue;
            }
            isFirst = false;
            AppendInline(nodes, inline, null);
        }

        return nodes;
    }

    public static void AppendInlineNodes(JsonArray target, JsonArray source)
    {
        foreach (JsonNode? node in source)
        {
            if (node is not null)
            {
                target.Add(node.DeepClone());
            }
        }
    }

    private static void AppendInline(JsonArray nodes, Inline inline, JsonArray? inheritedMarks)
    {
        switch (inline)
        {
            case LiteralInline literal:
                string literalText = literal.Content.ToString();
                nodes.Add(ProseMirrorNodes.CreateText(literalText, CloneMarks(inheritedMarks)));
                break;

            case EmphasisInline emphasis:
                JsonArray emphasisMarks = CloneMarks(inheritedMarks);
                string emphasisType = emphasis.DelimiterCount >= 2 ? "strong" : "em";
                emphasisMarks.Add(ProseMirrorNodes.CreateMark(emphasisType, null));
                AppendContainerInline(nodes, emphasis, emphasisMarks);
                break;

            case CodeInline code:
                JsonArray codeMarks = CloneMarks(inheritedMarks);
                codeMarks.Add(ProseMirrorNodes.CreateMark("code", null));
                nodes.Add(ProseMirrorNodes.CreateText(code.Content, codeMarks));
                break;

            case LinkInline link when link.IsImage:
                // An image is NOT a link with a picture in it: `![alt](src)` arrives as a
                // LinkInline with IsImage set, and treating it as a link turned every imported
                // image into a hyperlink and erased any image with empty alt text. It becomes an
                // image NODE instead. The alt text doubles as the caption, which is what Notion
                // shows under the picture.
                string imageSource = link.Url ?? string.Empty;
                string imageAltText = ReadLinkText(link);
                nodes.Add(ProseMirrorNodes.CreateImage(imageSource, imageAltText, imageAltText));
                break;

            case LinkInline link:
                JsonArray linkMarks = CloneMarks(inheritedMarks);
                JsonObject linkAttributes = new JsonObject { ["href"] = link.Url ?? string.Empty };
                linkMarks.Add(ProseMirrorNodes.CreateMark("link", linkAttributes));
                AppendContainerInline(nodes, link, linkMarks);
                break;

            case LineBreakInline lineBreak:
                // A hard break is an inline NODE, not a newline character: the editor renders a
                // hard_break as a break, and the Markdown writer emits it as two trailing spaces.
                // A soft break stays a newline character, which is what Markdown itself means by
                // a plain line break.
                if (lineBreak.IsHard)
                {
                    nodes.Add(ProseMirrorNodes.CreateHardBreak());
                }
                else
                {
                    nodes.Add(ProseMirrorNodes.CreateText("\n", CloneMarks(inheritedMarks)));
                }
                break;

            case TaskList:
                break;

            case ContainerInline container:
                AppendContainerInline(nodes, container, inheritedMarks);
                break;
        }
    }

    private static void AppendContainerInline(JsonArray nodes, ContainerInline container, JsonArray? marks)
    {
        foreach (Inline child in container)
        {
            AppendInline(nodes, child, marks);
        }
    }

    private static JsonArray CloneMarks(JsonArray? marks)
    {
        JsonArray clone = new JsonArray();
        if (marks is null)
        {
            return clone;
        }
        foreach (JsonNode? mark in marks)
        {
            if (mark is not null)
            {
                clone.Add(mark.DeepClone());
            }
        }
        return clone;
    }

    /// <summary>
    /// Reads the plain text of a link or image, which is its label for a link and its alt text for
    /// an image. Nested emphasis is flattened, because this text is used as a caption.
    /// </summary>
    private static string ReadLinkText(ContainerInline container)
    {
        System.Text.StringBuilder builder = new System.Text.StringBuilder();
        AppendLinkText(builder, container);
        string text = builder.ToString();
        return text;
    }

    private static void AppendLinkText(System.Text.StringBuilder builder, ContainerInline container)
    {
        foreach (Inline child in container)
        {
            switch (child)
            {
                case LiteralInline literal:
                    builder.Append(literal.Content.ToString());
                    break;
                case ContainerInline nested:
                    AppendLinkText(builder, nested);
                    break;
            }
        }
    }
}
