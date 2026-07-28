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

        public async Task UpdateProviderAndMetrics(HealthConnectProviderMetricsModel healthConnectProviderMetricsModel)
        {
            try
            {
                if (healthConnectProviderMetricsModel == null)
                {
                    throw new ArgumentNullException(nameof(healthConnectProviderMetricsModel));
                }

                var configurationEntity = await LoadConfigurationEntity();

                var config = string.IsNullOrEmpty(configurationEntity.ConfigurationJson) ?
                    GetDefaultHealthConnectConfiguration() :
                    JsonConvert.DeserializeObject<HealthConnectConfiguration>(configurationEntity.ConfigurationJson);

                if (config == null || !config.IsActive)
                {
                    throw new InvalidOperationException($"HealthConnect configuration is invalid or inactive for user {_userSecurity.CurrentUser.Id}.");
                }

                config.AvailableProviders = healthConnectProviderMetricsModel.Providers ?? [];
                config.Metrics = healthConnectProviderMetricsModel.Metrics ?? [];

                configurationEntity.ConfigurationJson = JsonConvert.SerializeObject(config);
                configurationEntity.UpdatedAt = DateTime.UtcNow;
                configurationEntity.UpdatedBy = _userSecurity.CurrentUser.EmailAddress;

                await SaveConfigurationEntity(configurationEntity);

            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating HealthConnect providers and metrics for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while updating HealthConnect providers and metrics for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public async Task ImportHealthData(HealthConnectImportModel importModel)
        {
            try
            {
                if (importModel == null)
                {
                    throw new ArgumentNullException(nameof(importModel));
                }

                var configurationEntity = await LoadConfigurationEntity();

                var config = string.IsNullOrEmpty(configurationEntity.ConfigurationJson) ?
                    GetDefaultHealthConnectConfiguration() :
                    JsonConvert.DeserializeObject<HealthConnectConfiguration>(configurationEntity.ConfigurationJson);

                if (config == null)
                {
                    throw new InvalidOperationException($"HealthConnect configuration is invalid for user {_userSecurity.CurrentUser.Id}.");
                }

                if (!config.IsActive)
                {
                    _logger.LogWarning("HealthConnect import attempted while connection is inactive for user {UserId}.", _userSecurity.CurrentUser.Id);

                    return;
                }

                EnsureConfigIsUpToDate(config, importModel, out bool isModified);

                if (isModified)
                {
                    configurationEntity.ConfigurationJson = JsonConvert.SerializeObject(config);

                    await SaveConfigurationEntity(configurationEntity);
                }

                var provider = config.AvailableProviders.FirstOrDefault(p => p.Id == config.SelectedProviderId);

                if (provider == null)
                {
                    _logger.LogWarning("Selected provider with ID {ProviderId} not found in available providers for user {UserId}.", config.SelectedProviderId, _userSecurity.CurrentUser.Id);

                    return;
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while importing HealthConnect data for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while importing HealthConnect data for user {_userSecurity.CurrentUser.Id}.", exception);
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

        private void EnsureConfigIsUpToDate(HealthConnectConfiguration config, HealthConnectImportModel importModel, out bool isModified)
        {
            config.AvailableProviders ??= [];
            config.Metrics ??= [];

            var providers = importModel.Providers ?? [];
            var metrics = importModel.Metrics ?? [];

            isModified = false;

            var existingProviderNames = new HashSet<string>(config.AvailableProviders
                .Where(provider => !string.IsNullOrWhiteSpace(provider.Name))
                .Select(provider => provider.Name), StringComparer.OrdinalIgnoreCase);

            foreach (var provider in providers)
            {
                if (string.IsNullOrWhiteSpace(provider.Name))
                {
                    continue;
                }

                if (existingProviderNames.Add(provider.Name))
                {
                    config.AvailableProviders.Add(provider);
                    isModified = true;
                }
            }

            var existingMetricNames = new HashSet<string>(config.Metrics
                .Where(metric => !string.IsNullOrWhiteSpace(metric.Name))
                .Select(metric => metric.Name), StringComparer.OrdinalIgnoreCase);

            foreach (var metric in metrics)
            {
                if (string.IsNullOrWhiteSpace(metric.Name))
                {
                    continue;
                }

                if (existingMetricNames.Add(metric.Name))
                {
                    config.Metrics.Add(metric);
                    isModified = true;
                }
            }
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
