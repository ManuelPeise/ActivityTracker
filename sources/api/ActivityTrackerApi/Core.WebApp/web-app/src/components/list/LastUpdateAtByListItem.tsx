import { ListItem, ListItemText } from "@mui/material";
import React from "react";
import InfoIcon from "@mui/icons-material/Info";

type LastUpdateAtByListItemProps = {
  lastUpdateAt: string | null;
  lastUpdateBy: string | null;
  divider?: boolean;
};

const LastUpdateAtByListItem: React.FC<LastUpdateAtByListItemProps> = ({
  lastUpdateAt,
  lastUpdateBy,
  divider = true,
}) => {
  const formattedLastUpdateAt = React.useMemo(() => {
    if (!lastUpdateAt) {
      return "N/A";
    }

    const date = new Date(lastUpdateAt);
    return date.toLocaleString();
  }, [lastUpdateAt]);

  if (!lastUpdateAt || !lastUpdateBy) {
    return null;
  }

  return (
    <ListItem
      divider={divider}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <InfoIcon sx={{ fontSize: 24, color: "text.disabled", mr: 0.5 }} />
      <ListItemText
        sx={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.2,
          fontStyle: "italic",
        }}
        primary={`Last update by ${lastUpdateBy || "N/A"} at ${formattedLastUpdateAt}`}
      />
    </ListItem>
  );
};

export default LastUpdateAtByListItem;
