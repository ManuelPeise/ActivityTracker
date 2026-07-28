import React from "react";
import PageContainer from "../../components/wrappers/PageContainer";
import { Stack, Box, Typography, Avatar } from "@mui/material";
import useStyles from "../../hooks/useStyles";
import healthConnectLogo from "../../lib/images/Health_Connect_LOGO.svg";
import FormContainer, {
  FormButtonProps,
} from "../../components/form/FormContainer";
import FormListItemSwitch from "../../components/list/FormListItemSwitch";
import { HealthConnectConfiguration } from "./types/HealthConnectConfiguration";
import { useForm } from "../../hooks/useForm";
import StatusListItem from "../../components/list/StatusListitem";
import { ConnectionStatus } from "../../lib/enums/ConnectionStatus";
import DropdownListItem from "../../components/list/DropdownListItem";
import { HealthConnectMetric } from "./types/HealthConnectMetric";
import MultiSelectDropdownListItem from "../../components/list/MultiSelectDropdownListItem";
import FormChipListItem from "../../components/list/FormChipListItem";
import LastUpdateAtByListItem from "../../components/list/LastUpdateAtByListItem";

type HealthConnectPageProps = {
  configuration: HealthConnectConfiguration;
  handleUpdateConfiguration: (
    updatedConfiguration: HealthConnectConfiguration,
  ) => Promise<void>;
};

const HealthConnectPage: React.FC<HealthConnectPageProps> = (props) => {
  const { configuration, handleUpdateConfiguration } = props;
  const { theme } = useStyles();

  const initialMetrics = React.useMemo((): HealthConnectMetric[] => {
    return configuration.metrics ?? [];
  }, [configuration.metrics]);

  const initialSelectedMetricIds = React.useMemo((): number[] => {
    const availableMetricIds = new Set(
      initialMetrics.map((metric) => metric.id),
    );

    if (configuration.selectedMetricIds?.length > 0) {
      return configuration.selectedMetricIds.filter((metricId) =>
        availableMetricIds.has(metricId),
      );
    }

    return initialMetrics
      .filter((metric) => metric.isActive)
      .map((metric) => metric.id);
  }, [configuration.selectedMetricIds, initialMetrics]);

  const { isModified, subscribeValues, onChange, resetForm, updatedModel } =
    useForm<HealthConnectConfiguration>(configuration);

  const {
    isActive,
    status,
    selectedProviderId,
    availableProviders,
    selectedMetricIds,
    metrics,
    isInitialLoad,
    lastUpdatedAt,
    lastUpdatedBy,
  } = subscribeValues((configuration) => ({
    isActive: configuration.isActive,
    status: configuration.status,
    selectedProviderId: configuration.selectedProviderId,
    availableProviders: configuration.availableProviders,
    selectedMetricIds: configuration.selectedMetricIds,
    metrics: configuration.metrics,
    isInitialLoad: configuration.isInitialLoad,
    lastUpdatedAt: configuration.updatedAt,
    lastUpdatedBy: configuration.updatedBy,
  }));

  const formButtonProps = React.useMemo((): FormButtonProps[] => {
    return [
      { label: "Cancel", disabled: !isModified, action: resetForm },
      {
        label: "Save Changes",
        disabled: !isModified,
        action: async () => {
          await handleUpdateConfiguration({
            ...updatedModel,
          });
        },
      },
    ];
  }, [resetForm, isModified, updatedModel, handleUpdateConfiguration]);

  const statusText = React.useMemo((): string => {
    switch (status) {
      case ConnectionStatus.Connected:
        return "Health Connect service is connected.";
      case ConnectionStatus.Disconnected:
        return "Health Connect service is disconnected.";
      case ConnectionStatus.Pending:
        return "Health Connect service connection is in a pending state, to complete the setup establish the connection with the provided Sync Client App on your mobile device.";
      default:
        return "Unknown";
    }
  }, [status]);

  const handleToggleMetric = React.useCallback(
    (metricId: number, isSelected: boolean) => {
      const nextSelectedMetricIds = isSelected
        ? [...selectedMetricIds, metricId]
        : selectedMetricIds.filter((selectedId) => selectedId !== metricId);

      const nextMetrics = metrics.map((metric) => {
        if (metric.id === metricId) {
          return { ...metric, isActive: isSelected };
        }

        return metric;
      });

      onChange("selectedMetricIds", nextSelectedMetricIds);
      onChange("metrics", nextMetrics);
    },
    [metrics, onChange, selectedMetricIds],
  );

  return (
    <PageContainer
      showUserInfo={true}
      alignRoot="flex-start"
      alignItems="flex-start"
      fullWidth={true}
    >
      <Stack sx={{ width: "100%", padding: 2, gap: 3, mb: 2 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 0.5,
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: theme.fonts.weightBold,
                color: theme.palette.textPrimary,
              }}
            >
              Health Connect Integration
            </Typography>
            <Typography sx={{ color: theme.palette.textSecondary, mt: 0.5 }}>
              Connect your health data to get personalized insights.
            </Typography>
          </Box>
          <Box>
            <Avatar
              src={healthConnectLogo}
              alt="Health Connect logo"
              sx={{ width: 100, height: 100 }}
            />
          </Box>
        </Box>
      </Stack>
      <FormContainer
        title="Connection Setup"
        subtitle="Set up your Health Connect integration to import your health data."
        formButtonProps={formButtonProps}
      >
        <StatusListItem
          statusText={statusText}
          status={status}
          divider={true}
        />
        <FormListItemSwitch
          label="Activate Health Connect Integration"
          propertyName="isActive"
          value={isActive}
          disabled={false}
          divider={true}
          onChange={(_, value) => onChange("isActive", value)}
        />
        <DropdownListItem
          maximumWidth={300}
          minimumWidth={300}
          label="Select your provider"
          propertyName="selectedProviderId"
          placeholderLabel="Select a provider"
          options={availableProviders?.map((provider) => ({
            id: provider.id,
            label: provider.name,
          }))}
          value={selectedProviderId}
          disabled={!isActive || availableProviders.length === 0}
          divider={true}
          onChange={(_, value) => onChange("selectedProviderId", value)}
        />
        <MultiSelectDropdownListItem
          maximumWidth={300}
          minimumWidth={300}
          label="Select metrics to track"
          items={metrics}
          selectedItemIds={selectedMetricIds}
          disabled={!isActive || metrics.length === 0}
          onSelectedItem={handleToggleMetric}
          divider={true}
          placeholderLabel="No active metrics available"
        />
        {selectedMetricIds.length > 0 && (
          <FormChipListItem
            items={metrics}
            selectedItemIds={selectedMetricIds}
            onDeleteItem={(itemId) => handleToggleMetric(itemId, false)}
            divider={true}
          />
        )}
        <FormListItemSwitch
          label="Request a initial load (30 days) of all selected metrics on the next sync."
          propertyName="isInitialLoad"
          value={isInitialLoad}
          disabled={!isActive}
          divider={true}
          onChange={(_, value) => onChange("isInitialLoad", value)}
        />
        <LastUpdateAtByListItem
          lastUpdateAt={lastUpdatedAt}
          lastUpdateBy={lastUpdatedBy}
          divider={false}
        />
      </FormContainer>
    </PageContainer>
  );
};

export default HealthConnectPage;
