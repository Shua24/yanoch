namespace Yanoch.Ui.Components.Account;

/// <summary>
/// The route paths and query names the identity flow uses. Kept in one place so the pages, the
/// HTTP endpoints and the redirect helper cannot disagree about them.
/// </summary>
public static class AccountPaths
{
    public const string HomePath = "/";
    public const string LoginPath = "/login";
    public const string RegisterPath = "/register";
    public const string LoginEndpointPath = "/Account/Login";
    public const string LogoutEndpointPath = "/Account/Logout";
    public const string LoginFailedQueryName = "loginFailed";
    public const string ReturnUrlQueryName = "returnUrl";
}
