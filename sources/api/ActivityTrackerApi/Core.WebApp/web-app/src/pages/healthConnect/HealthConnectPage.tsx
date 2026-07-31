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
import { HealthConnectMetricMapping } from "./types/HealthConnectMetricMapping";
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

  const initialMetrics = React.useMemo((): HealthConnectMetricMapping[] => {
    return configuration.metricMappings ?? [];
  }, [configuration.metricMappings]);

  const { isModified, subscribeValues, onChange, resetForm, updatedModel } =
    useForm<HealthConnectConfiguration>(configuration);

  const { isActive, status, lastUpdatedAt, lastUpdatedBy } = subscribeValues(
    (configuration) => ({
      isActive: configuration.isActive,
      status: configuration.status,

      lastUpdatedAt: configuration.updatedAt,
      lastUpdatedBy: configuration.updatedBy,
    }),
  );

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
