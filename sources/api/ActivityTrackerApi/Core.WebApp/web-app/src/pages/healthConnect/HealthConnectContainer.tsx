import React from "react";
import { useApi } from "../../hooks/useApi";
import HealthConnectPage from "./HealthConnectPage";
import { HealthConnectConfiguration } from "./types/HealthConnectConfiguration";

const HealthConnectContainer: React.FC = () => {
  const connectionApi = useApi<
    HealthConnectConfiguration,
    HealthConnectConfiguration
  >(
    {
      method: "GET",
      serviceUrl: "HealthConnect/GetHealthConnectConfiguration",
    },
    true,
  );

  const handleUpdateConfiguration = React.useCallback(
    async (updatedConfiguration: HealthConnectConfiguration) => {
      await connectionApi.sendRequest({
        method: "POST",
        serviceUrl: "HealthConnect/UpdateHealthConnectConfiguration",
        model: updatedConfiguration,
      });
    },
    [connectionApi],
  );

  if (
    !connectionApi.isDataBound ||
    !connectionApi.data ||
    connectionApi.data.length === 0
  ) {
    return null;
  }

  return (
    <HealthConnectPage
      configuration={connectionApi.data[0]}
      handleUpdateConfiguration={handleUpdateConfiguration}
    />
  );
};

export default HealthConnectContainer;
