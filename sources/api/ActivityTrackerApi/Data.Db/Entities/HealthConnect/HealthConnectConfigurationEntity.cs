using Data.Db.Entities.Authentication;
using Shared.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.HealthConnect
{
    [Table("HealthConnectConfiguration")]
    public class HealthConnectConfigurationEntity: AEntityBase
    {
        public string DeviceId { get; set; } = string.Empty;
        public string DeviceName { get; set; } = string.Empty;
        public ConnectionStatus Status { get; set; }
        public bool IsActive { get; set; }
        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = new();
        public ICollection<HealthConnectSourceMappingEntity> HealthConnectSourceMappings { get; set; } = [];
        public ICollection<HealthConnectMetricMappingEntity> HealthConnectMetricMappings { get; set; } = [];
    }
}
