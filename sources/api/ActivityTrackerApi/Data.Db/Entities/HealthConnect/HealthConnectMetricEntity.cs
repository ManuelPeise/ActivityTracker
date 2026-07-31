using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.HealthConnect
{
    [Table("HealthConnectMetricTable")]
    public class HealthConnectMetricEntity: AEntityBase
    {
        public string Name { get; set; } = string.Empty;
       
    }
}
