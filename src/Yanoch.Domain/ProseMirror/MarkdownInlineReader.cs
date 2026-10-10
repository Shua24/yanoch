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

            case LinkInline link:
                JsonArray linkMarks = CloneMarks(inheritedMarks);
                JsonObject linkAttributes = new JsonObject { ["href"] = link.Url ?? string.Empty };
                linkMarks.Add(ProseMirrorNodes.CreateMark("link", linkAttributes));
                AppendContainerInline(nodes, link, linkMarks);
                break;

            case LineBreakInline:
                nodes.Add(ProseMirrorNodes.CreateText("\n", CloneMarks(inheritedMarks)));
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
}
