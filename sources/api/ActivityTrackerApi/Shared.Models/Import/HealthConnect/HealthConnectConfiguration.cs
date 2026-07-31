using Shared.Enums;

namespace Shared.Models.Import.HealthConnect
{
    public class HealthConnectConfigurationBase
    {
        public int Id { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string DeviceName { get; set; } = string.Empty;
        public string SyncClientId { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public HashSet<string> Sources { get; set; } = [];
    }

    public class HealthConnectConfiguration: HealthConnectConfigurationBase
    {
        public ConnectionStatus Status { get; set; }
        public HashSet<HealthConnectMetricMapping> MetricMappings { get; set; } = new HashSet<HealthConnectMetricMapping>();
        public HashSet<HealthConnectSourceMapping> SourceMappings { get; set; } = new HashSet<HealthConnectSourceMapping>();
        public string UpdatedAt { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
    }
}
