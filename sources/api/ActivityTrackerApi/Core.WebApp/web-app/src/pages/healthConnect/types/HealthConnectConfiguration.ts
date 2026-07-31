import { ConnectionStatus } from "../../../lib/enums/ConnectionStatus";
import { HealthConnectMetric } from "./HealthConnectMetric";
import { HealthConnectProvider } from "./HealthConnectProvider";

export type HealthConnectConfiguration = {
  isActive: boolean;
  status: ConnectionStatus;
  selectedSourceId: number;
  availableSources: HealthConnectProvider[];
  selectedMetricIds: number[];
  metrics: HealthConnectMetric[];
  isInitialLoad: boolean;
  updatedAt: string;
  updatedBy: string;
};
