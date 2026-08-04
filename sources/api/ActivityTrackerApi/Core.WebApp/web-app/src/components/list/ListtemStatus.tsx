import React from "react";
import { ConnectionStatus } from "../../lib/enums/ConnectionStatus";
import { Avatar, ListItem, ListItemText, SvgIconTypeMap } from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type StatusListItemProps = {
  label: string;
  description?: string;
  status: ConnectionStatus;
  divider?: boolean;
  statusColor?: "red" | "yellow" | "green";
  icon:
    | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
      })
    | undefined;
};

const ListItemStatus: React.FC<StatusListItemProps> = (props) => {
  const { label, description, status, icon, divider } = props;

  const statusColor = React.useMemo((): string => {
    switch (status) {
      case ConnectionStatus.Connected:
        return "green";
      case ConnectionStatus.Disconnected:
        return "red";
      case ConnectionStatus.Pending:
        return "orange";
      default:
        return "gray";
    }
  }, [status]);
  return (
    <ListItem
      sx={{ display: "flex", alignItems: "baseline", height: 70 }}
      divider={divider}
    >
      <ListItemText primary={label} secondary={description} />
      <Avatar
        sx={{
          bgcolor: "transparent",
          color: statusColor,
        }}
      >
        {icon ? React.createElement(icon) : null}
      </Avatar>
    </ListItem>
  );
};

export default ListItemStatus;
