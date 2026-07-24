using Yanoch.Domain.Enums;
using Yanoch.Domain.Models;

namespace Yanoch.Tests.Domain;

public class PageTests
{
    [Fact]
    public void Page_Defaults()
    {
        var p = new Page();

        Assert.NotEqual(Guid.Empty, p.Id);
        Assert.Equal("Untitled", p.Title);
        Assert.Null(p.Icon);
        Assert.Null(p.CoverUrl);
        Assert.Equal(default, p.UserId);
        Assert.Null(p.ParentPageId);
        Assert.Equal(0, p.SortOrder);
        Assert.False(p.IsDeleted);
        Assert.Empty(p.Children);
        Assert.Empty(p.Blocks);
        Assert.Empty(p.PageTags);
        Assert.Empty(p.Versions);
        Assert.Empty(p.Backlinks);
        Assert.Empty(p.References);
        Assert.NotEqual(default, p.CreatedAt);
        Assert.NotEqual(default, p.UpdatedAt);
    }

    [Fact]
    public void Page_SoftDelete()
    {
        var p = new Page { IsDeleted = true, DeletedAt = DateTime.UtcNow };
        Assert.True(p.IsDeleted);
        Assert.NotNull(p.DeletedAt);
    }
}

public class BlockTests
{
    [Fact]
    public void Block_Defaults()
    {
        var b = new Block();
        Assert.NotEqual(Guid.Empty, b.Id);
        Assert.Equal("text", b.Type);
        Assert.Equal("", b.Content);
        Assert.Null(b.Metadata);
        Assert.Equal(0, b.SortOrder);
        Assert.False(b.IsDeleted);
        Assert.Null(b.ParentBlockId);
        Assert.Empty(b.Children);
    }

    [Fact]
    public void Block_NestedChildren()
    {
        var parent = new Block { Id = Guid.NewGuid(), Content = "parent" };
        var child = new Block { Id = Guid.NewGuid(), Content = "child", ParentBlockId = parent.Id };
        parent.Children.Add(child);

        Assert.Single(parent.Children);
        Assert.Equal("child", parent.Children.First().Content);
        Assert.Equal(parent.Id, child.ParentBlockId);
    }
}

public class TagTests
{
    [Fact]
    public void Tag_Defaults()
    {
        var t = new Tag();
        Assert.NotEqual(Guid.Empty, t.Id);
        Assert.Equal("", t.Name);
        Assert.Null(t.Color);
        Assert.Equal(default, t.UserId);
        Assert.Empty(t.PageTags);
    }

    [Fact]
    public void Tag_WithColor()
    {
        var t = new Tag { Name = "important", Color = "#ff0000", UserId = Guid.NewGuid() };
        Assert.Equal("#ff0000", t.Color);
    }
}

public class BacklinkTests
{
    [Fact]
    public void Backlink_Defaults()
    {
        var b = new Backlink();
        Assert.NotEqual(Guid.Empty, b.Id);
        Assert.Equal(default, b.SourcePageId);
        Assert.Equal(default, b.TargetPageId);
        Assert.Null(b.Context);
    }
}

public class PageVersionTests
{
    [Fact]
    public void PageVersion_Defaults()
    {
        var v = new PageVersion();
        Assert.NotEqual(Guid.Empty, v.Id);
        Assert.Equal(0, v.VersionNumber);
        Assert.Equal("", v.Title);
        Assert.Equal("", v.BlocksJson);
        Assert.Null(v.Description);
    }
}

public class PageTagTests
{
    [Fact]
    public void PageTag_CompositeKey()
    {
        var pageId = Guid.NewGuid();
        var tagId = Guid.NewGuid();
        var pt = new PageTag { PageId = pageId, TagId = tagId };

        Assert.Equal(pageId, pt.PageId);
        Assert.Equal(tagId, pt.TagId);
    }
}

public class BlockTypeTests
{
    [Fact]
    public void BlockType_HasExpectedValues()
    {
        Assert.Equal(0, (int)BlockType.Text);
        Assert.Equal(1, (int)BlockType.Heading1);
        Assert.Equal(8, (int)BlockType.Code);
        Assert.Equal(12, (int)BlockType.Image);
        Assert.Equal(17, (int)BlockType.Embed);
    }

    [Fact]
    public void BlockType_CoversAllNotionTypes()
    {
        var values = Enum.GetValues<BlockType>();
        Assert.Equal(18, values.Length);
    }
}