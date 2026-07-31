using Shared.Enums;

namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectConfiguration
    {
        public string DeviceId { get; set; } = string.Empty;
        public string DeviceName { get; set; } = string.Empty;
        public ConnectionStatus Status { get; set; }
        public bool IsActive { get; set; }
        public int SelectedSourceId { get; set; } = -1;
        public List<HealthConnectSource> AvailableSources { get; set; } = new List<HealthConnectSource>();
        public List<int> SelectedMetricIds { get; set; } = new List<int>();
        public List<HealthConnectMetric> Metrics { get; set; } = new List<HealthConnectMetric>();
        public string UpdatedAt { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
    }
}
