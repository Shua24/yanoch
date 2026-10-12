using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Yanoch.Data;

namespace Yanoch.Server.Identity;

/// <summary>
/// The image upload and serving endpoints. Both hosts reach these because they are chained onto the
/// same call site as <see cref="ApplicationEndpoints.MapYanochApplicationEndpoints"/>, so the web
/// harness and the desktop app cannot drift.
///
/// Reading an image requires a signed-in user. The bytes therefore live OUTSIDE any web root: a file
/// under wwwroot is served publicly by definition, and a static file server never checks a session.
/// Serving through an endpoint is what makes the access rule enforceable at all.
/// </summary>
public static class MediaEndpoints
{
    /// <summary>
    /// The application-level cap. Kestrel's own limit is raised ABOVE this one so that a file
    /// between the two limits still reaches this code and gets the message below, instead of being
    /// refused by the server with a bare 413.
    /// </summary>
    public const long MaximumUploadBytes = 50L * 1024 * 1024;

    /// <summary>The form field name the client posts the file under.</summary>
    public const string UploadFieldName = "file";

    /// <summary>The route prefix both endpoints live under.</summary>
    public const string MediaPathPrefix = "/media";

    /// <summary>
    /// The header a same-origin <c>fetch</c> sends the antiforgery token in. The token itself is
    /// rendered into every signed-in page by the layout's <c>AntiforgeryToken</c> component, so the
    /// upload helper reads it from the DOM rather than being handed one.
    /// </summary>
    public const string AntiforgeryHeaderName = "RequestVerificationToken";

    public static IEndpointRouteBuilder MapYanochMediaEndpoints(this IEndpointRouteBuilder endpoints)
    {
        RouteGroupBuilder mediaGroup = endpoints.MapGroup(MediaPathPrefix);
        mediaGroup.RequireAuthorization();

        // Binding IFormFile is what makes the framework require an antiforgery token for this
        // endpoint. Reading the form by hand instead would silently opt out of that check, so the
        // parameter is bound rather than pulled out of HttpRequest.
        mediaGroup.MapPost("/", UploadImageAsync);

        mediaGroup.MapGet("/{storedName}", ServeImage);

        return endpoints;
    }

    /// <summary>
    /// Accepts one image, verifies it by its magic bytes, and writes it under a generated name.
    /// Returns the stored name, which is the value the image block holds.
    /// </summary>
    private static async Task<IResult> UploadImageAsync(
        IFormFile file,
        [FromServices] IConfiguration configuration)
    {
        if (file.Length <= 0)
        {
            return TypedResults.BadRequest(new MediaError("The file is empty."));
        }

        if (file.Length > MaximumUploadBytes)
        {
            long maximumMegabytes = MaximumUploadBytes / (1024 * 1024);
            return TypedResults.BadRequest(
                new MediaError($"Images must be {maximumMegabytes} MB or smaller."));
        }

        // Verified from the BYTES, not from the file name or the Content-Type the client claimed.
        await using Stream uploadedStream = file.OpenReadStream();
        (string ContentType, string Extension)? detectedType = ImageContentType.ReadSupportedType(uploadedStream);
        if (detectedType is null)
        {
            return TypedResults.BadRequest(
                new MediaError("That file is not a supported image. Use PNG, JPEG, GIF or WebP."));
        }

        string mediaDirectory = MediaStore.ReadMediaDirectory(configuration);
        MediaStore.EnsureMediaDirectory(mediaDirectory);

        string storedName = MediaStore.CreateStoredName(detectedType.Value.Extension);
        string storedPath = Path.Combine(mediaDirectory, storedName);

        uploadedStream.Position = 0;
        await using (FileStream destination = File.Create(storedPath))
        {
            await uploadedStream.CopyToAsync(destination);
        }

        return TypedResults.Ok(new MediaUploadResult(storedName));
    }

    /// <summary>
    /// Serves a stored image to a signed-in user.
    /// </summary>
    private static IResult ServeImage(
        string storedName,
        [FromServices] IConfiguration configuration)
    {
        // The name is validated against the generated shape BEFORE it reaches the filesystem. That
        // single check refuses path traversal, absolute paths, and any name this app did not create.
        if (!MediaStore.IsStoredName(storedName))
        {
            return TypedResults.NotFound();
        }

        string mediaDirectory = MediaStore.ReadMediaDirectory(configuration);
        string storedPath = Path.Combine(mediaDirectory, storedName);
        if (!File.Exists(storedPath))
        {
            return TypedResults.NotFound();
        }

        string contentType = ReadContentTypeForExtension(Path.GetExtension(storedName));
        return Results.File(storedPath, contentType, enableRangeProcessing: false);
    }

    private static string ReadContentTypeForExtension(string extension)
    {
        string contentType = extension.ToLowerInvariant() switch
        {
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "application/octet-stream",
        };
        return contentType;
    }
}

/// <summary>The body returned when an upload is refused.</summary>
public sealed record MediaError(string Message);

/// <summary>The body returned when an upload succeeds: the stored name the block will hold.</summary>
public sealed record MediaUploadResult(string StoredName);
