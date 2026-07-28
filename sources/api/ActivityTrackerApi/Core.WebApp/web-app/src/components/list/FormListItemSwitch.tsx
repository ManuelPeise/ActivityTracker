import { ListItem, ListItemText, Switch } from "@mui/material";
import React from "react";

interface ListItemSwitchProps {
  label: string;
  propertyName: string;
  value: boolean;
  disabled?: boolean;
  divider?: boolean;
  onChange: (key: string, value: boolean) => void;
}

const FormListItemSwitch: React.FC<ListItemSwitchProps> = (props) => {
  const { label, propertyName, value, disabled, divider, onChange } = props;

  return (
    <ListItem divider={divider}>
      <ListItemText primary={label} />
      <Switch
        edge="end"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(propertyName, e.target.checked)}
      />
    </ListItem>
  );
};

export default FormListItemSwitch;
