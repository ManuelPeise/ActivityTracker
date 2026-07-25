using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Services.ApiControllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ApiControllerBase: ControllerBase
    {
        private ILogger _logger;
        public ApiControllerBase(ILogger logger)
        {
            _logger = logger;
        }

        protected void LogInfoMessage(string message)
        {
            _logger.LogInformation(message);
        }
    }
}
