using System.ComponentModel.DataAnnotations;

namespace Data.Db.Entities
{
    public abstract class AEntityBase
    {
        [Key] 
        public int Id { get; set; }

        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; } = null;
        public DateTime? UpdatedAt { get; set; } = null;
    }
}
