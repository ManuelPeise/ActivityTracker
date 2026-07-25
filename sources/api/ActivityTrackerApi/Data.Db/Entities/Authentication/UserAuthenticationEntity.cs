using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.Authentication
{
    [Table("UserAuthenticationTable")]
    public class UserAuthenticationEntity: AEntityBase
    {
        public string Password { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;
        public DateTime? PasswordExpiresAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiresAt { get; set; }
    }
}
