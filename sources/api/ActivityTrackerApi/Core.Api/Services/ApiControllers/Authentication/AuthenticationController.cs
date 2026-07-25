using Microsoft.AspNetCore.Mvc;
using Shared.Interfaces;
using Shared.Models.Authentication;

namespace Core.Api.Services.ApiControllers.Authentication
{
    public class AuthenticationController : ApiControllerBase
    {
        private readonly IUserAuthentication _userAuthentication;

        public AuthenticationController(ILogger<AuthenticationController> logger, IUserAuthentication userAuthentication) : base(logger)
        {
            _userAuthentication = userAuthentication;
        }

        [HttpPost(Name = "AuthenticateUser")]
        public async Task<TokenResponse?> AuthenticateUser([FromBody] AuthenticateUserRequest request)
        {
            return await _userAuthentication.Authenticate(request);
        }
    }
}
