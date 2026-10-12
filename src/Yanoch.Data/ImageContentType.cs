namespace Yanoch.Data;

/// <summary>
/// Identifies an image by its MAGIC BYTES rather than by its name or by the Content-Type the
/// client claimed. A client-supplied type is not evidence: a text file renamed to .png, or a
/// request that simply lies in its Content-Type header, would otherwise be stored and later served
/// back with an image type.
///
/// SVG is deliberately absent. An SVG is not just a picture: served from this app's own origin it
/// can execute script with the session cookie in scope, so it is refused rather than stored.
/// </summary>
public static class ImageContentType
{
    /// <summary>The largest number of leading bytes any check below needs.</summary>
    private const int HeaderLength = 12;

    /// <summary>
    /// Reads the leading bytes of a stream and returns the matching image content type and
    /// extension, or null when the bytes are not a supported image.
    /// </summary>
    public static (string ContentType, string Extension)? ReadSupportedType(Stream content)
    {
        if (!content.CanSeek)
        {
            return null;
        }

        long originalPosition = content.Position;
        byte[] header = new byte[HeaderLength];
        int bytesRead = content.Read(header, 0, HeaderLength);
        content.Position = originalPosition;

        if (bytesRead < 4)
        {
            return null;
        }

        if (StartsWithPng(header))
        {
            return ("image/png", "png");
        }
        if (StartsWithJpeg(header))
        {
            return ("image/jpeg", "jpg");
        }
        if (StartsWithGif(header))
        {
            return ("image/gif", "gif");
        }
        if (StartsWithWebp(header))
        {
            return ("image/webp", "webp");
        }
        return null;
    }

    private static bool StartsWithPng(byte[] header)
    {
        // 89 50 4E 47 0D 0A 1A 0A
        bool matches = header[0] == 0x89
            && header[1] == 0x50
            && header[2] == 0x4E
            && header[3] == 0x47
            && header[4] == 0x0D
            && header[5] == 0x0A
            && header[6] == 0x1A
            && header[7] == 0x0A;
        return matches;
    }

    private static bool StartsWithJpeg(byte[] header)
    {
        // FF D8 FF
        bool matches = header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
        return matches;
    }

    private static bool StartsWithGif(byte[] header)
    {
        // "GIF87a" or "GIF89a"
        bool matches = header[0] == 0x47
            && header[1] == 0x49
            && header[2] == 0x46
            && header[3] == 0x38
            && (header[4] == 0x37 || header[4] == 0x39)
            && header[5] == 0x61;
        return matches;
    }

    private static bool StartsWithWebp(byte[] header)
    {
        // "RIFF" .... "WEBP"
        bool isRiff = header[0] == 0x52
            && header[1] == 0x49
            && header[2] == 0x46
            && header[3] == 0x46;
        bool isWebp = header[8] == 0x57
            && header[9] == 0x45
            && header[10] == 0x42
            && header[11] == 0x50;
        bool matches = isRiff && isWebp;
        return matches;
    }
}
