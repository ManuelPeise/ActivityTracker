using Data.Db;
using Logic.Shared;
using Microsoft.EntityFrameworkCore;

namespace Core.Api.Bundels
{
    internal static class ServiceConfiguration
    {
        internal static void ConfigureServices(WebApplicationBuilder builder, string corsPolicyName)
        {
            var connectionString = builder.Configuration.GetConnectionString("ActivityTrackerDb") 
                ?? throw new InvalidOperationException("Connection string 'ActivityTrackerDb' not found.");

            builder.Services.AddDbContext<AppDbContext>(options => options.UseMySQL(connectionString));
            builder.Services.AddLogging(options =>
            {
                options.AddConsole();
                options.AddDebug();
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: corsPolicyName,
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });

            SharedServiceRegistration.RegisterSharedServices(builder.Services);

            builder.Services.AddControllers();
        }
    }
}
        