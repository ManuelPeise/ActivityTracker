using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.Authentication
{
    [Table("DataSyncConnectionTable")]
    public class DataSyncConnectionEntity: AEntityBase
    {
        public string DevideId { get; set; } = string.Empty;
    }
}
