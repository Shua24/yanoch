using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Yanoch.Data.Repositories;

namespace Yanoch.Data;

/// <summary>
/// Deletes uploaded image files that nothing references any more.
///
/// An image block can be deleted at any time, which leaves its file behind with nothing pointing at
/// it. This sweeps those orphans on page load, after a grace period, so a file is not removed while
/// an undo could still bring the block back.
///
/// Two rules keep the sweep from eating data it should not touch:
///
///   1. Only files matching the GENERATED name shape are candidates. A file somebody placed in the
///      media directory by hand is never deleted, however old it is.
///   2. The reference check spans EVERY page, not just the one being loaded. A sweep scoped to the
///      loaded page would delete the images belonging to every other page.
///
/// The grace period is measured from the file's last write time, which is its upload time. A file
/// orphaned for longer than the grace period is therefore collected on the next page load rather
/// than exactly one grace period after it was orphaned. That is deliberate: the alternative needs a
/// record of when each file became unreferenced, which is state this app does not keep.
/// </summary>
public sealed class MediaCleanupService
{
    /// <summary>
    /// How long an unreferenced file is kept. Long enough for an undo or a reload to still find the
    /// bytes, short enough that a deleted image does not linger.
    /// </summary>
    public static readonly TimeSpan GracePeriod = TimeSpan.FromMinutes(5);

    private readonly PageRepository repository;
    private readonly IConfiguration configuration;
    private readonly ILogger<MediaCleanupService> logger;

    public MediaCleanupService(
        PageRepository repository,
        IConfiguration configuration,
        ILogger<MediaCleanupService> logger)
    {
        this.repository = repository;
        this.configuration = configuration;
        this.logger = logger;
    }

    /// <summary>
    /// Removes every unreferenced, past-grace-period file from the media directory. Returns the
    /// names it deleted, which is what makes the behaviour testable.
    /// </summary>
    public async Task<List<string>> SweepUnreferencedFilesAsync()
    {
        string mediaDirectory = MediaStore.ReadMediaDirectory(configuration);
        if (!Directory.Exists(mediaDirectory))
        {
            return new List<string>();
        }

        HashSet<string> referencedNames = await repository.ReadReferencedMediaNamesAsync();
        DateTime cutoffUtc = DateTime.UtcNow - GracePeriod;
        List<string> deletedNames = new List<string>();

        foreach (string filePath in Directory.EnumerateFiles(mediaDirectory))
        {
            string fileName = Path.GetFileName(filePath);

            // Rule 1: a hand-placed file is never a candidate.
            if (!MediaStore.IsStoredName(fileName))
            {
                continue;
            }

            // The grace period: a recently written file may belong to a block that is about to come
            // back, so it is left alone.
            DateTime lastWriteUtc = File.GetLastWriteTimeUtc(filePath);
            if (lastWriteUtc > cutoffUtc)
            {
                continue;
            }

            // Rule 2: referenced anywhere means it stays.
            if (referencedNames.Contains(fileName))
            {
                continue;
            }

            try
            {
                File.Delete(filePath);
                deletedNames.Add(fileName);
            }
            catch (IOException exception)
            {
                // A file that cannot be deleted right now is simply left for the next sweep. Failing
                // the page load over it would be worse than a file that lingers one more cycle.
                logger.LogWarning(exception, "Could not delete unreferenced media file {FileName}.", fileName);
            }
        }

        return deletedNames;
    }
}
