using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Hosting.StaticWebAssets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Photino.NET;
using Yanoch.Server;
using Yanoch.Server.Identity;

// Yanoch desktop host. It runs a REAL in-process HTTP server on loopback and points a plain
// Photino window at it.
//
// Why not Photino.Blazor: that serves the UI over a custom "app://" scheme with no HTTP pipeline,
// and on Linux that scheme cannot be intercepted as http. ASP.NET Core Identity's cookie flow needs
// a real request, so no cookie could ever be written and auth could never work. A loopback Kestrel
// gives the desktop app the same transport the browser harness uses, so the two cannot drift.
//
// The loopback port is reachable by any local process and by any page in the user's own browser,
// so it is hardened: an ephemeral port, plus a per-launch random token that the window presents
// once and which is exchanged for an HttpOnly launch cookie.

// Wayland: WebKitGTK aborts with "Error 71 (Protocol error) dispatching to Wayland display" and
// the window never paints, so the app shows nothing. This is why the X11 backend is forced here.
//
// Both of the fixes below have to be in the REAL environment of the process that initialises GTK
// and WebKit, so they are applied by re-exec'ing the app rather than with
// Environment.SetEnvironmentVariable. GTK caches the backend it chose during gtk_init, which
// happens inside the native Photino library, and it decides that choice from the environment as
// the process started; setting the variable from managed code is visible to libc getenv() but has
// no effect on GTK (verified: the variable reads back "x11" in-process and the app still dies with
// Error 71). The same is true of the WebKit renderer choice (verified: setting
// WEBKIT_DISABLE_DMABUF_RENDERER in-process leaves the content area blank, while putting it in the
// real environment makes the page paint). Re-exec'ing is the only thing that works for either.
// A native X11 session, and any run where the caller already set these, is left alone.

bool needsX11Backend = OperatingSystem.IsLinux()
    && Environment.GetEnvironmentVariable("YANOCH_ALLOW_WAYLAND") != "1"
    && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GDK_BACKEND"));

// NVIDIA + WebKitGTK 2.54: the DMABUF renderer negotiates a GPU buffer the GTK surface never
// composites, so the window maps and the Blazor UI is fully live over IPC, but the content area
// paints a single flat colour (measured: 2 unique colours, the GTK theme background) and no page
// pixel ever reaches the screen. Disabling the DMABUF renderer falls WebKit back to a shared
// memory path that composites correctly (measured: 97.7% of the content area is the page's own
// #191919 background with #E6E6E6 text glyphs present). WEBKIT_DISABLE_COMPOSITING_MODE=1 is NOT
// a substitute - measured blank as well - so it must not be used here.
bool needsDmabufRendererDisabled = OperatingSystem.IsLinux()
    && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBKIT_DISABLE_DMABUF_RENDERER"));

if (OperatingSystem.IsLinux()
    && Environment.GetEnvironmentVariable("YANOCH_RELAUNCHED_FOR_DESKTOP_FIXES") != "1"
    && (needsX11Backend || needsDmabufRendererDisabled))
{
    if (needsX11Backend)
    {
        Environment.SetEnvironmentVariable("GDK_BACKEND", "x11");
    }

    if (needsDmabufRendererDisabled)
    {
        Environment.SetEnvironmentVariable("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    Environment.SetEnvironmentVariable("YANOCH_RELAUNCHED_FOR_DESKTOP_FIXES", "1");
    string executablePath = Environment.ProcessPath ?? Environment.GetCommandLineArgs()[0];
    using System.Diagnostics.Process relaunched = System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
    {
        FileName = executablePath,
        Arguments = string.Join(' ', Environment.GetCommandLineArgs().Skip(1).Select(QuoteArgument)),
        UseShellExecute = false,
    })!;
    relaunched.WaitForExit();
    Environment.Exit(relaunched.ExitCode);
}

static string QuoteArgument(string argument)
{
    return argument.Contains(' ') ? "\"" + argument + "\"" : argument;
}

IConfigurationRoot configuration = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: true)
    // Without this, an environment override (such as Database__ConnectionString) is ignored.
    .AddEnvironmentVariables()
    .Build();

int loopbackPort = LoopbackPort.Reserve();
string launchToken = LoopbackLaunchGate.CreateLaunchToken();

WebApplicationBuilder builder = WebApplication.CreateSlimBuilder(args);

builder.WebHost.UseUrls($"http://127.0.0.1:{loopbackPort}");

// The desktop host runs as Production, where static web assets are NOT wired automatically, so
// every asset would otherwise be served as 200 with zero bytes: an unstyled page and an empty
// blazor.web.js, meaning nothing is interactive.
StaticWebAssetsLoader.UseStaticWebAssets(builder.Environment, builder.Configuration);

builder.Services.AddYanochServer(configuration);

WebApplication serverApplication = builder.Build();

serverApplication.UseYanochServer(launchToken);

await serverApplication.InitialiseYanochDatabaseAsync();

// StartAsync, NOT Run(): the native window owns the main thread.
await serverApplication.StartAsync();

string startUrl = $"http://127.0.0.1:{loopbackPort}/?{LoopbackLaunchGate.LaunchTokenQueryName}={launchToken}";

PhotinoWindow window = new PhotinoWindow()
    .SetTitle("Yanoch")
    .SetSize(1200, 820)
    .Center();

window.Load(new Uri(startUrl));
window.WaitForClose();

await serverApplication.StopAsync();
