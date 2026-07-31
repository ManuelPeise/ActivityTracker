

using Shared.Models.Import.HealthConnect;

namespace Shared.Interfaces
{
    public interface IHealthConnectModule
    {
        Task<HealthConnectConfiguration> GetHealthConnectConfigurationAsync();
        Task<HealthConnectConfigurationBase> GetHealthConnectConfigurationBaseAsync();
        Task<HealthConnectConfiguration> UpdateConfiguration(HealthConnectConfiguration configurationUpdate);
        Task UpdateConfigurationBase(HealthConnectConfigurationBase configurationBase);
        Task ImportHealthData(HealthConnectImportModel importModel);
    }
}
