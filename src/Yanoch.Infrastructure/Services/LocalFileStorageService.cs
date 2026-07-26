using System.IO;
using Microsoft.AspNetCore.Hosting;
using Yanoch.Application.Interfaces;

namespace Yanoch.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly string[] _allowedExtensions = { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg" };
    private readonly long _maxFileSize = 10 * 1024 * 1024; // 10MB

    public LocalFileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveAsync(Stream fileStream, string fileName)
    {
        // Validate file extension
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            throw new ArgumentException("Unsupported file type. Allowed: png, jpg, jpeg, gif, webp, svg");
        }

        // Validate file size
        if (fileStream.Length > _maxFileSize)
        {
            throw new ArgumentException("File size exceeds 10MB limit");
        }

        // Create uploads directory if it doesn't exist
        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        // Generate unique filename to prevent conflicts
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, uniqueFileName);

        // Save the file
        using (var file = File.Create(filePath))
        {
            await fileStream.CopyToAsync(file);
        }

        // Return the URL
        return $"/uploads/{uniqueFileName}";
    }

    public async Task DeleteAsync(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl))
        {
            return;
        }

        // Extract filename from URL
        var fileName = Path.GetFileName(fileUrl);
        if (string.IsNullOrEmpty(fileName))
        {
            return;
        }

        var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}