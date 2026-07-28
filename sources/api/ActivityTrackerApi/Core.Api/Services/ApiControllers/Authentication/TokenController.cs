using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Authentication;

namespace Core.Api.Services.ApiControllers.Authentication
{
    [WebAuthentication]
    public class TokenController: ApiControllerBase
    {
        private readonly IJwtTokenService _jwtTokenService;
        public TokenController(ILogger<TokenController> logger, IJwtTokenService jwtTokenService): base(logger)
        {
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost(Name = "RefreshToken")]
        public async Task<TokenResponse?> RefreshToken([FromQuery] RefreshTokenRequest request)
        {
            
            var tokenResponse = await _jwtTokenService.RefreshToken(request);
            return tokenResponse;
        }
    }
}
