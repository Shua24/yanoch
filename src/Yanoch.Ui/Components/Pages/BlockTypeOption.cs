using Yanoch.Domain;
using Yanoch.Domain.ProseMirror;

namespace Yanoch.Ui.Components.Pages;

/// <summary>
/// One entry in the slash command menu: the block type it creates, the label shown to the user,
/// and the ProseMirror node name and attributes the editor needs to switch to it.
/// </summary>
public sealed class BlockTypeOption
{
    public BlockTypeOption(BlockType blockType, string title, string description, string nodeName, int? headingLevel = null)
    {
        BlockType = blockType;
        Title = title;
        Description = description;
        NodeName = nodeName;
        HeadingLevel = headingLevel;
    }

    public BlockType BlockType { get; }

    public string Title { get; }

    public string Description { get; }

    public string NodeName { get; }

    public int? HeadingLevel { get; }

    public object? BuildAttributes()
    {
        if (HeadingLevel is not null)
        {
            return new { level = HeadingLevel.Value };
        }
        if (BlockType == BlockType.ToDo)
        {
            return new { @checked = false };
        }
        if (BlockType == BlockType.Code)
        {
            return new { language = string.Empty };
        }
        if (BlockType == BlockType.Callout)
        {
            // The defaults match Notion's own: the colour key is the literal "default", and the
            // icon is the same one CreateCallout writes, so a callout made from the menu and one
            // made by converting a paragraph are the same document.
            return new { icon = ProseMirrorNodes.DefaultCalloutIcon, color = ProseMirrorNodes.DefaultCalloutColor };
        }
        return null;
    }
}
