using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Db.Entities.Authentication
{
    [Table("UserTable")]
    public class UserEntity: AEntityBase
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public int UserAuthenticationId { get; set; }
        [ForeignKey(nameof(UserAuthenticationId))]
        public UserAuthenticationEntity UserAuthentication { get; set; } = null!;
    }
}
