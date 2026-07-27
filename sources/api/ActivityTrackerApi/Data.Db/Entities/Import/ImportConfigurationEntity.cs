using Shared.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.Import
{
    [Table("ImportConfigurationTable")]
    public class ImportConfigurationEntity: AEntityBase
    {
        public int UserId { get; set; }
        public ConfigurationType Type { get; set; }
        public string ConfigurationJson { get; set; } = string.Empty;
    }
}
