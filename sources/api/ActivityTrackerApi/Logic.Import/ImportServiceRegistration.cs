using Logic.Import.HealthConnect;
using Microsoft.Extensions.DependencyInjection;
using Shared.Interfaces;

namespace Logic.Import
{
    public static class ImportServiceRegistration
    {
        public static void RegisterImportServices(IServiceCollection services)
        {
            services.AddScoped<IHealthConnectModule, HealthConnectModule>();
        }
    }
}
