using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yanoch.Application.DTOs;
using Yanoch.Application.Interfaces;

namespace Yanoch.Web.Controllers.Api;

[ApiController, Authorize, Route("api/[controller]")]
public class PagesController : ControllerBase
{
    private readonly IPageService _pages;
    public PagesController(IPageService pages) => _pages = pages;

    [HttpGet("tree")]
    public async Task<IActionResult> GetTree() => Ok(await _pages.GetTreeAsync(UserId()));

    [HttpGet("children/{parentId?}")]
    public async Task<IActionResult> GetChildren(Guid? parentId) => Ok(await _pages.GetChildrenAsync(parentId, UserId()));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var page = await _pages.GetByIdAsync(id, UserId());
        return page == null ? NotFound() : Ok(page);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePageDto dto) => Ok(await _pages.CreateAsync(dto, UserId()));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePageDto dto)
    {
        var page = await _pages.UpdateAsync(id, dto, UserId());
        return page == null ? NotFound() : Ok(page);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _pages.DeleteAsync(id, UserId());
        return NoContent();
    }

    [HttpGet("versions/{pageId}")]
    public async Task<IActionResult> GetVersions(Guid pageId) => Ok(await _pages.GetVersionsAsync(pageId, UserId()));

    [HttpPost("restore/{pageId}/{versionId}")]
    public async Task<IActionResult> Restore(Guid pageId, Guid versionId)
    {
        var page = await _pages.RestoreVersionAsync(pageId, versionId, UserId());
        return page == null ? NotFound() : Ok(page);
    }

    private Guid UserId() => Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var uid) ? uid : Guid.Empty;
}
