using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Yanoch.Data;

/// <summary>
/// Registers the Yanoch database context with the provider named in configuration. The same
/// code path is used for every host, so SQLite in tests and PostgreSQL in production differ
/// only by the <c>Database</c> section of configuration.
/// </summary>
public static class DatabaseRegistration
{
    public static IServiceCollection AddYanochDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        DatabaseOptions options = new DatabaseOptions();
        configuration.GetSection(DatabaseOptions.SectionName).Bind(options);
        return services.AddYanochDatabase(options);
    }

    public static IServiceCollection AddYanochDatabase(this IServiceCollection services, DatabaseOptions options)
    {
        services.AddDbContext<YanochDbContext>(dbContextOptions =>
        {
            ConfigureProvider(dbContextOptions, options);
        });
        return services;
    }

    private static void ConfigureProvider(DbContextOptionsBuilder dbContextOptions, DatabaseOptions options)
    {
        if (string.Equals(options.Provider, DatabaseProviderNames.Postgres, StringComparison.OrdinalIgnoreCase))
        {
            dbContextOptions.UseNpgsql(options.ConnectionString);
            return;
        }
        dbContextOptions.UseSqlite(options.ConnectionString);
    }
}
