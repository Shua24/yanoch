using Yanoch.Server;

// Thin browser harness. It exists so the app can be driven in a normal browser during development;
// the desktop app is the deliverable. Both hosts share ONE composition (Yanoch.Server) so they
// cannot drift apart.
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddYanochServer(builder.Configuration);

WebApplication application = builder.Build();

application.UseYanochServer(loopbackLaunchToken: null);

await application.InitialiseYanochDatabaseAsync();

application.Run();
