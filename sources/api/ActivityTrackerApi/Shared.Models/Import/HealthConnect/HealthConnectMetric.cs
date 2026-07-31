namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectMetric
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsGranted { get; set; }
        public bool IsActive { get; set; }
    }
}
