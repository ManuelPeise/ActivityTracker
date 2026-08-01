import React from "react";
import PageContainer from "../../components/wrappers/PageContainer";
import { List } from "@mui/material";
import healthConnectLogo from "../../lib/images/Health_Connect_LOGO.svg";
import FormContainer, {
  FormButtonProps,
} from "../../components/form/FormContainer";
import { HealthConnectConfiguration } from "./types/HealthConnectConfiguration";
import LastUpdateAtByListItem from "../../components/list/LastUpdateAtByListItem";
import { useCore } from "../../hooks/useCore";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { ConnectionStatus } from "../../lib/enums/ConnectionStatus";

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

  const healthConnectForm = useCore.createForm<HealthConnectConfiguration>(
    (factory) => [
      factory.createStatusSettings(
        "status",
        "Connection Status",
        statusText,
        PrivacyTipIcon,
        statusColor,
      ),
      factory.createStringFormField(
        "deviceId",
        "Device ID",
        true,
        true,
        false,
        "Your Health Connect Device ID will be set by the system, if the Sync Client App is installed on your mobile device and the Health Connect integration is activated.",
        (value) => typeof value === "string" && value.length > 0,
      ),
      factory.createStringFormField(
        "deviceName",
        "Device Name",
        true,
        true,
        false,
        "Your Health Connect Device Name will be set by the system, if the Sync Client App is installed on your mobile device and the Health Connect integration is activated.",
        (value) => typeof value === "string" && value.length > 0,
      ),
      factory.createBooleanFormField(
        "isActive",
        "Activate your Health Connect Integration",
        true,
        false,
        "Your Health Connect integration must be activated to import your health data.",
        (value) => typeof value === "boolean" && value === true,
      ),
    ],
  );

  const formButtonProps = React.useMemo((): FormButtonProps[] => {
    return [
      {
        label: "Cancel",
        disabled: !healthConnectForm.isModified,
        action: () => healthConnectForm.resetForm(),
      },
      {
        label: "Save Changes",
        disabled: !healthConnectForm.isModified,
        action: async () => {
          await handleUpdateConfiguration({
            ...healthConnectForm.getUpdatedModel(),
          });
        },
      },
    ];
  }, [healthConnectForm, handleUpdateConfiguration]);

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
          disablePadding={false}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {healthConnectForm.fields.map((field) => {
            const onChange = (
              key: keyof HealthConnectConfiguration,
              value: HealthConnectConfiguration[keyof HealthConnectConfiguration],
            ) => {
              healthConnectForm.updateModel({
                [key]: value,
              } as Partial<HealthConnectConfiguration>);
            };

            if (field.type === "text") {
              return (
                <healthConnectForm.components.ListItemTextField
                  key={field.propertyName as string}
                  {...field}
                  value={healthConnectForm.model.deviceId}
                  onChange={(_, value) => onChange("deviceId", value)}
                />
              );
            }

            if (field.type === "boolean") {
              return (
                <healthConnectForm.components.ListItemSwitchField
                  key={field.propertyName as string}
                  {...field}
                  value={healthConnectForm.model.isActive}
                  onChange={(_, value) => onChange("isActive", value)}
                />
              );
            }

            if (field.type === "status") {
              return (
                <healthConnectForm.components.StatusListItem
                  key={field.propertyName as string}
                  {...field}
                  value={healthConnectForm.model.status}
                  onChange={(_, value) => onChange("status", value)}
                />
              );
            }
            return null;
          })}

          <LastUpdateAtByListItem
            lastUpdateAt={configuration.updatedAt}
            lastUpdateBy={configuration.updatedBy}
            divider={false}
          />
        </List>
      </FormContainer>
    </PageContainer>
  );
};

export default HealthConnectPage;
