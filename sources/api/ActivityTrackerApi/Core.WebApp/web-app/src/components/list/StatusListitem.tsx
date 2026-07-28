import React from "react";
import { ConnectionStatus } from "../../lib/enums/ConnectionStatus";
import { Avatar, ListItem, ListItemText } from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";

type StatusListItemProps = {
  statusText: string;
  status: ConnectionStatus;
  divider?: boolean;
};

const StatusListItem: React.FC<StatusListItemProps> = (props) => {
  const { statusText, status, divider = false } = props;

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
      divider={divider}
      sx={{ display: "flex", justifyContent: "flex-start" }}
    >
      <Avatar
        sx={{ bgcolor: "transparent", width: 24, height: 24, marginRight: 1 }}
      >
        <PrivacyTipIcon style={{ width: 24, height: 24, color: statusColor }} />
      </Avatar>
      <ListItemText primary={statusText} />
    </ListItem>
  );
};

export default StatusListItem;
