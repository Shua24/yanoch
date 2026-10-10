using Yanoch.Data;
using Yanoch.Data.Repositories;
using Yanoch.Web.Components;
using Yanoch.Ui.Interop;
using Yanoch.Ui.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddYanochDatabase(builder.Configuration);
builder.Services.AddScoped<PageRepository>();
builder.Services.AddScoped<BlockEditorInterop>();
builder.Services.AddScoped<FileInterop>();
builder.Services.AddScoped<ThemeService>();

var app = builder.Build();

// Create the database schema on startup so a fresh checkout runs with no manual migration step.
using (IServiceScope startupScope = app.Services.CreateScope())
{
    YanochDbContext databaseContext = startupScope.ServiceProvider.GetRequiredService<YanochDbContext>();
    databaseContext.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddAdditionalAssemblies(typeof(Yanoch.Ui.Components.Routes).Assembly)
    .AddInteractiveServerRenderMode();

app.Run();
