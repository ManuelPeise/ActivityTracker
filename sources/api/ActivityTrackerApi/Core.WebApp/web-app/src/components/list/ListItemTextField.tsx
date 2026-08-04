import { ListItem, ListItemText, TextField } from "@mui/material";
import React from "react";

interface ListItemTextFieldProps {
  label: string;
  description?: string;
  value: string;
  disabled?: boolean;
  divider?: boolean;
  onChange: (newValue: string) => void;
}

const ListItemTextField: React.FC<ListItemTextFieldProps> = (props) => {
  const { label, description, value, disabled, divider, onChange } = props;

  return (
    <ListItem divider={divider}>
      <ListItemText primary={label} secondary={description} />
      <TextField
        variant="standard"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </ListItem>
  );
};

export default ListItemTextField;
