using Data.Db.Entities.Authentication;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Shared.Models.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Logic.AuthenticationService
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtTokenModel _jwtTokenModel;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;

        public JwtTokenService(IOptions<JwtTokenModel> options, IApplicationUnitOfWork applicationUnitOfWork)
        {
            _jwtTokenModel = options.Value;
            _applicationUnitOfWork = applicationUnitOfWork;
        }

        public (string Jwt, string RefreshToken) GenerateTokens(UserEntity user)
        {
            return (GenerateJwt(user), GenerateRefreshToken());
        }

        public async Task<TokenResponse> RefreshToken(RefreshTokenRequest request)
        {
            var principal = GetPrincipalFromExpiredToken(request.Jwt);

            var email = principal.Identity!.Name ?? string.Empty;

            var users = await _applicationUnitOfWork.UserTable.GetBy(
                user => user.EmailAddress == email, 
                true,
                user => user.Include(u => u.UserAuthentication));

            if(!users.Any() || users.Count() > 1)
            {
                throw new SecurityTokenException("Invalid refresh token");
            }

            var user = users.First();

            if (user == null || user?.UserAuthentication == null || user.UserAuthentication.RefreshToken != request.RefreshToken)
            {
                throw new SecurityTokenException("Invalid refresh token");
            }

            var newAccessToken = GenerateJwt(user);
            var newRefreshToken = GenerateRefreshToken();

            user.UserAuthentication.RefreshToken = newRefreshToken;

            await _applicationUnitOfWork.UserTable.Update(user, u => u.Id == user.Id);

            await _applicationUnitOfWork.SaveChangesAsync();

            return new TokenResponse
            {
                Jwt = newAccessToken,
                RefreshToken = newRefreshToken,
            };
        }

        public int GetJwtExpireSeconds()
        {
            return _jwtTokenModel.ExpiresInSeconds;
        }

        public JwtTokenModel GetJwtOptions()
        {
            return _jwtTokenModel;
        }

        private string GenerateJwt(UserEntity appUserEntity)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtTokenModel.SecurityKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = GetUserClaims(appUserEntity);

            var token = new JwtSecurityToken(
                issuer: _jwtTokenModel.Issuer,
                audience: _jwtTokenModel.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddSeconds(_jwtTokenModel.ExpiresInSeconds),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string? token)
        {
            if(string.IsNullOrWhiteSpace(token))
            {
                throw new SecurityTokenException("Invalid token");
            }

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidAudience = _jwtTokenModel.Audience,

                ValidateIssuer = true,
                ValidIssuer = _jwtTokenModel.Issuer,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_jwtTokenModel.SecurityKey)
                ),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken)
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        private List<Claim> GetUserClaims(UserEntity user)
        {
            return new List<Claim>
            {
                new Claim("name", $"{user.FirstName} {user.LastName}"),
                new Claim("emailaddress", user.EmailAddress),
                new Claim("expiration", DateTime.UtcNow.AddSeconds(_jwtTokenModel.ExpiresInSeconds).ToString("o"))
            };
        }
    }
}
