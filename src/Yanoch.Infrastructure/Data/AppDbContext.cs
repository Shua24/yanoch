using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Yanoch.Domain.Models;

namespace Yanoch.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Page> Pages => Set<Page>();
    public DbSet<Block> Blocks => Set<Block>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<PageTag> PageTags => Set<PageTag>();
    public DbSet<PageVersion> PageVersions => Set<PageVersion>();
    public DbSet<Backlink> Backlinks => Set<Backlink>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Page>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.Icon).HasMaxLength(50);
            e.Property(x => x.CoverUrl).HasMaxLength(1000);
            e.Property(x => x.Content).HasColumnType("TEXT");
            e.HasOne(x => x.ParentPage).WithMany(x => x.Children).HasForeignKey(x => x.ParentPageId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.UserId);
            e.HasIndex(x => x.ParentPageId);
            e.HasQueryFilter(x => !x.IsDeleted);
        });

        builder.Entity<Block>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Type).HasMaxLength(50);
            e.Property(x => x.Metadata).HasColumnType("jsonb");
            e.HasOne(x => x.Page).WithMany(x => x.Blocks).HasForeignKey(x => x.PageId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.ParentBlock).WithMany(x => x.Children).HasForeignKey(x => x.ParentBlockId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.PageId);
            e.HasIndex(x => x.ParentBlockId);
            e.HasQueryFilter(x => !x.IsDeleted);
        });

        builder.Entity<Tag>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Color).HasMaxLength(20);
            e.HasIndex(x => new { x.UserId, x.Name }).IsUnique();
        });

        builder.Entity<PageTag>(e =>
        {
            e.HasKey(x => new { x.PageId, x.TagId });
            e.HasOne(x => x.Page).WithMany(x => x.PageTags).HasForeignKey(x => x.PageId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Tag).WithMany(x => x.PageTags).HasForeignKey(x => x.TagId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<PageVersion>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.BlocksJson).HasColumnType("jsonb");
            e.HasOne(x => x.Page).WithMany(x => x.Versions).HasForeignKey(x => x.PageId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => x.PageId);
        });

        builder.Entity<Backlink>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.SourcePage).WithMany(x => x.References).HasForeignKey(x => x.SourcePageId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.TargetPage).WithMany(x => x.Backlinks).HasForeignKey(x => x.TargetPageId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(x => x.TargetPageId);
            e.HasIndex(x => x.SourcePageId);
        });
    }
}
