namespace Yanoch.Ui.Components.Account;

/// <summary>
/// Navigation helpers for the identity pages. A redirect target that arrives from the browser is
/// never trusted directly: anything absolute or protocol-relative collapses to the home page, so
/// the sign-in form cannot be used to bounce a user off-origin.
/// </summary>
public static class AccountNavigation
{
    /// <summary>Returns the return URL when it is a safe relative path, otherwise the home page.</summary>
    public static string ReadSafeReturnUrl(string? returnUrl)
    {
        if (string.IsNullOrWhiteSpace(returnUrl))
        {
            return AccountPaths.HomePath;
        }

        if (!Uri.IsWellFormedUriString(returnUrl, UriKind.Relative))
        {
            return AccountPaths.HomePath;
        }

        if (returnUrl.StartsWith("//", StringComparison.Ordinal))
        {
            return AccountPaths.HomePath;
        }

        return returnUrl;
    }

    /// <summary>Builds the sign-in URL that carries the page to return to and the failure flag.</summary>
    public static string BuildLoginUrl(string? returnUrl, bool loginFailed)
    {
        string safeReturnUrl = ReadSafeReturnUrl(returnUrl);
        string encodedReturnUrl = Uri.EscapeDataString(safeReturnUrl);
        string url = $"{AccountPaths.LoginPath}?{AccountPaths.ReturnUrlQueryName}={encodedReturnUrl}";

        if (loginFailed)
        {
            // "true", not "1": [SupplyParameterFromQuery] binds a bool and cannot parse "1".
            url += $"&{AccountPaths.LoginFailedQueryName}=true";
        }

        return url;
    }

    /// <summary>Builds the registration URL that carries the page to return to after signing up.</summary>
    public static string BuildRegisterUrl(string? returnUrl)
    {
        string safeReturnUrl = ReadSafeReturnUrl(returnUrl);
        string encodedReturnUrl = Uri.EscapeDataString(safeReturnUrl);
        return $"{AccountPaths.RegisterPath}?{AccountPaths.ReturnUrlQueryName}={encodedReturnUrl}";
    }
}
