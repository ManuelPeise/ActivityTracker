using Microsoft.AspNetCore.Mvc;
using Shared.Interfaces;
using Shared.Models.Import.HealthConnect;

namespace Core.Api.Services.ApiControllers.Import
{
    [WebAuthentication]
    public class HealthConnectController : ApiControllerBase
    {
        private readonly IHealthConnectModule _healthConnectModule;

        public HealthConnectController(
            ILogger<HealthConnectController> logger,
            IHealthConnectModule healthConnectModule) : base(logger)
        {
            _healthConnectModule = healthConnectModule;
        }

        [HttpGet(Name = "GetHealthConnectConfiguration")]
        public async Task<HealthConnectConfiguration> GetHealthConnectConfiguration()
        {
            return await _healthConnectModule.GetHealthConnectConfigurationAsync();
        }

        [HttpPost(Name = "UpdateHealthConnectConfiguration")]
        public async Task<HealthConnectConfiguration> UpdateHealthConnectConfiguration([FromBody] HealthConnectConfiguration configurationUpdate)
        {
            return await _healthConnectModule.UpdateConfiguration(configurationUpdate);
        }

        [HttpPost(Name = "ImportHealthConnectData")]
        public async Task<IActionResult> ImportHealthConnectData([FromBody] HealthConnectImportModel importModel)
        {
            await _healthConnectModule.ImportHealthData(importModel);

            return Ok();
        }
    }
}