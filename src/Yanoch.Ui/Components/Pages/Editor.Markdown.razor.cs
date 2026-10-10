using System.Text;
using System.Text.Json.Nodes;
using Yanoch.Domain;
using Yanoch.Domain.ProseMirror;
using Yanoch.Domain.Services;
using Yanoch.Ui.Interop;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// Markdown import and export for the page editor. Split out of <c>Editor.razor.cs</c> so each
/// file stays small; the shared state is declared in <c>Editor.razor.cs</c>.
/// </summary>
public partial class Editor
{
    private async Task ExportMarkdownAsync()
    {
        if (currentPage is null)
        {
            return;
        }
        string markdown = BuildPageMarkdown();
        string fileName = BuildExportFileName();
        await FileInterop.DownloadTextAsync(fileName, markdown);
    }

    private async Task ImportMarkdownAsync()
    {
        PickedTextFile? picked = await FileInterop.PickTextFileAsync(".md,.markdown,.txt");
        if (picked is null || picked.Text.Length == 0)
        {
            return;
        }

        JsonObject document = MarkdownReader.ReadDocument(picked.Text);
        JsonArray? blocks = document["content"] as JsonArray;
        if (blocks is null || blocks.Count == 0)
        {
            return;
        }

        List<Block> importedBlocks = BuildImportedBlocks(blocks);
        if (importedBlocks.Count == 0)
        {
            return;
        }

        await Repository.ReplaceSiblingsAsync(PageId, null, importedBlocks);
        await ReloadBlocksAsync(null, false);
    }

    private static List<Block> BuildImportedBlocks(JsonArray blocks)
    {
        List<Block> importedBlocks = new List<Block>();
        int sortOrder = 0;
        foreach (JsonNode? blockNode in blocks)
        {
            if (blockNode is not JsonObject blockObject)
            {
                continue;
            }
            JsonArray singleBlockContent = new JsonArray { blockObject.DeepClone() };
            JsonObject blockDocument = ProseMirrorNodes.CreateDocument(singleBlockContent);

            Block importedBlock = new Block { SortOrder = sortOrder, IndentLevel = 0 };
            BlockContentService.SetContentJson(importedBlock, ProseMirrorConverter.SerializeDocument(blockDocument));
            importedBlocks.Add(importedBlock);
            sortOrder++;
        }
        return importedBlocks;
    }

    /// <summary>
    /// Writes the page as Markdown, walking the tree in order. A column list is flattened: each
    /// column's blocks are emitted in turn, so nothing is silently dropped on export.
    /// </summary>
    private string BuildPageMarkdown()
    {
        StringBuilder builder = new StringBuilder();
        AppendMarkdown(builder, ReadChildren(null));
        string result = builder.ToString();
        return result;
    }

    private void AppendMarkdown(StringBuilder builder, IReadOnlyList<Block> siblings)
    {
        foreach (Block block in siblings)
        {
            if (block.BlockType == BlockType.ColumnList)
            {
                foreach (Block column in ReadChildren(block.Id))
                {
                    AppendMarkdown(builder, ReadChildren(column.Id));
                }
                continue;
            }

            string blockMarkdown = BlockContentService.ReadMarkdown(block);
            builder.Append(blockMarkdown);
            builder.Append('\n');
        }
    }

    private string BuildExportFileName()
    {
        string title = currentPage?.Title ?? "page";
        foreach (char invalidCharacter in Path.GetInvalidFileNameChars())
        {
            title = title.Replace(invalidCharacter, '-');
        }
        string fileName = title.Trim().Length == 0 ? "page.md" : title.Trim() + ".md";
        return fileName;
    }
}
