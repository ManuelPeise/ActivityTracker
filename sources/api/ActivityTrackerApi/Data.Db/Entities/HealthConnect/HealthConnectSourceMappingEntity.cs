using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.HealthConnect
{
    [Table("HealthConnectSourceMapping")]
    public class HealthConnectSourceMappingEntity: AEntityBase
    {
        public string Source { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int SourceId { get; set; }
        [ForeignKey(nameof(SourceId))]
        public HealthConnectSourceEntity SourceEntity { get; set; }
    }
}
