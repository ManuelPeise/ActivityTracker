using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Services.ApiControllers
{
    public class WhoAmIController: ApiControllerBase
    {
        public WhoAmIController(ILogger<WhoAmIController> logger): base(logger)
        {
            
        }

        [HttpGet(Name ="whoami")]
        public async Task<IActionResult> WhoAmI()
        {
            var result = "ActivityTracker API is running.";
            return Ok(result);
        }
    }
}
