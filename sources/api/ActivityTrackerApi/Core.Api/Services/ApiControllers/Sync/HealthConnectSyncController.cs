using Microsoft.AspNetCore.Mvc;
using Shared.Interfaces;
using Shared.Models.Import.HealthConnect;

namespace Core.Api.Services.ApiControllers.Sync
{
    public class HealthConnectSyncController: ApiControllerBase
    {
        private readonly IHealthConnectModule _healthConnectModule;

        public HealthConnectSyncController(
            ILogger<HealthConnectSyncController> logger, 
            IHealthConnectModule healthConnectModule): base(logger) 
        {
            _healthConnectModule = healthConnectModule;
        }

        [HttpGet(Name = "GetHealthConnectConfigurationBase")]
        public async Task<HealthConnectConfigurationBase> GetHealthConnectConfigurationBase()
        {
            return await _healthConnectModule.GetHealthConnectConfigurationAsync();
        }

        [HttpPost(Name = "UpdateHealthConnectConfigurationBase")]
        public async Task<IActionResult> UpdateHealthConnectConfigurationBase([FromBody] HealthConnectConfigurationBase configurationBase)
        {
            await _healthConnectModule.UpdateConfigurationBase(configurationBase);

            return Ok();
        }

    }
}
