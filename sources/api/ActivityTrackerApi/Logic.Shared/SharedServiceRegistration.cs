using Microsoft.Extensions.DependencyInjection;
using Logic.Shared.Interfaces;
using Logic.Shared.Repositories;

namespace Logic.Shared
{
    public static class SharedServiceRegistration
    {
        public static void RegisterSharedServices(this IServiceCollection services)
        {
            // Register shared services here
            services.AddScoped<IApplicationUnitOfWork, ApplicationUnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IHealthConnectRepository, HealthConnectRepository>();
            services.AddScoped<IUserSecurity, UserSecurity>();
        }
    }
}
