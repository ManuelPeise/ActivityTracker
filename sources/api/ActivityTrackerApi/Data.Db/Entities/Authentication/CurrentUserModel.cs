namespace Data.Db.Entities.Authentication
{
    public class CurrentUserModel
    {
        public int Id { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
    }
}
