namespace Yanoch.Ui.Components.Account;

/// <summary>
/// The login form's POST body. ASP.NET Core Identity signs the user in from an HTTP endpoint, not
/// from a Blazor event handler: <c>HttpContext</c> is null inside an interactive circuit, so the
/// authentication cookie cannot be written from a component.
/// </summary>
public sealed class LoginRequest
{
    public string? Email { get; set; }

    public string? Password { get; set; }

    public bool RememberMe { get; set; }

    public string? ReturnUrl { get; set; }
}
