using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Yanoch.Server.Identity;

/// <summary>
/// Hardens the desktop host's loopback port. The host listens on 127.0.0.1, which any local
/// process — and any web page the user visits in their own browser — can reach, so loopback alone
/// is not a boundary. Every launch mints a fresh random token; the native window presents it once
/// on its first navigation and it is exchanged for an HttpOnly launch cookie that admits later
/// requests until a real auth cookie exists.
/// </summary>
/// <remarks>
/// Two things here are load-bearing and were both found by running it, not by reading about it:
/// <list type="bullet">
/// <item>The exchange exists because a query-string token does NOT survive a form POST: the
/// identity pages post to their own path with no query string, so a token that lives only in the
/// query is lost at exactly the moment it is needed.</item>
/// <item>This middleware MUST be registered BEFORE UseAuthentication/UseAuthorization. Placed
/// after them, an unauthenticated request to an [Authorize] page is challenged by the cookie
/// handler first, so the gate never runs and the port is effectively open.</item>
/// </list>
/// </remarks>
public static class LoopbackLaunchGate
{
    public const string LaunchTokenQueryName = "launchToken";
    public const string LaunchCookieName = "Yanoch.Launch";
    public const string LaunchTokenHeaderName = "X-Yanoch-Launch-Token";

    /// <summary>Mints a fresh token for one launch of the host.</summary>
    public static string CreateLaunchToken()
        => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

    /// <summary>
    /// Rejects any request that is neither authenticated, nor carrying the launch token, nor
    /// already holding the launch cookie.
    /// </summary>
    public static void UseLoopbackLaunchGate(this WebApplication application, string launchToken)
    {
        application.Use(async (HttpContext httpContext, RequestDelegate next) =>
        {
            bool isAuthenticated = httpContext.User.Identity?.IsAuthenticated == true;
            bool isTokenPresented = IsLaunchTokenPresented(httpContext, launchToken);
            bool hasLaunchCookie = httpContext.Request.Cookies[LaunchCookieName] == launchToken;

            if (isTokenPresented && !hasLaunchCookie)
            {
                httpContext.Response.Cookies.Append(LaunchCookieName, launchToken, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    IsEssential = true,
                });

                // Strip the token from the address bar. Leaving it there would put it into every
                // relative link the page renders, including the sign-in redirect's returnUrl.
                string redirectTarget = BuildUrlWithoutLaunchToken(httpContext.Request);
                httpContext.Response.StatusCode = StatusCodes.Status302Found;
                httpContext.Response.Headers.Location = redirectTarget;
                return;
            }

            if (!isAuthenticated && !isTokenPresented && !hasLaunchCookie)
            {
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync("Yanoch: launch token required.");
                return;
            }

            await next(httpContext);
        });
    }

    private static bool IsLaunchTokenPresented(HttpContext httpContext, string launchToken)
    {
        StringValues presentedToken = httpContext.Request.Query[LaunchTokenQueryName];
        if (presentedToken.Count == 1 && presentedToken[0] == launchToken)
        {
            return true;
        }

        string? presentedHeader = httpContext.Request.Headers[LaunchTokenHeaderName];
        return presentedHeader == launchToken;
    }

    private static string BuildUrlWithoutLaunchToken(HttpRequest request)
    {
        string path = request.Path.HasValue ? request.Path.Value! : "/";

        List<string> remainingPairs = new List<string>();
        foreach (KeyValuePair<string, StringValues> pair in request.Query)
        {
            if (string.Equals(pair.Key, LaunchTokenQueryName, StringComparison.Ordinal))
            {
                continue;
            }

            foreach (string? value in pair.Value)
            {
                remainingPairs.Add($"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(value ?? string.Empty)}");
            }
        }

        return remainingPairs.Count == 0
            ? path
            : $"{path}?{string.Join('&', remainingPairs)}";
    }
}
