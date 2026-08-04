import { ListItem, ListItemText, Switch } from "@mui/material";
import React from "react";

interface ListItemSwitchProps {
  label: string;
  description?: string;
  propertyName: string;
  value: boolean;
  disabled?: boolean;
  divider?: boolean;
  onChange: (key: string, value: boolean) => void;
}

const ListItemSwitch: React.FC<ListItemSwitchProps> = (props) => {
  const {
    label,
    description,
    propertyName,
    value,
    disabled,
    divider,
    onChange,
  } = props;

  return (
    <ListItem divider={divider}>
      <ListItemText primary={label} secondary={description} />
      <Switch
        edge="end"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(propertyName, e.target.checked)}
      />
    </ListItem>
  );
};

export default ListItemSwitch;
