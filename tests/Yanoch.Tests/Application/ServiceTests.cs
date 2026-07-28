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
    private readonly Mock<IFileStorageService> _fileStorage;
    private readonly PageService _svc;
    private readonly Guid _userId = Guid.NewGuid();

    public PageServiceTests()
    {
        _pages = new Mock<IPageRepository>(MockBehavior.Strict);
        _tags = new Mock<ITagRepository>(MockBehavior.Strict);
        _versions = new Mock<IPageVersionRepository>(MockBehavior.Strict);
        _backlinks = new Mock<IBacklinkRepository>(MockBehavior.Strict);
        // File storage is only touched on HardDeleteAsync; Loose so other tests
        // don't have to stub unrelated calls.
        _fileStorage = new Mock<IFileStorageService>(MockBehavior.Loose);
        _svc = new PageService(_pages.Object, _tags.Object, _versions.Object, _backlinks.Object, _fileStorage.Object);
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
            Content = "# Hello"
        };
        _pages.Setup(r => r.GetByIdAsync(page.Id, _userId)).ReturnsAsync(page);

        var result = await _svc.GetByIdAsync(page.Id, _userId);

        Assert.NotNull(result);
        Assert.Equal("Test", result!.Title);
        Assert.Equal("# Hello", result.Content);
    }

    [Fact]
    public async Task Create_WithContent_ReturnsDto()
    {
        var dto = new CreatePageDto { Title = "New Page", Content = "initial content" };
        Page? captured = null;
        _pages.Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .Callback<Page>(p => captured = p)
            .ReturnsAsync(() => captured!);

        var result = await _svc.CreateAsync(dto, _userId);

        Assert.NotNull(captured);
        Assert.Equal("New Page", result.Title);
        Assert.Equal("initial content", captured.Content);
        Assert.Equal(_userId, captured.UserId);
    }

    [Fact]
    public async Task Create_EmptyContent_DefaultsToEmptyString()
    {
        var dto = new CreatePageDto { Title = "No Content" };
        Page? captured = null;
        _pages.Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .Callback<Page>(p => captured = p)
            .ReturnsAsync(() => captured!);

        await _svc.CreateAsync(dto, _userId);

        Assert.Equal("", captured!.Content);
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
        _pages.Setup(r => r.GetByIdTrackedAsync(pageId, _userId)).ReturnsAsync(page);
        // DeleteAsync now delegates to SoftDeleteAsync; mock that surface.
        _pages.Setup(r => r.SoftDeleteAsync(page)).Returns(Task.CompletedTask);

        await _svc.DeleteAsync(pageId, _userId);

        _pages.Verify(r => r.SoftDeleteAsync(page), Times.Once);
    }

    [Fact]
    public async Task Delete_SkipsWhenPageMissing()
    {
        _pages.Setup(r => r.GetByIdTrackedAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync((Page?)null);

        await _svc.DeleteAsync(Guid.NewGuid(), _userId);

        _pages.Verify(r => r.SoftDeleteAsync(It.IsAny<Page>()), Times.Never);
    }

    [Fact]
    public async Task GetTree_ReturnsRootsWithChildCount()
    {
        var root = new Page { Id = Guid.NewGuid(), Title = "Root", UserId = _userId };
        _pages.Setup(r => r.GetRootPagesAsync(_userId)).ReturnsAsync([root]);
        _pages.Setup(r => r.GetChildCountsAsync(new[] { root.Id }, _userId)).ReturnsAsync(new Dictionary<Guid, int>());

        var result = (await _svc.GetTreeAsync(_userId)).ToList();

        Assert.Single(result);
        Assert.Equal(0, result[0].ChildCount);
    }

    [Fact]
    public async Task Update_UpdatesTitle()
    {
        var page = new Page { Id = Guid.NewGuid(), Title = "Old", UserId = _userId };
        _pages.Setup(r => r.GetByIdTrackedWithTagsAsync(page.Id, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.UpdateAsync(It.IsAny<Page>())).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdTrackedWithTagsAsync(page.Id, _userId)).ReturnsAsync(page);
        // Final fresh read for DTO mapping — still uses GetByIdAsync (read path)
        _pages.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>())).ReturnsAsync(page);

        var result = await _svc.UpdateAsync(page.Id, new UpdatePageDto { Title = "New" }, _userId);

        Assert.NotNull(result);
        Assert.Equal("New", result!.Title);
    }

    [Fact]
    public async Task Update_WithNewTags_ReplacesTags()
    {
        var pageId = Guid.NewGuid();
        var tagId = Guid.NewGuid();
        var page = new Page { Id = pageId, Title = "P", UserId = _userId };
        _pages.Setup(r => r.GetByIdTrackedWithTagsAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.UpdateAsync(It.IsAny<Page>())).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdTrackedWithTagsAsync(pageId, _userId)).ReturnsAsync(page);
        // Final fresh read for DTO mapping
        _pages.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>())).ReturnsAsync(page);

        var result = await _svc.UpdateAsync(pageId, new UpdatePageDto { TagIds = [tagId] }, _userId);

        Assert.NotNull(result);
        Assert.Contains(page.PageTags, pt => pt.TagId == tagId);
    }

    [Fact]
    public async Task SetContentAsync_UpdatesContentAndExtractsBacklinks()
    {
        var pageId = Guid.NewGuid();
        var targetId = Guid.NewGuid();
        var page = new Page { Id = pageId, Title = "Source", UserId = _userId };
        var target = new Page { Id = targetId, Title = "Target", UserId = _userId, ParentPageId = null };

        _pages.Setup(r => r.SetContentAsync(pageId, "Hello [[Target]]")).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);
        _backlinks.Setup(r => r.DeleteBySourcePageAsync(pageId)).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetRootPagesAsync(_userId)).ReturnsAsync([page, target]);
        _pages.Setup(r => r.GetByParentAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync([]);
        _backlinks.Setup(r => r.CreateAsync(It.IsAny<Backlink>())).Returns(Task.CompletedTask);

        await _svc.SetContentAsync(pageId, "Hello [[Target]]", _userId);

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
    public async Task GetChildren_ReturnsDtos()
    {
        var parentId = Guid.NewGuid();
        var child = new Page { Id = Guid.NewGuid(), Title = "Child", UserId = _userId };
        _pages.Setup(r => r.GetByParentAsync(parentId, _userId)).ReturnsAsync([child]);
        _pages.Setup(r => r.GetChildCountsAsync(new[] { child.Id }, _userId)).ReturnsAsync(new Dictionary<Guid, int>());

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
        var version = new PageVersion { Id = Guid.NewGuid(), VersionNumber = 1, Title = "v1", Content = "content", CreatedAt = DateTime.UtcNow };

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
    public async Task RestoreVersion_RestoresTitleAndContent()
    {
        var pageId = Guid.NewGuid();
        var versionId = Guid.NewGuid();
        var page = new Page { Id = pageId, Title = "current", UserId = _userId };
        var version = new PageVersion
        {
            Id = versionId,
            PageId = pageId,
            Title = "restored",
            Content = "# Restored content"
        };

        _pages.Setup(r => r.GetByIdTrackedAsync(pageId, _userId)).ReturnsAsync(page);
        _versions.Setup(r => r.GetByIdAsync(versionId)).ReturnsAsync(version);
        _pages.Setup(r => r.UpdateAsync(It.IsAny<Page>())).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(page);

        var result = await _svc.RestoreVersionAsync(pageId, versionId, _userId);

        Assert.NotNull(result);
        Assert.Equal("restored", page.Title);
        Assert.Equal("# Restored content", page.Content);
    }

    [Fact]
    public async Task RestoreVersion_ReturnsNull_WhenMismatch()
    {
        var version = new PageVersion { Id = Guid.NewGuid(), PageId = Guid.NewGuid() }; // different pageId
        _pages.Setup(r => r.GetByIdTrackedAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync(new Page());
        _versions.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(version);

        var result = await _svc.RestoreVersionAsync(Guid.NewGuid(), version.Id, _userId);

        Assert.Null(result);
    }

    [Fact]
    public async Task SoftDelete_MarksPageAndChildrenDeleted()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId };
        _pages.Setup(r => r.GetByIdTrackedAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.SoftDeleteAsync(page)).Returns(Task.CompletedTask);

        await _svc.SoftDeleteAsync(pageId, _userId);

        _pages.Verify(r => r.SoftDeleteAsync(page), Times.Once);
    }

    [Fact]
    public async Task SoftDelete_SkipsWhenPageMissing()
    {
        _pages.Setup(r => r.GetByIdTrackedAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync((Page?)null);

        await _svc.SoftDeleteAsync(Guid.NewGuid(), _userId);

        _pages.Verify(r => r.SoftDeleteAsync(It.IsAny<Page>()), Times.Never);
    }

    [Fact]
    public async Task Delete_DefaultsToSoftDelete()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId };
        _pages.Setup(r => r.GetByIdTrackedAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.SoftDeleteAsync(page)).Returns(Task.CompletedTask);

        await _svc.DeleteAsync(pageId, _userId);

        _pages.Verify(r => r.SoftDeleteAsync(page), Times.Once);
    }

    [Fact]
    public async Task HardDelete_AcceptsSoftDeletedPage()
    {
        var pageId = Guid.NewGuid();
        // In the trash, GetByIdAsync (filtered) returns null, but
        // GetByIdIncludingDeletedAsync returns the page.
        var page = new Page { Id = pageId, UserId = _userId, IsDeleted = true };
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync((Page?)null);
        _pages.Setup(r => r.GetByIdIncludingDeletedAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.GetSubtreeIncludingDeletedAsync(pageId, _userId)).ReturnsAsync([page]);
        _pages.Setup(r => r.HardDeleteAsync(page)).Returns(Task.CompletedTask);

        await _svc.HardDeleteAsync(pageId, _userId);

        _pages.Verify(r => r.HardDeleteAsync(page), Times.Once);
    }

    [Fact]
    public async Task HardDelete_RemovesReferencedUploadFiles()
    {
        var pageId = Guid.NewGuid();
        var page = new Page
        {
            Id = pageId,
            UserId = _userId,
            Content = "see ![](https://x/y.png) and <img src=\"/uploads/abc123.png\" />"
        };
        _pages.Setup(r => r.GetByIdIncludingDeletedAsync(pageId, _userId)).ReturnsAsync(page);
        _pages.Setup(r => r.GetSubtreeIncludingDeletedAsync(pageId, _userId)).ReturnsAsync([page]);
        _pages.Setup(r => r.HardDeleteAsync(page)).Returns(Task.CompletedTask);

        await _svc.HardDeleteAsync(pageId, _userId);

        _fileStorage.Verify(f => f.DeleteAsync("/uploads/abc123.png"), Times.Once);
    }

    [Fact]
    public async Task HardDelete_SkipsWhenPageMissing()
    {
        _pages.Setup(r => r.GetByIdIncludingDeletedAsync(It.IsAny<Guid>(), _userId)).ReturnsAsync((Page?)null);

        await _svc.HardDeleteAsync(Guid.NewGuid(), _userId);

        _pages.Verify(r => r.HardDeleteAsync(It.IsAny<Page>()), Times.Never);
    }

    [Fact]
    public async Task Restore_ReturnsDto_WhenPageInTrash()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId, IsDeleted = true, DeletedAt = DateTime.UtcNow };
        var restored = new Page { Id = pageId, UserId = _userId, IsDeleted = false, DeletedAt = null };
        _pages.Setup(r => r.GetByIdIncludingDeletedTrackedAsync(pageId, _userId)).ReturnsAsync(page);
        // Mock the repository's RestoreAsync as a real mutation, so the DTO mapping
        // reflects post-restore state.
        _pages.Setup(r => r.RestoreAsync(page)).Callback<Page>(p => { p.IsDeleted = false; p.DeletedAt = null; }).Returns(Task.CompletedTask);
        _pages.Setup(r => r.GetByIdAsync(pageId, _userId)).ReturnsAsync(restored);

        var result = await _svc.RestoreAsync(pageId, _userId);

        Assert.NotNull(result);
        Assert.False(result!.IsDeleted);
        _pages.Verify(r => r.RestoreAsync(page), Times.Once);
    }

    [Fact]
    public async Task Restore_ReturnsNull_WhenPageNotInTrash()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId }; // IsDeleted = false
        _pages.Setup(r => r.GetByIdIncludingDeletedTrackedAsync(pageId, _userId)).ReturnsAsync(page);

        var result = await _svc.RestoreAsync(pageId, _userId);

        Assert.Null(result);
        _pages.Verify(r => r.RestoreAsync(It.IsAny<Page>()), Times.Never);
    }

    [Fact]
    public async Task GetDeleted_ReturnsTrashDtos()
    {
        var page = new Page { Id = Guid.NewGuid(), UserId = _userId, IsDeleted = true };
        _pages.Setup(r => r.GetDeletedAsync(_userId)).ReturnsAsync([page]);

        var result = (await _svc.GetDeletedAsync(_userId)).ToList();

        Assert.Single(result);
        Assert.True(result[0].IsDeleted);
    }

    [Fact]
    public async Task GetSubtreeIncludingDeleted_ReturnsRootDto_EvenWhenDeleted()
    {
        var pageId = Guid.NewGuid();
        var page = new Page { Id = pageId, UserId = _userId, IsDeleted = true };
        _pages.Setup(r => r.GetByIdIncludingDeletedAsync(pageId, _userId)).ReturnsAsync(page);

        var result = await _svc.GetSubtreeIncludingDeletedAsync(pageId, _userId);

        Assert.NotNull(result);
        Assert.True(result!.IsDeleted);
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
