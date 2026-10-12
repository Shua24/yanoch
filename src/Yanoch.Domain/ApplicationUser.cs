using Microsoft.AspNetCore.Identity;

namespace Yanoch.Domain;

/// <summary>
/// A Yanoch account. ASP.NET Core Identity owns the credentials and every identity column
/// (user name, email, password hash, security stamp); Yanoch adds only the label the UI shows.
/// Accounts live in the same database file as the workspace.
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>Short label shown in the UI, e.g. "aulus" or "Aulus Dev".</summary>
    public string DisplayName { get; set; } = string.Empty;
}
