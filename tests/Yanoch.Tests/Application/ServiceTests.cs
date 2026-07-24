using Moq;
using Yanoch.Application.DTOs;
using Yanoch.Application.Interfaces;
using Yanoch.Application.Services;
using Yanoch.Domain.Interfaces;
using Yanoch.Domain.Models;

namespace Yanoch.Tests.Application;

public class PageServiceTests
{
    private readonly Mock<IPageRepository> _pages;
    private readonly Mock<ITagRepository> _tags;
    private readonly Mock<IPageVersionRepository> _versions;
    private readonly Mock<IBacklinkRepository> _backlinks;
    private readonly PageService _svc;
    private readonly Guid _userId = Guid.NewGuid();

    public PageServiceTests()
    {
        _pages = new Mock<IPageRepository>(MockBehavior.Strict);
        _tags = new Mock<ITagRepository>(MockBehavior.Strict);
        _versions = new Mock<IPageVersionRepository>(MockBehavior.Strict);
        _backlinks = new Mock<IBacklinkRepository>(MockBehavior.Strict);
        _svc = new PageService(_pages.Object, _tags.Object, _versions.Object, _backlinks.Object);
    }

    [Fact]
    public async Task GetById_ReturnsNull_WhenNotFound()
    {
        _pages.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync((Page?)null);

        var result = await _svc.GetByIdAsync(Guid.NewGuid(), _userId);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetById_ReturnsDto_WhenFound()
    {
        var page = new Page
        {
            Id = Guid.NewGuid(),
            Title = "Test",
            UserId = _userId,
            Blocks = { new Block { Content = "hello", SortOrder = 0 } }
        };
        _pages.Setup(r => r.GetByIdAsync(page.Id, _userId)).ReturnsAsync(page);

        var result = await _svc.GetByIdAsync(page.Id, _userId);

        Assert.NotNull(result);
        Assert.Equal("Test", result!.Title);
        Assert.Single(result.Blocks);
        Assert.Equal("hello", result.Blocks.First().Content);
    }

    [Fact]
    public async Task Create_WithoutBlocks_ReturnsDto()
    {
        var dto = new CreatePageDto { Title = "New Page" };
        Page? captured = null;
        _pages.Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .Callback<Page>(p => captured = p)
            .ReturnsAsync(() => captured!);

        var result = await _svc.CreateAsync(dto, _userId);

        Assert.NotNull(captured);
        Assert.Equal("New Page", result.Title);
        Assert.Equal(_userId, captured.UserId);
        Assert.Empty(captured.Blocks);
    }

    [Fact]
    public async Task Create_WithBlocks_SavesBlocks()
    {
        var blockId = Guid.NewGuid();
        var dto = new CreatePageDto
        {
            Title = "With Blocks",
            Blocks =
            [
                new CreateBlockDto { Id = blockId, Type = "text", Content = "hi", SortOrder = 0 }
            ]
        };

        Page? captured = null;
        _pages.Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .Callback<Page>(p => captured = p)
            .ReturnsAsync(() => captured!);

        var result = await _svc.CreateAsync(dto, _userId);

        Assert.Single(captured!.Blocks);
        Assert.Equal("hi", captured.Blocks.First().Content);
        Assert.Equal(blockId, captured.Blocks.First().Id);
    }

    [Fact]
    public async Task Create_WithTagIds_AddsPageTags()
    {
        var tagId = Guid.NewGuid();
        var dto = new CreatePageDto { Title = "T", TagIds = [tagId] };

        Page? captured = null;
        _pages.Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .Callback<Page>(p => captured = p)
            .ReturnsAsync(() => captured!);

        await _svc.CreateAsync(dto, _userId);

        var tag = Assert.Single(captured!.PageTags);
        Assert.Equal(tagId, tag.TagId);
    }

    [Fact]
    public async Task Delete_MarksPageDeleted()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId };
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.DeleteAsync(page)).Returns(Task.CompletedTask);

        await _svc.DeleteAsync(pageId, _userId);

        _pages.Verify(r => r.DeleteAsync(page), Times.Once);
    }

    [Fact]
    public async Task Delete_SkipsWhenPageMissing()
    {
        _pages.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync((Page?)null);

        await _svc.DeleteAsync(Guid.NewGuid(), _userId);

        _pages.Verify(r => r.DeleteAsync(It.IsAny<Page>()), Times.Never);
    }

    [Fact]
    public async Task GetTree_ReturnsRootsWithChildCount()
    {
        var root = new Page { Id = Guid.NewGuid(), Title = "Root", UserId = _userId };
        _pages.Setup(r => r.GetRootPagesAsync(_userId)).ReturnsAsync([root]);
        _pages.Setup(r => r.GetByParentAsync(root.Id, _userId)).ReturnsAsync([]);

        var result = (await _svc.GetTreeAsync(_userId)).ToList();

        Assert.Single(result);
        Assert.Equal(0, result[0].ChildCount);
    }

    [Fact]
    public async Task Update_WithoutBlocks_CallsUpdate()
    {
        var page = new Page { Id = Guid.NewGuid(), Title = "Old", UserId = _userId };
        _pages.Setup(r => r.GetByIdAsync(page.Id, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.UpdateAsync(It.IsAny<Page>())).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdAsync(page.Id, _userId)).ReturnsAsync(page);

        var result = await _svc.UpdateAsync(page.Id, new UpdatePageDto { Title = "New" }, _userId);

        Assert.NotNull(result);
        Assert.Equal("New", result!.Title);
    }

    [Fact]
    public async Task Update_WithBlocks_CallsUpdateBlocksAsync()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, Title = "P", UserId = _userId };
        var blockDto = new CreateBlockDto { Id = Guid.NewGuid(), Type = "text", Content = "updated", SortOrder = 0 };

        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.UpdateBlocksAsync(pageId, It.IsAny<List<Block>>())).Returns(Task.CompletedTask);
        _backlinks.Setup(r => r.DeleteBySourcePageAsync(pageId)).Returns(Task.CompletedTask);

        var result = await _svc.UpdateAsync(pageId, new UpdatePageDto { Blocks = [blockDto] }, _userId);

        Assert.NotNull(result);
        _pages.Verify(r => r.UpdateBlocksAsync(pageId, It.IsAny<List<Block>>()), Times.Once);
    }

    [Fact]
    public async Task Update_WithBlocks_ExtractsBacklinks()
    {
        var pageId = Guid.NewGuid();
        var targetId = Guid.NewGuid();
        var page = new Page { Id = pageId, Title = "Source", UserId = _userId };
        var target = new Page { Id = targetId, Title = "Target", UserId = _userId };
        var blockDto = new CreateBlockDto { Content = "see [[Target]]", SortOrder = 0 };

        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.UpdateBlocksAsync(pageId, It.IsAny<List<Block>>())).Returns(Task.CompletedTask);
        _backlinks.Setup(r => r.DeleteBySourcePageAsync(pageId)).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetRootPagesAsync(_userId)).ReturnsAsync([page, target]);
        _pages.Setup(r => r.GetByParentAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync([]);
        _backlinks.Setup(r => r.CreateAsync(It.IsAny<Backlink>())).Returns(Task.CompletedTask);

        await _svc.UpdateAsync(pageId, new UpdatePageDto { Blocks = [blockDto] }, _userId);

        _backlinks.Verify(r => r.CreateAsync(It.Is<Backlink>(b => b.TargetPageId == targetId)), Times.Once);
    }

    [Fact]
    public async Task Search_MapsToSearchResultDto()
    {
        var page = new Page { Id = Guid.NewGuid(), Title = "Found", Icon = "📄", UpdatedAt = DateTime.UtcNow };
        _pages.Setup(r => r.SearchAsync("find", _userId)).ReturnsAsync([page]);

        var result = (await _svc.SearchAsync("find", _userId)).ToList();

        Assert.Single(result);
        Assert.Equal("Found", result[0].Title);
        Assert.Equal("📄", result[0].Icon);
    }

    [Fact]
    public async Task AddBlock_DelegatesToRepo()
    {
        var pageId = Guid.NewGuid();
        var dto = new CreateBlockDto { Type = "code", Content = "x = 1", SortOrder = 0 };
        _pages.Setup(r => r.AddBlockAsync(It.IsAny<Block>())).Returns(Task.CompletedTask);

        await _svc.AddBlockAsync(dto, pageId);

        _pages.Verify(r => r.AddBlockAsync(It.Is<Block>(b => b.Content == "x = 1" && b.PageId == pageId)), Times.Once);
    }

    [Fact]
    public async Task DeleteBlock_DelegatesToRepo()
    {
        var pageId = Guid.NewGuid();
        var blockId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId };
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.DeleteBlockAsync(blockId, pageId)).Returns(Task.CompletedTask);

        await _svc.DeleteBlockAsync(pageId, blockId, _userId);

        _pages.Verify(r => r.DeleteBlockAsync(blockId, pageId), Times.Once);
    }

    [Fact]
    public async Task RenumberBlocks_DelegatesToRepo()
    {
        var pageId = Guid.NewGuid();
        var ids = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() };
        _pages.Setup(r => r.RenumberBlocksAsync(pageId, ids)).Returns(Task.CompletedTask);

        await _svc.RenumberBlocksAsync(pageId, ids);

        _pages.Verify(r => r.RenumberBlocksAsync(pageId, ids), Times.Once);
    }

    [Fact]
    public async Task UpdateBlockContent_DelegatesToRepo()
    {
        var pageId = Guid.NewGuid();
        var blockId = Guid.NewGuid();
        _pages.Setup(r => r.UpdateBlockContentAsync(blockId, "new", pageId)).Returns(Task.CompletedTask);

        await _svc.UpdateBlockContentAsync(pageId, blockId, "new", _userId);

        _pages.Verify(r => r.UpdateBlockContentAsync(blockId, "new", pageId), Times.Once);
    }

    [Fact]
    public async Task GetChildren_ReturnsDtos()
    {
        var parentId = Guid.NewGuid();
        var child = new Page { Id = Guid.NewGuid(), Title = "Child", UserId = _userId };
        _pages.Setup(r => r.GetByParentAsync(parentId, _userId)).ReturnsAsync([child]);
        _pages.Setup(r => r.GetByParentAsync(child.Id, _userId)).ReturnsAsync([]);

        var result = (await _svc.GetChildrenAsync(parentId, _userId)).ToList();

        Assert.Single(result);
        Assert.Equal("Child", result[0].Title);
    }

    [Fact]
    public async Task GetRecent_ReturnsDtos()
    {
        var page = new Page { Id = Guid.NewGuid(), Title = "Recent", UserId = _userId };
        _pages.Setup(r => r.GetRecentAsync(_userId, 10)).ReturnsAsync([page]);

        var result = (await _svc.GetRecentAsync(_userId)).ToList();

        Assert.Single(result);
        Assert.Equal("Recent", result[0].Title);
    }

    [Fact]
    public async Task GetVersions_ReturnsVersionDtos()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId };
        var version = new PageVersion { Id = Guid.NewGuid(), VersionNumber = 1, Title = "v1", CreatedAt = DateTime.UtcNow };

        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _versions.Setup(r => r.GetByPageAsync(pageId)).ReturnsAsync([version]);

        var result = (await _svc.GetVersionsAsync(pageId, _userId)).ToList();

        Assert.Single(result);
        Assert.Equal(1, result[0].VersionNumber);
    }

    [Fact]
    public async Task GetVersions_Empty_WhenPageMissing()
    {
        _pages.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync((Page?)null);

        var result = await _svc.GetVersionsAsync(Guid.NewGuid(), _userId);

        Assert.Empty(result);
    }

    [Fact]
    public async Task RestoreVersion_RestoresTitleAndBlocks()
    {
        var pageId = Guid.NewGuid();
        var versionId = Guid.NewGuid();
        var page = new Page { Id = pageId, Title = "current", UserId = _userId };
        var version = new PageVersion
        {
            Id = versionId,
            PageId = pageId,
            Title = "restored",
            BlocksJson = "[{\"Content\":\"restored block\"}]"
        };

        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _versions.Setup(r => r.GetByIdAsync(versionId)).ReturnsAsync(version);
        _pages.Setup(r => r.ReplaceBlocksAsync(pageId, It.IsAny<List<Block>>())).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);

        var result = await _svc.RestoreVersionAsync(pageId, versionId, _userId);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task RestoreVersion_ReturnsNull_WhenMismatch()
    {
        var version = new PageVersion { Id = Guid.NewGuid(), PageId = Guid.NewGuid() }; // different pageId
        _pages.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync(new Page());
        _versions.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(version);

        var result = await _svc.RestoreVersionAsync(Guid.NewGuid(), version.Id, _userId);

        Assert.Null(result);
    }
}

