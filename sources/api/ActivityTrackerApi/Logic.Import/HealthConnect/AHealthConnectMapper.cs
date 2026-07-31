using Logic.Shared.Interfaces;
using Shared.Models.Import.HealthConnect;

namespace Logic.Import.HealthConnect
{
    internal abstract class AHealthConnectMapper<TModel> where TModel : AHealthConnectMappingBase
    {
        protected IHealthConnectRepository HealthConnectRepository { get; private set; }
        protected bool IsDbModified { get; set; }
        protected int UserId { get; private set; }

        public AHealthConnectMapper(IHealthConnectRepository healthConnectRepository, int userId)
        {
            HealthConnectRepository = healthConnectRepository;
            UserId = userId;
        }

        public abstract Task<HashSet<TModel>> GetMappingsAsync();

        public abstract Task<HashSet<TModel>> UpdateMappingAsync(HashSet<TModel> models);
    }
}
