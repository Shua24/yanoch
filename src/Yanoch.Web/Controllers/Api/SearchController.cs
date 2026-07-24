using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yanoch.Application.Interfaces;

namespace Yanoch.Web.Controllers.Api;

[ApiController, Authorize, Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly IPageService _pages;
    private readonly ITagService _tags;
    public SearchController(IPageService pages, ITagService tags) { _pages = pages; _tags = tags; }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q)) return Ok(new { pages = Array.Empty<object>(), tags = Array.Empty<object>() });
        var userId = Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var uid) ? uid : Guid.Empty;
        var pages = await _pages.SearchAsync(q, userId);
        var tags = await _tags.SearchAsync(q, userId);
        return Ok(new { pages, tags });
    }
}
