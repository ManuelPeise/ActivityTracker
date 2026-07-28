using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Core.Api.Services
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class SyncClientAuthentication : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var jwtTokenService = context.HttpContext.RequestServices.GetService<IJwtTokenService>();

            if (jwtTokenService == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var authHeader = context.HttpContext.Request.Headers["token"].FirstOrDefault();

            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            var jwtModel = jwtTokenService.GetJwtOptions();

            if (jwtModel == null || string.IsNullOrEmpty(jwtModel.SecurityKey))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var principal = ValidateJwtToken(token, jwtModel);

            var clientType = principal?.Claims.FirstOrDefault(x => x.Type == "client-type")?.Value;

            if (principal == null || clientType != "sync-client")
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (principal == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            context.HttpContext.User = principal;
        }

        private ClaimsPrincipal? ValidateJwtToken(string token, dynamic jwtModel)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(jwtModel.SecurityKey);

            try
            {
                var principal = tokenHandler.ValidateToken(
                    token,
                    new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = true,
                        ValidAudience = jwtModel.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    },
                    out SecurityToken validatedToken);

                return principal;
            }
            catch
            {
                // Optional: Logging
                return null;
            }
        }
    }
}