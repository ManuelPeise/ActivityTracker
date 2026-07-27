using Microsoft.AspNetCore.Mvc;
using Shared.Interfaces;
using Shared.Models.Import.HealthConnect;

namespace Core.Api.Services.ApiControllers.Import
{
    public class HealthConnectController : ApiControllerBase
    {
        private readonly IHealthConnectModule _healthConnectModule;

        public HealthConnectController(
            ILogger<HealthConnectController> logger,
            IHealthConnectModule healthConnectModule) : base(logger)
        {
            _healthConnectModule = healthConnectModule;
        }

        [HttpGet("GetHealthConnectConfiguration")]
        public async Task<HealthConnectConfiguration> GetHealthConnectConfiguration()
        {
            return await _healthConnectModule.GetHealthConnectConfigurationAsync();
        }

        [HttpPost(Name = "UpdateHealthConnectConfiguration")]
        public async Task<HealthConnectConfiguration> UpdateHealthConnectConfiguration([FromBody] HealthConnectConfiguration configurationUpdate)
        {
            return await _healthConnectModule.UpdateConfiguration(configurationUpdate);
        }
    }
}