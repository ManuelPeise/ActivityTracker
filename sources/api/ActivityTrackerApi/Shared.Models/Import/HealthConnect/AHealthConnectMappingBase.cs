namespace Shared.Models.Import.HealthConnect
{
    public class AHealthConnectMappingBase
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
