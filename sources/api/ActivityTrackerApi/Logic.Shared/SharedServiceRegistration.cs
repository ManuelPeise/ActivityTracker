using Microsoft.Extensions.DependencyInjection;
using Logic.Shared.Interfaces;

namespace Logic.Shared
{
    public static class SharedServiceRegistration
    {
        public static void RegisterSharedServices(this IServiceCollection services)
        {
            // Register shared services here
            services.AddScoped<IApplicationUnitOfWork, ApplicationUnitOfWork>();
        }
    }
}
