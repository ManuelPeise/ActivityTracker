using System.ComponentModel.DataAnnotations.Schema;


namespace Data.Db.Entities.HealthConnect
{
    [Table("HealthConnectSourceTable")]
    public class HealthConnectSourceEntity: AEntityBase
    {
        public string Name { get; set; } = string.Empty;
    }
}
