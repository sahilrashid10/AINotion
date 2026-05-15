using AINotion.Infrastructure.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AINotion.API.Extensions;

/// <summary>
/// Extension methods for adding infrastructure services to the API service collection.
/// Acts as a bridge between API layer and Infrastructure layer.
/// </summary>
public static class InfrastructureExtensions
{
    /// <summary>
    /// Registers all infrastructure services including DbContext.
    /// </summary>
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        AINotion.Infrastructure.Extensions.ServiceCollectionExtensions.AddInfrastructureServices(
            services,
            configuration);
        return services;
    }
}
