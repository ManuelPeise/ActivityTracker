import { ListItem, ListItemText } from "@mui/material";
import React from "react";

interface MappingPlaceholderProps {
  label: string;
  description?: string;
}

const MappingPlaceholderListItem: React.FC<MappingPlaceholderProps> = (
  props,
) => {
  const { label, description } = props;

  return (
    <ListItem>
      <ListItemText primary={label} secondary={description} />
    </ListItem>
  );
};

export default MappingPlaceholderListItem;
