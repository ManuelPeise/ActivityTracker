using Logic.Shared.Interfaces;
using Microsoft.Extensions.Logging;
using Shared.Enums;
using Shared.Interfaces;
using Shared.Models.Import.HealthConnect;
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
                var metrics = await EnsureHealthConnectMetricAdded();
                var sources = await GetHealthConnectSourcesMappings();

                var configurationEntity = await LoadConfigurationEntity(_userSecurity.CurrentUser.Id);

                if (configurationEntity == null)
                {
                    configurationEntity = GetDefaultHealthConnectConfigurationEntity();
                }

                return ToConfigurationModel(configurationEntity, metrics, sources);

            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while fetching HealthConnect configuration for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while fetching HealthConnect configuration for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public async Task<HealthConnectConfigurationBase> GetHealthConnectConfigurationBaseAsync()
        {
            try
            {
                var configurationEntity = await LoadConfigurationEntity(_userSecurity.CurrentUser.Id);

                if (configurationEntity == null)
                {
                    configurationEntity = GetDefaultHealthConnectConfigurationEntity();
                }

                return new HealthConnectConfigurationBase
                {
                    DeviceId = configurationEntity.DeviceId,
                    DeviceName = configurationEntity.DeviceName,
                    SyncClientId = configurationEntity.SyncClientId,
                    IsActive = configurationEntity.IsActive,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while fetching HealthConnect base configuration for user {UserId}.", _userSecurity.CurrentUser.Id);
                throw new ApplicationException($"An error occurred while fetching HealthConnect base configuration for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public async Task<HealthConnectConfiguration> UpdateConfiguration(HealthConnectConfiguration configurationUpdate)
        {
            try
            {
                var updateTimeStamp = DateTime.Now;

                var configurationEntity = await LoadConfigurationEntity(_userSecurity.CurrentUser.Id);

                if (configurationEntity == null)
                {
                    configurationEntity = GetDefaultHealthConnectConfigurationEntity();
                }

                var metricMapper = new HealthConnectMetricMapper(_applicationUnitOfWork.HealthConnectRepository, _userSecurity.CurrentUser.Id);

                var metrics = await metricMapper.GetMappingsAsync();
                var updatedMetricMappings = await metricMapper.UpdateMappingAsync(configurationUpdate.MetricMappings);

                var sourceMapper = new HealthConnectSourceMapper(_applicationUnitOfWork.HealthConnectRepository, _userSecurity.CurrentUser.Id);
                var sources = await sourceMapper.GetMappingsAsync();
                var updatedSourceMappings = await sourceMapper.UpdateMappingAsync(configurationUpdate.SourceMappings);

                configurationEntity.IsActive = configurationUpdate.IsActive;

                if (configurationUpdate.IsActive && string.IsNullOrEmpty(configurationEntity.SyncClientId))
                {
                    configurationEntity.SyncClientId = Guid.NewGuid().ToString();
                }

                configurationEntity.DeviceId = configurationUpdate.DeviceId;
                configurationEntity.DeviceName = configurationUpdate.DeviceName;
                configurationEntity.Status = configurationEntity.IsActive 
                    && !configurationEntity.HealthConnectSourceMappings.Any() 
                        ? ConnectionStatus.Pending 
                        : !configurationEntity.IsActive 
                        ? ConnectionStatus.Disconnected 
                        : ConnectionStatus.Connected;

                await UpdateMetricMappingEntities(configurationEntity.HealthConnectMetricMappings, updatedMetricMappings);
                await UpdateSourceMappingEntities(configurationEntity.HealthConnectSourceMappings, updatedSourceMappings);

                configurationEntity.HealthConnectSourceMappings = new List<HealthConnectSourceMappingEntity>();

                configurationEntity.UpdatedAt = updateTimeStamp;
                configurationEntity.UpdatedBy = _userSecurity.CurrentUser.EmailAddress;
                await SaveConfigurationEntity(configurationEntity);

                return ToConfigurationModel(configurationEntity, metrics, sources);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating HealthConnect configuration for user {UserId}.", _userSecurity.CurrentUser.Id);

                throw new ApplicationException($"An error occurred while updating HealthConnect configuration for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public async Task UpdateConfigurationBase(HealthConnectConfigurationBase configurationBase)
        {
            try
            {
                var configurationEntity = await LoadConfigurationEntity(_userSecurity.CurrentUser.Id);

                if (configurationEntity == null)
                {
                    configurationEntity = GetDefaultHealthConnectConfigurationEntity();
                }

                if (configurationBase.Sources.Any())
                {
                    var sourceMapper = new HealthConnectSourceMapper(_applicationUnitOfWork.HealthConnectRepository, _userSecurity.CurrentUser.Id);

                    await sourceMapper.AddMappingsAsync(configurationBase.Sources);
                }

                configurationEntity.DeviceId = configurationBase?.DeviceId ?? string.Empty;
                configurationEntity.DeviceName = configurationBase?.DeviceName ?? string.Empty;

                await SaveConfigurationEntity(configurationEntity);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating HealthConnect sources for user {UserId}.", _userSecurity.CurrentUser.Id);
                throw new ApplicationException($"An error occurred while updating HealthConnect sources for user {_userSecurity.CurrentUser.Id}.", exception);
            }
        }

        public async Task ImportHealthData(HealthConnectImportModel importModel)
        {

        }

        private async Task<HashSet<HealthConnectMetricMapping>> EnsureHealthConnectMetricAdded()
        {
            var metricMapper = new HealthConnectMetricMapper(_applicationUnitOfWork.HealthConnectRepository, _userSecurity.CurrentUser.Id);

            return await metricMapper.AddMappingsAsync();
        }

        private async Task<HashSet<HealthConnectSourceMapping>> GetHealthConnectSourcesMappings()
        {
            var sourceMapper = new HealthConnectSourceMapper(_applicationUnitOfWork.HealthConnectRepository, _userSecurity.CurrentUser.Id);

            return await sourceMapper.GetMappingsAsync();
        }

        private async Task<HealthConnectConfigurationEntity> LoadConfigurationEntity(int userId)
        {
            HealthConnectConfigurationEntity? configuration;
            var configurations = await _applicationUnitOfWork.HealthConnectRepository.HealthConnectConfigurationTable.GetBy(x => x.UserId == userId, false);

            if (configurations != null && configurations.Count() > 1)
            {
                throw new Exception($"Multiple HealthConnect configurations found for user {userId}. Expected only one configuration.");
            }

            configuration = configurations?.FirstOrDefault() ?? null;

            if (configuration == null)
            {
                return new HealthConnectConfigurationEntity
                {
                    DeviceId = string.Empty,
                    DeviceName = string.Empty,
                    UserId = _userSecurity.CurrentUser.Id,
                    IsActive = false,
                    Status = ConnectionStatus.Disconnected,
                    SyncClientId = string.Empty,
                    HealthConnectMetricMappings = new List<HealthConnectMetricMappingEntity>(),
                    HealthConnectSourceMappings = new List<HealthConnectSourceMappingEntity>(),
                };
            }

            return configuration;
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
                await _applicationUnitOfWork.HealthConnectRepository.SaveChanges(_userSecurity.CurrentUser.EmailAddress);
            }
        }

        private HealthConnectConfiguration ToConfigurationModel(
            HealthConnectConfigurationEntity configurationEntity,
            HashSet<HealthConnectMetricMapping> metrics,
            HashSet<HealthConnectSourceMapping> sources)
        {
            return new HealthConnectConfiguration
            {
                Id = configurationEntity.Id,
                DeviceId = configurationEntity.DeviceId,
                DeviceName = configurationEntity.DeviceName,
                SyncClientId = configurationEntity.SyncClientId,
                Status = configurationEntity.Status,
                IsActive = configurationEntity.IsActive,
                MetricMappings = metrics,
                SourceMappings = sources,
                UpdatedAt = configurationEntity?.UpdatedAt?.ToString("o") ?? string.Empty,
                UpdatedBy = configurationEntity?.UpdatedBy ?? string.Empty,
            };
        }

        private async Task UpdateMetricMappingEntities(
           ICollection<HealthConnectMetricMappingEntity> mappingEntities,
           HashSet<HealthConnectMetricMapping> updatedMetricMappings)
        {
            foreach (var item in mappingEntities)
            {
                var update = updatedMetricMappings.FirstOrDefault(x => x.MetricId == item.MetricId);

                if (update != null)
                {
                    item.DisplayName = update.DisplayName;
                    item.IsGranted = update.IsGranted;
                    item.IsActive = update.IsActive;
                }
            }
        }

        private async Task UpdateSourceMappingEntities(
            ICollection<HealthConnectSourceMappingEntity> mappingEntities,
            HashSet<HealthConnectSourceMapping> updatedSourceMappings)
        {
            foreach (var item in mappingEntities)
            {
                var update = updatedSourceMappings.FirstOrDefault(x => x.SourceId == item.SourceId);

                if (update != null)
                {
                    item.DisplayName = update.DisplayName;
                    item.IsActive = update.IsActive;
                }
            }
        }

    }
}
