namespace Yanoch.Data;

/// <summary>
/// The database settings read from configuration. <see cref="Provider"/> selects SQLite or
/// PostgreSQL; <see cref="ConnectionString"/> is the provider specific connection string.
/// </summary>
public sealed class DatabaseOptions
{
    public const string SectionName = "Database";

    public string Provider { get; set; } = DatabaseProviderNames.Sqlite;

    public string ConnectionString { get; set; } = "Data Source=yanoch.db";
}
