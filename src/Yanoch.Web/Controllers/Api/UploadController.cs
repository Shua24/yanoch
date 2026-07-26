using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yanoch.Application.Interfaces;

namespace Yanoch.Web.Controllers.Api;

[ApiController, Authorize, Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IFileStorageService _fileStorage;

    public UploadController(IFileStorageService fileStorage)
    {
        _fileStorage = fileStorage;
    }

    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        try
        {
            using (var stream = file.OpenReadStream())
            {
                var fileUrl = await _fileStorage.SaveAsync(stream, file.FileName);
                return Ok(new { url = fileUrl });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}