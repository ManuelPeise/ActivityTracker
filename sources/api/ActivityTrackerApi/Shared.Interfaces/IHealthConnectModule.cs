

using Shared.Models.Import.HealthConnect;

namespace Shared.Interfaces
{
    public interface IHealthConnectModule
    {
        Task<HealthConnectConfiguration> GetHealthConnectConfigurationAsync();
        Task<HealthConnectConfiguration> UpdateConfiguration(HealthConnectConfiguration configurationUpdate);
        Task UpdateProviderAndMetrics(HealthConnectProviderMetricsModel healthConnectProviderMetricsModel);
        Task ImportHealthData(HealthConnectImportModel importModel);
    }
}
