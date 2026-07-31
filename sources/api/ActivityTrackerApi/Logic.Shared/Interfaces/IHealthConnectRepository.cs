
using Data.Db.Entities.HealthConnect;
using Data.Db.Repositories.Interfaces;

namespace Logic.Shared.Interfaces
{
    public interface IHealthConnectRepository
    {
        public IDbRepositoryBase<HealthConnectConfigurationEntity> HealthConnectConfigurationTable { get;  }
        public IDbRepositoryBase<HealthConnectMetricEntity> HealthConnectMetricTable {  get; }
        public IDbRepositoryBase<HealthConnectMetricMappingEntity> HealthConnectMetricMappingTable {  get; }
        public IDbRepositoryBase<HealthConnectSourceEntity> HealthConnectSourceTable {  get; }
        public IDbRepositoryBase<HealthConnectSourceMappingEntity> HealthConnectSourceMappingTable {  get; }

        Task SaveChanges(string userName = "System");
    }
}
