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
        // ONE MIGRATION SET CANNOT SERVE BOTH PROVIDERS, AND AN --output-dir SPLIT DOES NOT SEPARATE
        // THEM. A SQLite-generated migration bakes the store type TEXT into Identity's passkey JSON
        // column, and applying it against Postgres fails with "The store type 'TEXT' specified for
        // JSON column 'Data' ... is not supported by the current provider" (Postgres needs jsonb).
        // EF also discovers EVERY migration in the assembly it scans, so two output folders inside
        // one assembly are still ONE migration set. The two sets therefore live in SEPARATE
        // ASSEMBLIES, and each provider names the one it may use.
        if (string.Equals(options.Provider, DatabaseProviderNames.Postgres, StringComparison.OrdinalIgnoreCase))
        {
            dbContextOptions.UseNpgsql(
                options.ConnectionString,
                npgsqlOptions => npgsqlOptions.MigrationsAssembly(PostgresMigrationsAssembly));
            return;
        }
        dbContextOptions.UseSqlite(
            options.ConnectionString,
            sqliteOptions => sqliteOptions.MigrationsAssembly(SqliteMigrationsAssembly));
    }

    /// <summary>
    /// The assembly holding the SQLite migration set. Written once because the assembly NAME is what
    /// EF matches, and a typo here would surface only at startup.
    /// </summary>
    private const string SqliteMigrationsAssembly = "Yanoch.Data.Migrations.Sqlite";

    /// <summary>
    /// The assembly holding the Postgres migration set.
    /// </summary>
    private const string PostgresMigrationsAssembly = "Yanoch.Data.Migrations.Postgres";
}
