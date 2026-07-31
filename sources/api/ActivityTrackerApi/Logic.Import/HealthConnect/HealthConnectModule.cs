using Logic.Shared.Interfaces;
using Microsoft.Extensions.Logging;
using Shared.Enums;
using Shared.Interfaces;
using Shared.Models.Import.HealthConnect;
using Newtonsoft.Json;
using Data.Db.Entities.HealthConnect;

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
                var configurationEntity = await LoadConfigurationEntity();

                if(configurationEntity == null)
                {
                    configurationEntity = GetDefaultHealthConnectConfigurationEntity();
                }

                return ToConfigurationModel(configurationEntity);

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
                var updateTimeStamp = DateTime.Now;

                var configurationEntity = await LoadConfigurationEntity();

                if (configurationEntity == null)
                {
                    configurationEntity = GetDefaultHealthConnectConfigurationEntity();
                }

                configurationEntity.IsActive = configurationUpdate.IsActive;
                configurationEntity.DeviceId = configurationUpdate.DeviceId;
                configurationEntity.DeviceName = configurationUpdate.DeviceName;
                configurationEntity.Status = configurationUpdate.Status;
                configurationEntity.UpdatedAt = updateTimeStamp;
                configurationEntity.UpdatedBy = _userSecurity.CurrentUser.EmailAddress;
                configurationEntity.HealthConnectMetricMappings = new List<HealthConnectMetricMappingEntity>();
                configurationEntity.HealthConnectSourceMappings = new List<HealthConnectSourceMappingEntity>();
               
                await SaveConfigurationEntity(configurationEntity);

                return ToConfigurationModel(configurationEntity);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating HealthConnect configuration for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while updating HealthConnect configuration for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public Task UpdateProviderAndMetrics(HealthConnectProviderMetricsModel healthConnectProviderMetricsModel)
        {
            throw new NotImplementedException();
        }

        public async Task ImportHealthData(HealthConnectImportModel importModel)
        {
           
        }

        private async Task<HealthConnectConfigurationEntity> LoadConfigurationEntity()
        {
            var configurations = await _applicationUnitOfWork.HealthConnectRepository.HealthConnectConfigurationTable.GetBy(x =>
               x.UserId == _userSecurity.CurrentUser.Id);

            if (configurations == null || !configurations.Any())
            {
                return new HealthConnectConfigurationEntity
                {
                    DeviceId = string.Empty,
                    DeviceName = string.Empty,
                    UserId = _userSecurity.CurrentUser.Id,
                    IsActive = false,
                    Status = ConnectionStatus.Disconnected,     
                };
            }

            if (configurations.Count() > 1)
            {
                throw new InvalidOperationException($"Multiple HealthConnect configurations found for user {_userSecurity.CurrentUser.Id}.");
            }

            return configurations.First();
        }

        private HealthConnectConfigurationEntity GetDefaultHealthConnectConfigurationEntity()
        {
            var configurationEntity = new HealthConnectConfigurationEntity
            {
                DeviceId = string.Empty,
                UserId = _userSecurity.CurrentUser.Id,
                DeviceName = string.Empty,
                Status = ConnectionStatus.Disconnected,
                IsActive = false, 
            };

            return configurationEntity;
        }

        private void EnsureConfigIsUpToDate(HealthConnectConfiguration config, HealthConnectImportModel importModel, out bool isModified)
        {
            config.AvailableSources ??= [];
            config.Metrics ??= [];

            var providers = importModel.Providers ?? [];
            var metrics = importModel.Metrics ?? [];

            isModified = false;

            var existingSourceNames = new HashSet<string>(config.AvailableSources
                .Where(source => !string.IsNullOrWhiteSpace(source.Name))
                .Select(source => source.Name), StringComparer.OrdinalIgnoreCase);

            foreach (var source in providers)
            {
                if (string.IsNullOrWhiteSpace(source.Name))
                {
                    continue;
                }

                if (existingSourceNames.Add(source.Name))
                {
                    config.AvailableSources.Add(source);
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
        
        private async Task SaveConfigurationEntity(HealthConnectConfigurationEntity configurationEntity)
        {
            var dbIsModified = false;

            if (configurationEntity.Id == 0)
            {
                dbIsModified = await _applicationUnitOfWork.HealthConnectRepository.HealthConnectConfigurationTable.Insert(
                    configurationEntity,
                    x => x.UserId == _userSecurity.CurrentUser.Id);
            }
            else
            {
                dbIsModified = await _applicationUnitOfWork.HealthConnectRepository.HealthConnectConfigurationTable.Update(
                    configurationEntity,
                    x => x.Id == configurationEntity.Id);
            }

            if (dbIsModified)
            {
                await _applicationUnitOfWork.SaveChangesAsync();
            }
        }

        private HealthConnectConfiguration ToConfigurationModel(HealthConnectConfigurationEntity configurationEntity)
        {
            return new HealthConnectConfiguration
            {
                DeviceId = configurationEntity.DeviceId,
                DeviceName = configurationEntity.DeviceName,
                Status = configurationEntity.Status,
                IsActive = configurationEntity.IsActive,
                SelectedSourceId = -1,
                AvailableSources = new List<HealthConnectSource>(),
                Metrics = new List<HealthConnectMetric>(),
                SelectedMetricIds = new List<int>(),
                UpdatedAt = configurationEntity?.UpdatedAt?.ToString("o") ?? string.Empty,
                UpdatedBy = configurationEntity?.UpdatedBy ?? string.Empty,
            };
        }

        
    }
}
