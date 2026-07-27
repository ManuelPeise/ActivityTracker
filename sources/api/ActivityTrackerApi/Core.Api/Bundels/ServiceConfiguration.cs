using Data.Db;
using Logic.AuthenticationService;
using Logic.Import;
using Logic.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Shared.Models.Authentication;
using System.Configuration;
using System.Text;

namespace Core.Api.Bundels
{
    internal static class ServiceConfiguration
    {
        internal static void ConfigureServices(WebApplicationBuilder builder, string corsPolicyName)
        {
            builder.Services.Configure<JwtTokenModel>(builder.Configuration.GetSection("Jwt"));

            var connectionString = builder.Configuration.GetConnectionString("ActivityTrackerDb") 
                ?? throw new InvalidOperationException("Connection string 'ActivityTrackerDb' not found.");

            builder.Services.AddDbContext<AppDbContext>(options => options.UseMySQL(connectionString));
            builder.Services.AddLogging(options =>
            {
                options.AddConsole();
                options.AddDebug();
            });

            builder.Host.UseSerilog((context, config) =>
            {
                config
                    .WriteTo.Console()
                    .WriteTo.File(
                        "logs/activitytracker.log",
                        rollingInterval: RollingInterval.Day);
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

            var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtTokenModel>();

            if (jwtConfig == null)
            {
                throw new InvalidOperationException("JWT configuration section is missing or invalid.");
            }

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                var key = jwtConfig?.SecurityKey ?? string.Empty;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = true,
                    ValidAudience = jwtConfig?.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(key)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            builder.Services.AddHttpContextAccessor();

            SharedServiceRegistration.RegisterSharedServices(builder.Services);
            AuthenticationServiceRegistration.AddAuthenticationService(builder.Services);
            ImportServiceRegistration.RegisterImportServices(builder.Services);

            builder.Services.AddControllers();
        }
    }
}
        