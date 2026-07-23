using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yanoch.Application.Interfaces;

namespace Yanoch.Web.Controllers.Api;

[ApiController, Authorize, Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly ITagService _tags;
    public TagsController(ITagService tags) => _tags = tags;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _tags.GetAllAsync(UserId()));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTagRequest req) => Ok(await _tags.CreateAsync(req.Name, req.Color, UserId()));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) { await _tags.DeleteAsync(id, UserId()); return NoContent(); }

    private Guid UserId() => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
}

public record CreateTagRequest(string Name, string? Color);
