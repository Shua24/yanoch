using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Yanoch.Domain;
using Yanoch.Ui.Components.Account;
// Microsoft.AspNetCore.Mvc also declares a SignInResult; the identity one is the one used here.
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Yanoch.Server.Identity;

/// <summary>
/// The HTTP endpoints Identity needs. Sign-in and sign-out MUST run on a real HTTP request: inside
/// an interactive Blazor circuit <c>HttpContext</c> is null, so an <c>@onclick</c> handler can
/// never write or clear the authentication cookie.
/// </summary>
public static class ApplicationEndpoints
{
    public static IEndpointRouteBuilder MapYanochApplicationEndpoints(this IEndpointRouteBuilder endpoints)
    {
        RouteGroupBuilder accountGroup = endpoints.MapGroup("/Account");

        accountGroup.MapPost("/Login", async (
            [FromServices] SignInManager<ApplicationUser> signInManager,
            [FromForm] LoginRequest request) =>
        {
            string returnUrl = AccountNavigation.ReadSafeReturnUrl(request.ReturnUrl);

            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return TypedResults.LocalRedirect(BuildLoginTarget(returnUrl, loginFailed: true));
            }

            // lockoutOnFailure stays false: a wrong password on a local account must not lock the
            // account out, and there is no mail path to unlock it.
            SignInResult result = await signInManager.PasswordSignInAsync(
                request.Email, request.Password, request.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return TypedResults.LocalRedirect(BuildLocalTarget(returnUrl));
            }

            return TypedResults.LocalRedirect(BuildLoginTarget(returnUrl, loginFailed: true));
        });

        accountGroup.MapPost("/Logout", async (
            [FromServices] SignInManager<ApplicationUser> signInManager,
            [FromForm] string? returnUrl) =>
        {
            await signInManager.SignOutAsync();
            string returnUrlAfterSignOut = AccountNavigation.ReadSafeReturnUrl(returnUrl);
            return TypedResults.LocalRedirect(BuildLocalTarget(returnUrlAfterSignOut));
        });

        return endpoints;
    }

    private static string BuildLocalTarget(string returnUrl)
    {
        string trimmedTarget = returnUrl.TrimStart('/');
        return trimmedTarget.Length == 0 ? "~/" : $"~/{trimmedTarget}";
    }

    private static string BuildLoginTarget(string returnUrl, bool loginFailed)
    {
        string loginUrl = AccountNavigation.BuildLoginUrl(returnUrl, loginFailed);
        return BuildLocalTarget(loginUrl);
    }
}
