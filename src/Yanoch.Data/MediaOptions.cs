using Microsoft.Extensions.Configuration;

namespace Yanoch.Data;

/// <summary>
/// The media settings read from configuration. <see cref="Directory"/> is where uploaded image
/// bytes are written; when it is empty the store falls back to a per-user data directory.
/// </summary>
public sealed class MediaOptions
{
    public const string SectionName = "Media";

    /// <summary>
    /// The directory uploaded images are written to. Empty means "use the per-user default", which
    /// <see cref="MediaStore.ReadMediaDirectory"/> resolves.
    /// </summary>
    public string Directory { get; set; } = string.Empty;
}
