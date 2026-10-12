using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Yanoch.Data;
using Yanoch.Data.Repositories;
using Yanoch.Domain;
using Yanoch.Server.Components;
using Yanoch.Server.Identity;
using Yanoch.Ui.Components.Account;
using Yanoch.Ui.Interop;
using Yanoch.Ui.Services;

namespace Yanoch.Server;

/// <summary>
/// The ONE composition shared by every Yanoch host. Both the desktop app and the web harness call
/// <see cref="AddYanochServer"/> and <see cref="UseYanochServer"/>, so the two hosts cannot drift:
/// a change to services or pipeline order lands in both or in neither.
/// </summary>
public static class YanochServerComposition
{
    public static IServiceCollection AddYanochServer(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddRazorComponents()
            .AddInteractiveServerComponents();

        services.AddCascadingAuthenticationState();
        services.AddScoped<AuthenticationStateProvider, IdentityRevalidatingAuthenticationStateProvider>();

        services.AddAuthentication(options =>
            {
                options.DefaultScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
            })
            .AddIdentityCookies();

        services.ConfigureApplicationCookie(options =>
        {
            // The sign-in PAGE is /login. Without this the cookie handler challenges to its
            // default /Account/Login, which has no page, so an unauthenticated request would
            // dead-end instead of reaching the form.
            options.LoginPath = AccountPaths.LoginPath;
            options.LogoutPath = AccountPaths.LogoutEndpointPath;
            options.AccessDeniedPath = AccountPaths.LoginPath;
            options.Cookie.Name = "Yanoch.Auth";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Strict;
            // Persistent: a local notes app should not sign the user out on every restart, and the
            // database sits in the same home directory the cookie does.
            options.ExpireTimeSpan = TimeSpan.FromDays(30);
            options.SlidingExpiration = true;
        });

        services.AddYanochDatabase(configuration);

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            // No mail server exists in a local desktop app, so an unconfirmed account would be a
            // dead end. The password policy is Identity's default with the length raised to match
            // the registration form.
            options.SignIn.RequireConfirmedAccount = false;
            options.Password.RequiredLength = 8;
            options.Stores.SchemaVersion = IdentitySchemaVersions.Version3;
        })
        .AddEntityFrameworkStores<YanochDbContext>()
        .AddSignInManager()
        .AddDefaultTokenProviders();

        services.AddAuthorization();

        services.AddScoped<PageRepository>();
        services.AddScoped<BlockEditorInterop>();
        services.AddScoped<FileInterop>();
        services.AddScoped<ThemeService>();
        services.AddScoped<MediaCleanupService>();

        return services;
    }

    /// <summary>
    /// Raises Kestrel's request-body limit so the application's own upload cap is the one that
    /// applies. Kestrel defaults to 30,000,000 bytes, which is BELOW the 50 MB the app accepts: a
    /// file between the two would be refused by the server with a bare 413 before the upload
    /// endpoint ever ran, so the user would get no explanation.
    /// </summary>
    public static WebApplicationBuilder ConfigureYanochUploadLimits(this WebApplicationBuilder builder)
    {
        // Comfortably above MediaEndpoints.MaximumUploadBytes, leaving room for the multipart
        // envelope around the file.
        const long kestrelRequestBodyLimit = 55L * 1024 * 1024;

        builder.WebHost.ConfigureKestrel(kestrelOptions =>
        {
            kestrelOptions.Limits.MaxRequestBodySize = kestrelRequestBodyLimit;
        });

        // The multipart parser has its own ceiling, separate from Kestrel's. Its default (128 MB)
        // is already above the app cap, but it is pinned here so the relationship between the three
        // limits is explicit rather than implied by a framework default.
        builder.Services.Configure<FormOptions>(formOptions =>
        {
            formOptions.MultipartBodyLengthLimit = kestrelRequestBodyLimit;
        });

        return builder;
    }

    /// <summary>
    /// Applies the HTTP pipeline. <paramref name="loopbackLaunchToken"/> is non-null only for the
    /// desktop host, whose loopback port must not be reachable by other local processes or by a
    /// page in the user's own browser.
    /// </summary>
    public static WebApplication UseYanochServer(this WebApplication application, string? loopbackLaunchToken)
    {
        if (!application.Environment.IsDevelopment())
        {
            application.UseExceptionHandler("/Error", createScopeForErrors: true);
            application.UseHsts();
        }

        application.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);

        // The desktop host serves plain HTTP on loopback, so there is nothing to redirect to.
        if (loopbackLaunchToken is null)
        {
            application.UseHttpsRedirection();
        }

        // BEFORE the auth middleware. Placed after it, an unauthenticated request to an
        // [Authorize] page is challenged by the cookie handler first and the gate never runs,
        // which leaves the loopback port open to any local process or browser page.
        if (loopbackLaunchToken is not null)
        {
            application.UseLoopbackLaunchGate(loopbackLaunchToken);
        }

        // Written EXPLICITLY. WebApplication inserts UseAuthentication/UseAuthorization
        // implicitly ahead of user middleware when auth services are registered, which would put
        // them before the gate above and undo it. Calling them here pins the order.
        application.UseAuthentication();
        application.UseAuthorization();

        application.UseAntiforgery();

        application.MapStaticAssets();

        application.MapRazorComponents<App>()
            .AddAdditionalAssemblies(typeof(Yanoch.Ui.Components.Routes).Assembly)
            .AddInteractiveServerRenderMode();

        application.MapYanochApplicationEndpoints();

        // Chained at the same call site as the endpoints above, so BOTH hosts get the media routes.
        application.MapYanochMediaEndpoints();

        return application;
    }

    /// <summary>
    /// Creates the schema on startup so a fresh checkout runs with no manual migration step.
    /// </summary>
    public static async Task InitialiseYanochDatabaseAsync(this WebApplication application)
    {
        await using AsyncServiceScope startupScope = application.Services.CreateAsyncScope();
        YanochDbContext databaseContext = startupScope.ServiceProvider
            .GetRequiredService<YanochDbContext>();
        await databaseContext.Database.EnsureCreatedAsync();
    }
}
