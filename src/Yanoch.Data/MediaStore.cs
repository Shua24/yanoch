using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;

namespace Yanoch.Data;

/// <summary>
/// Where uploaded image bytes live, and the naming rule for them.
///
/// The directory sits OUTSIDE any web root on purpose. A file under wwwroot is publicly served by
/// definition, and this app requires a signed-in user to read an image, so the bytes cannot live
/// there. The desktop host has a second reason: its content root is the build output folder
/// (bin/Debug/net10.0), so uploads written there would be destroyed by the next clean.
///
/// Every stored name is generated here, never taken from the client. A caller-supplied file name is
/// untrusted input that can carry a path separator, a traversal sequence, or a second extension, so
/// it is discarded entirely rather than sanitised.
/// </summary>
public static class MediaStore
{
    /// <summary>The configuration section that may override the media directory.</summary>
    public const string SectionName = MediaOptions.SectionName;

    /// <summary>
    /// The generated name's shape: 32 lowercase hex characters, a dot, then a lowercase extension.
    /// The uploader is the only thing that writes names in this shape, which is what lets the
    /// cleanup sweep delete generated files while leaving a hand-placed file alone.
    /// </summary>
    public const string StoredNamePattern = "^[0-9a-f]{32}\\.[a-z0-9]{2,5}$";

    /// <summary>
    /// Resolves the directory uploads are written to. A configured value wins; otherwise the
    /// per-user data directory is used so the location is stable across hosts and rebuilds.
    /// </summary>
    public static string ReadMediaDirectory(IConfiguration configuration)
    {
        MediaOptions options = new MediaOptions();
        configuration.GetSection(SectionName).Bind(options);

        if (!string.IsNullOrWhiteSpace(options.Directory))
        {
            string configuredDirectory = Path.GetFullPath(options.Directory);
            return configuredDirectory;
        }

        string userDataDirectory = Environment.GetFolderPath(
            Environment.SpecialFolder.ApplicationData,
            Environment.SpecialFolderOption.Create);
        string defaultDirectory = Path.Combine(userDataDirectory, "Yanoch", "media");
        return defaultDirectory;
    }

    /// <summary>
    /// Creates the media directory when it does not exist yet. Called on startup so a fresh install
    /// has somewhere to write, and so a misconfigured path fails loudly at boot rather than at the
    /// first upload.
    /// </summary>
    public static void EnsureMediaDirectory(string mediaDirectory)
    {
        Directory.CreateDirectory(mediaDirectory);
    }

    /// <summary>
    /// Builds a fresh stored name for an upload: 32 hex characters from a cryptographic source,
    /// plus the validated extension.
    /// </summary>
    public static string CreateStoredName(string extension)
    {
        byte[] randomBytes = RandomNumberGenerator.GetBytes(16);
        string token = Convert.ToHexString(randomBytes).ToLowerInvariant();
        string storedName = $"{token}.{extension}";
        return storedName;
    }

    /// <summary>
    /// True when the name matches the generated shape. The serving endpoint and the cleanup sweep
    /// both gate on this, so a name that could traverse the filesystem is refused before it reaches
    /// the disk.
    /// </summary>
    public static bool IsStoredName(string? storedName)
    {
        if (string.IsNullOrEmpty(storedName))
        {
            return false;
        }
        bool matches = System.Text.RegularExpressions.Regex.IsMatch(storedName, StoredNamePattern);
        return matches;
    }
}
