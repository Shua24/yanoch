using System.IO;

namespace Yanoch.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveAsync(Stream fileStream, string fileName);
    Task DeleteAsync(string fileUrl);
}