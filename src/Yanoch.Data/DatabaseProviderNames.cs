namespace Yanoch.Data;

/// <summary>
/// Names of the database providers Yanoch can run on. SQLite is used for tests and local
/// development, PostgreSQL for production deployment.
/// </summary>
public static class DatabaseProviderNames
{
    public const string Sqlite = "Sqlite";
    public const string Postgres = "Postgres";
}
