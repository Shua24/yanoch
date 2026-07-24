using Microsoft.Extensions.DependencyInjection;
using Yanoch.Application.Interfaces;
using Yanoch.Application.Services;

namespace Yanoch.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IPageService, PageService>();
        services.AddScoped<ITagService, TagService>();
        return services;
    }
}
