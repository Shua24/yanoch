using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Server;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Yanoch.Domain;

namespace Yanoch.Server.Identity;

/// <summary>
/// Revalidates the signed-in user's security stamp on a timer, so an account change made while an
/// interactive circuit is connected invalidates that circuit instead of living on until sign-out.
/// </summary>
internal sealed class IdentityRevalidatingAuthenticationStateProvider(
        ILoggerFactory loggerFactory,
        IServiceScopeFactory scopeFactory,
        IOptions<IdentityOptions> options)
    : RevalidatingServerAuthenticationStateProvider(loggerFactory)
{
    protected override TimeSpan RevalidationInterval => TimeSpan.FromMinutes(30);

    protected override async Task<bool> ValidateAuthenticationStateAsync(
        AuthenticationState authenticationState, CancellationToken cancellationToken)
    {
        // A fresh scope is required: the UserManager must not read a stale tracked entity.
        await using AsyncServiceScope scope = scopeFactory.CreateAsyncScope();
        UserManager<ApplicationUser> userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();
        bool isValid = await ValidateSecurityStampAsync(userManager, authenticationState.User);
        return isValid;
    }

    private async Task<bool> ValidateSecurityStampAsync(
        UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
    {
        ApplicationUser? user = await userManager.GetUserAsync(principal);
        if (user is null)
        {
            return false;
        }

        if (!userManager.SupportsUserSecurityStamp)
        {
            return true;
        }

        string? principalStamp = principal.FindFirstValue(
            options.Value.ClaimsIdentity.SecurityStampClaimType);
        string userStamp = await userManager.GetSecurityStampAsync(user);
        bool stampsMatch = principalStamp == userStamp;
        return stampsMatch;
    }
}
