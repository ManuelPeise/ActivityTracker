using Logic.Shared.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Shared.Interfaces;

namespace Logic.AuthenticationService
{
    public static class AuthenticationServiceRegistration
    {
        public static void AddAuthenticationService(this IServiceCollection services)
        {
            services.AddScoped<IUserAuthentication, UserAuthenticationService>();
            services.AddScoped<IUserRegistration, UserRegistration>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
        }
    }
}
