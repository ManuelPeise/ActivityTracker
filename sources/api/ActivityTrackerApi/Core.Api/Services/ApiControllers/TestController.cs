using Microsoft.AspNetCore.Mvc;

namespace Core.Api.Services.ApiControllers
{
    public class TestController: ApiControllerBase
    {
        public TestController(ILogger<TestController> logger): base(logger)
        {
            
        }
        [HttpGet]
        public async Task<string> Test()
        {
            await Task.Delay(100);
            LogInfoMessage("Test seccessfull");
            return "Test successful!";
        }
    }
}
