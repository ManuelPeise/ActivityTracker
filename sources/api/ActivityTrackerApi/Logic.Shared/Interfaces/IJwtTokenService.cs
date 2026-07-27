using Data.Db.Entities.Authentication;
using Shared.Models.Authentication;

namespace Logic.Shared.Interfaces
{
    public interface IJwtTokenService
    {
        (string Jwt, string RefreshToken) GenerateTokens(UserEntity user);
        Task<TokenResponse> RefreshToken(RefreshTokenRequest request);
        int GetJwtExpireSeconds();
        JwtTokenModel GetJwtOptions();
    }
}
