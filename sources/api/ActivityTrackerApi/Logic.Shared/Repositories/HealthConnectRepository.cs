using Data.Db;
using Data.Db.Entities.HealthConnect;
using Data.Db.Repositories;
using Data.Db.Repositories.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Logic.Shared.Repositories
{
    public class HealthConnectRepository: ARepositoryBase, IHealthConnectRepository
    {
        private IDbRepositoryBase<HealthConnectConfigurationEntity>? _healthConnectConfigurationTable;
        private IDbRepositoryBase<HealthConnectMetricEntity>? _healthConnectMetricTable;
        private IDbRepositoryBase<HealthConnectMetricMappingEntity>? _healthConnectMetricMappingTable;
        private IDbRepositoryBase<HealthConnectSourceEntity>? _healthConnectSourceTable;
        private IDbRepositoryBase<HealthConnectSourceMappingEntity>? _healthConnectSourceMappingTable;

        public IDbRepositoryBase<HealthConnectConfigurationEntity> HealthConnectConfigurationTable =>
            _healthConnectConfigurationTable ?? new DbRepositoryBase<HealthConnectConfigurationEntity>(DbContext);
        public IDbRepositoryBase<HealthConnectMetricEntity> HealthConnectMetricTable =>
            _healthConnectMetricTable ?? new DbRepositoryBase<HealthConnectMetricEntity>(DbContext);
        public IDbRepositoryBase<HealthConnectMetricMappingEntity> HealthConnectMetricMappingTable =>
            _healthConnectMetricMappingTable ?? new DbRepositoryBase<HealthConnectMetricMappingEntity>(DbContext);
        public IDbRepositoryBase<HealthConnectSourceEntity> HealthConnectSourceTable =>
            _healthConnectSourceTable ?? new DbRepositoryBase<HealthConnectSourceEntity>(DbContext);
        public IDbRepositoryBase<HealthConnectSourceMappingEntity> HealthConnectSourceMappingTable =>
            _healthConnectSourceMappingTable ?? new DbRepositoryBase<HealthConnectSourceMappingEntity>(DbContext);

        public HealthConnectRepository(AppDbContext dbContext, HttpContext httpContext)
            : base(dbContext, httpContext)
        {
            InitializeRepositories(dbContext);
        }

        private void InitializeRepositories(AppDbContext dbContext)
        {
            _healthConnectConfigurationTable = new DbRepositoryBase<HealthConnectConfigurationEntity>(dbContext);
            _healthConnectMetricTable = new DbRepositoryBase<HealthConnectMetricEntity>(dbContext);
            _healthConnectMetricMappingTable = new DbRepositoryBase<HealthConnectMetricMappingEntity>(dbContext);
            _healthConnectSourceTable = new DbRepositoryBase<HealthConnectSourceEntity>(dbContext);
            _healthConnectSourceMappingTable = new DbRepositoryBase<HealthConnectSourceMappingEntity>(dbContext);
        }
    }
}
