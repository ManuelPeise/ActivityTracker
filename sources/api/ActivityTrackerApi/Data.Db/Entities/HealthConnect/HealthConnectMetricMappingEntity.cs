using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.HealthConnect
{
    [Table("HealthConnectMetricMapping")]
    public class HealthConnectMetricMappingEntity: AEntityBase
    {
        public string Source { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsGranted { get; set; }
        public bool IsActive { get; set; }
        public int MetricId { get; set; }
        [ForeignKey(nameof(MetricId))]
        public HealthConnectMetricEntity MetricEntity { get; set; }
    }
}
