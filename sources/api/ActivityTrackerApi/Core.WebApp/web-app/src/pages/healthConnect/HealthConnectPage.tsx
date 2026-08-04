import React from "react";
import PageContainer from "../../components/wrappers/PageContainer";
import { List } from "@mui/material";
import healthConnectLogo from "../../lib/images/Health_Connect_LOGO.svg";
import FormContainer, {
  FormButtonProps,
} from "../../components/form/FormContainer";
import { HealthConnectConfiguration } from "./types/HealthConnectConfiguration";
import LastUpdateAtByListItem from "../../components/list/LastUpdateAtByListItem";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { ConnectionStatus } from "../../lib/enums/ConnectionStatus";
import { useSimpleForm } from "../../hooks/useSimpleForm";
import ListItemTextField from "../../components/list/ListItemTextField";
import ListItemSwitch from "../../components/list/ListItemSwitch";
import ListItemStatus from "../../components/list/ListtemStatus";
import CollapsibleMetricMappingListItem from "./components/CollapsibleMappingListItem";

type HealthConnectPageProps = {
  configuration: HealthConnectConfiguration;
  handleUpdateConfiguration: (
    updatedConfiguration: HealthConnectConfiguration,
  ) => Promise<void>;
};

const HealthConnectPage: React.FC<HealthConnectPageProps> = (props) => {
  const { configuration, handleUpdateConfiguration } = props;

  const [statusText, statusColor] = React.useMemo((): [
    string,
    "red" | "yellow" | "green",
  ] => {
    switch (configuration.status) {
      case ConnectionStatus.Connected:
        return ["Health Connect service is connected.", "green"];
      case ConnectionStatus.Disconnected:
        return ["Health Connect service is disconnected.", "red"];
      case ConnectionStatus.Pending:
        return [
          "Health Connect service connection is in a pending state, to complete the setup establish the connection with the provided Sync Client App on your mobile device.",
          "yellow",
        ];
      default:
        return ["Unknown", "red"];
    }
  }, [configuration.status]);

  const { formValues, isDirty, resetForm, handleChange, handleArrayChange } =
    useSimpleForm<HealthConnectConfiguration>(
      {
        initialValues: configuration,
      },
      handleUpdateConfiguration,
    );

  const formButtonProps = React.useMemo((): FormButtonProps[] => {
    return [
      {
        label: "Cancel",
        disabled: !isDirty,
        action: () => resetForm(),
      },
      {
        label: "Save Changes",
        disabled: !isDirty,
        action: async () => {
          await handleUpdateConfiguration({
            ...formValues,
          });
        },
      },
    ];
  }, [isDirty, resetForm, formValues, handleUpdateConfiguration]);

  return (
    <PageContainer
      showUserInfo={true}
      alignRoot="flex-start"
      alignItems="flex-start"
      fullWidth={true}
    >
      <FormContainer
        title="Health Connect Setup"
        subtitle="Set up your Health Connect integration to import your health data."
        avatarSrc={healthConnectLogo}
        formButtonProps={formButtonProps}
      >
        <List
          dense
          disablePadding={false}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          <ListItemStatus
            label="Health Connect Service Status"
            description={statusText}
            icon={PrivacyTipIcon}
            statusColor={statusColor}
            status={configuration.status}
            divider={true}
          />
          <ListItemTextField
            label="Client Id"
            description="The unique identifier of the Sync Client App installed on your mobile device, will be set automatically."
            value={formValues.deviceId}
            disabled={true}
            divider={true}
            onChange={(value) => handleChange("deviceId", value)}
          />
          <ListItemTextField
            label="Device ID"
            description="The unique identifier of the Sync Client App installed of your mobile device, will be set automatically."
            value={formValues.deviceId}
            disabled={true}
            divider={true}
            onChange={(value) => handleChange("deviceId", value)}
          />
          <ListItemSwitch
            label="Enable Health Connect"
            description="Enable or disable the Health Connect integration."
            propertyName="enabled"
            value={formValues.isActive}
            disabled={false}
            divider={true}
            onChange={(key, value) =>
              handleChange(key as keyof HealthConnectConfiguration, value)
            }
          />
          <CollapsibleMetricMappingListItem
            type="HealthConnectSourceMapping"
            label="Source Mappings"
            placeholderLabel="No source mappings configured."
            placeholderDescription="Configure the mapping of health data sources from Health Connect to the application."
            mappings={formValues.sourceMappings}
            handleMappingChange={handleArrayChange}
            expanded={false}
            divider={true}
          />
          <CollapsibleMetricMappingListItem
            type="HealthConnectMetricMapping"
            label="Metric Mappings"
            placeholderLabel="No metric mappings configured."
            placeholderDescription="Configure the mapping of health data metrics from Health Connect to the application."
            mappings={formValues.metricMappings}
            handleMappingChange={handleArrayChange}
            expanded={false}
            divider={true}
          />
          <LastUpdateAtByListItem
            lastUpdateAt={formValues.updatedAt}
            lastUpdateBy={formValues.updatedBy}
            divider={false}
          />
        </List>
      </FormContainer>
    </PageContainer>
  );
};

export default HealthConnectPage;