public class TagServiceTests
{
    private readonly Mock<ITagRepository> _tags;
    private readonly TagService _svc;
    private readonly Guid _userId = Guid.NewGuid();

    public TagServiceTests()
    {
        _tags = new Mock<ITagRepository>(MockBehavior.Strict);
        _svc = new TagService(_tags.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsDtos()
    {
        var tag = new Tag { Id = Guid.NewGuid(), Name = "bug", Color = "red", UserId = _userId };
        _tags.Setup(r => r.GetByUserAsync(_userId)).ReturnsAsync([tag]);

        var result = (await _svc.GetAllAsync(_userId)).ToList();

        Assert.Single(result);
        Assert.Equal("bug", result[0].Name);
        Assert.Equal("red", result[0].Color);
    }

    [Fact]
    public async Task Create_DelegatesAndReturnsDto()
    {
        Tag? captured = null;
        _tags.Setup(r => r.CreateAsync(It.IsAny<Tag>()))
            .Callback<Tag>(t => captured = t)
            .ReturnsAsync(() => captured!);

        var result = await _svc.CreateAsync("feature", "blue", _userId);

        Assert.NotNull(captured);
        Assert.Equal("feature", captured.Name);
        Assert.Equal("blue", captured.Color);
        Assert.Equal(_userId, captured.UserId);
        Assert.Equal("feature", result.Name);
    }

    [Fact]
    public async Task Delete_DeletesOwnTagOnly()
    {
        var tagId = Guid.NewGuid();
        var tag = new Tag { Id = tagId, UserId = _userId };
        _tags.Setup(r => r.GetByIdAsync(tagId)).ReturnsAsync(tag);
        _tags.Setup(r => r.DeleteAsync(tag)).Returns(Task.CompletedTask);

        await _svc.DeleteAsync(tagId, _userId);

        _tags.Verify(r => r.DeleteAsync(tag), Times.Once);
    }

    [Fact]
    public async Task Delete_SkipsOtherUsersTag()
    {
        var tag = new Tag { Id = Guid.NewGuid(), UserId = Guid.NewGuid() }; // different user
        _tags.Setup(r => r.GetByIdAsync(tag.Id)).ReturnsAsync(tag);

        await _svc.DeleteAsync(tag.Id, _userId);

        _tags.Verify(r => r.DeleteAsync(It.IsAny<Tag>()), Times.Never);
    }

    [Fact]
    public async Task Search_ReturnsMatchingDtos()
    {
        var tag = new Tag { Id = Guid.NewGuid(), Name = "urgent", Color = "orange", UserId = _userId };
        _tags.Setup(r => r.SearchAsync("urg", _userId)).ReturnsAsync([tag]);

        var result = (await _svc.SearchAsync("urg", _userId)).ToList();

        Assert.Single(result);
        Assert.Equal("urgent", result[0].Name);
    }
}