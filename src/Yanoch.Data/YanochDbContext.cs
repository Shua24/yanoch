using Microsoft.EntityFrameworkCore;
using Yanoch.Domain;

namespace Yanoch.Data;

/// <summary>
/// The Entity Framework Core context for the Yanoch workspace. It is provider agnostic: the
/// concrete database (SQLite for tests, PostgreSQL for production) is chosen by the host when
/// the options are built, so nothing here references a specific provider.
/// </summary>
public sealed class YanochDbContext : DbContext
{
    public YanochDbContext(DbContextOptions<YanochDbContext> options)
        : base(options)
    {
    }

    public DbSet<Page> Pages => Set<Page>();

    public DbSet<Block> Blocks => Set<Block>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Page>(pageEntity =>
        {
            pageEntity.HasKey(page => page.Id);
            pageEntity.Property(page => page.Title).IsRequired().HasMaxLength(512);
            pageEntity.Property(page => page.Icon).HasMaxLength(64);
            pageEntity.HasMany(page => page.Blocks)
                .WithOne(block => block.Page)
                .HasForeignKey(block => block.PageId)
                .OnDelete(DeleteBehavior.Cascade);
            pageEntity.HasIndex(page => page.UpdatedAtUtc);
        });

        modelBuilder.Entity<Block>(blockEntity =>
        {
            blockEntity.HasKey(block => block.Id);
            blockEntity.Property(block => block.ContentJson).IsRequired();
            blockEntity.Property(block => block.BlockType).HasConversion<int>();
            blockEntity.Property(block => block.Language).HasMaxLength(64);
            blockEntity.HasIndex(block => new { block.PageId, block.SortOrder });

            // Self reference: a block may live inside a container block. Deleting a container
            // deletes its children, which is what keeps a column list from leaving orphans.
            blockEntity.HasOne(block => block.Parent)
                .WithMany(parent => parent.Children)
                .HasForeignKey(block => block.ParentBlockId)
                .OnDelete(DeleteBehavior.Cascade);
            blockEntity.HasIndex(block => new { block.ParentBlockId, block.SortOrder });
        });
    }
}
