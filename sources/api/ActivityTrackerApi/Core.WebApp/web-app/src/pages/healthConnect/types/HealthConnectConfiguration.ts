import { ConnectionStatus } from "../../../lib/enums/ConnectionStatus";
import { HealthConnectMetricMapping } from "./HealthConnectMetricMapping";
import { HealthConnectSourceMapping } from "./HealthConnectSourceMapping";

export type HealthConnectConfiguration = {
  id: number;
  deviceId: string;
  userId: number;
  deviceName: string;
  syncClientId: string;
  isActive: boolean;
  status: ConnectionStatus;
  sourceMappings: HealthConnectSourceMapping[];
  metricMappings: HealthConnectMetricMapping[];
  updatedAt: string;
  updatedBy: string;
};
