using Logic.Shared.Interfaces;
using Microsoft.Extensions.Logging;
using Shared.Enums;
using Shared.Interfaces;
using Shared.Models.Import.HealthConnect;
using Newtonsoft.Json;
using Data.Db.Entities.Import;

namespace Logic.Import.HealthConnect
{
    public class HealthConnectModule : IHealthConnectModule
    {
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;
        private readonly ILogger<HealthConnectModule> _logger;
        private readonly IUserSecurity _userSecurity;

        public HealthConnectModule(ILogger<HealthConnectModule> logger, IUserSecurity userSecurity, IApplicationUnitOfWork applicationUnitOfWork)
        {
            _logger = logger;
            _userSecurity = userSecurity;
            _applicationUnitOfWork = applicationUnitOfWork;
        }

        public async Task<HealthConnectConfiguration> GetHealthConnectConfigurationAsync()
        {
            try
            {
                var configuration = await LoadConfigurationEntity();

                var configurationModel = !string.IsNullOrEmpty(configuration?.ConfigurationJson) ?
                    JsonConvert.DeserializeObject<HealthConnectConfiguration>(configuration.ConfigurationJson) :
                    null;

                return configurationModel ?? GetDefaultHealthConnectConfiguration();

            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while fetching HealthConnect configuration for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while fetching HealthConnect configuration for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public async Task<HealthConnectConfiguration> UpdateConfiguration(HealthConnectConfiguration configurationUpdate)
        {
            try
            {
                var configurationEntity = await LoadConfigurationEntity();

                if (configurationEntity == null)
                {
                    throw new InvalidOperationException($"HealthConnect configuration not found for user {_userSecurity.CurrentUser.Id}.");
                }

                var config = string.IsNullOrEmpty(configurationEntity.ConfigurationJson) ?
                    GetDefaultHealthConnectConfiguration() :
                    JsonConvert.DeserializeObject<HealthConnectConfiguration>(configurationEntity.ConfigurationJson);

                if (config == null)
                {
                    config = GetDefaultHealthConnectConfiguration();
                }

                config.IsActive = configurationUpdate.IsActive;
                config.SelectedProviderId = configurationUpdate.SelectedProviderId;
                config.Metrics = configurationUpdate.Metrics;
                config.Status = !config.IsActive ? ConnectionStatus.Disconnected :
                    !config.AvailableProviders.Any() || !config.AvailableProviders.Any(p => p.Id == config.SelectedProviderId) ?
                        ConnectionStatus.Pending :
                    config.Status;

                configurationEntity.ConfigurationJson = JsonConvert.SerializeObject(config);
                configurationEntity.UpdatedAt = DateTime.UtcNow;
                configurationEntity.UpdatedBy = _userSecurity.CurrentUser.EmailAddress;

                await SaveConfigurationEntity(configurationEntity);

                return config;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating HealthConnect configuration for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while updating HealthConnect configuration for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        private async Task<ImportConfigurationEntity> LoadConfigurationEntity()
        {
            var configurations = await _applicationUnitOfWork.ImportConfigurationTable.GetBy(x =>
                x.Type == ConfigurationType.HealthConnect &&
                x.UserId == _userSecurity.CurrentUser.Id);

            if (configurations == null || !configurations.Any())
            {
                return new ImportConfigurationEntity
                {
                    UserId = _userSecurity.CurrentUser.Id,
                    Type = ConfigurationType.HealthConnect,
                    ConfigurationJson = JsonConvert.SerializeObject(GetDefaultHealthConnectConfiguration())
                };
            }

            if (configurations.Count() > 1)
            {
                throw new InvalidOperationException($"Multiple HealthConnect configurations found for user {_userSecurity.CurrentUser.Id}.");
            }

            return configurations.First();
        }

        private HealthConnectConfiguration GetDefaultHealthConnectConfiguration()
        {
            var configuration = new HealthConnectConfiguration
            {
                ConnectionGuid = Guid.NewGuid(),
                IsActive = false,
                SelectedProviderId = -1
            };

            return configuration;
        }

        private async Task SaveConfigurationEntity(ImportConfigurationEntity configurationEntity)
        {
            var dbIsModified = false;

            if (configurationEntity.Id == 0)
            {
                dbIsModified = await _applicationUnitOfWork.ImportConfigurationTable.Insert(
                    configurationEntity,
                    x => x.UserId == _userSecurity.CurrentUser.Id && x.Type == ConfigurationType.HealthConnect);
            }
            else
            {
                dbIsModified = await _applicationUnitOfWork.ImportConfigurationTable.Update(
                    configurationEntity,
                    x => x.Id == configurationEntity.Id);
            }

            if (dbIsModified)
            {
                await _applicationUnitOfWork.SaveChangesAsync();
            }
        }
    }
}
