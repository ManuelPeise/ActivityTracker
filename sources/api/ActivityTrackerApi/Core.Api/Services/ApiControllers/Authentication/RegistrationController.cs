using Microsoft.AspNetCore.Mvc;
using Shared.Interfaces;
using Shared.Models.Authentication;

namespace Core.Api.Services.ApiControllers.Authentication
{
    public class RegistrationController: ApiControllerBase
    {
        private readonly IUserRegistration _userRegistration;
        public RegistrationController(ILogger<RegistrationController> logger, IUserRegistration userRegistration): base(logger)
        {
            _userRegistration = userRegistration;
        }

        [HttpPost(Name = "RegisterUser")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationRequest request)
        {
            var success = await _userRegistration.RegisterUser(request);

            var host = Request.Host.Value;

            return Redirect($"http://{host}/auth/login");
        }
    }
}
