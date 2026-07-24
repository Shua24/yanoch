using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Yanoch.Infrastructure;
using Yanoch.Infrastructure.Data;
using Yanoch.Web.Components;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddControllers();

builder.Services.AddInfrastructure(builder.Configuration);

// Configure HttpClient for API calls
builder.Services.AddScoped(sp => new HttpClient());

builder.Services.AddScoped<Yanoch.Application.Interfaces.IPageService, Yanoch.Application.Services.PageService>();
builder.Services.AddScoped<Yanoch.Application.Interfaces.ITagService, Yanoch.Application.Services.TagService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration failed: {ex.Message}. Ensuring database is created...");
        db.Database.EnsureCreated();
    }
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

app.MapControllers();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
