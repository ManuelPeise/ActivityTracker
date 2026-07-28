import React from "react";
import useStyles from "../../hooks/useStyles";
import { ListItem, ListItemText, TextField } from "@mui/material";

interface FormDateFieldProps<TModel> {
  label: string;
  propertyName: keyof TModel;
  value: TModel[keyof TModel];
  placeholder?: string;
  disabled?: boolean;
  onChange: (key: keyof TModel, value: TModel[keyof TModel]) => void;
}

function FormDateField<TModel>(props: FormDateFieldProps<TModel>) {
  const { label, propertyName, value, disabled, onChange, placeholder } = props;

  const { theme } = useStyles();
  return (
    <ListItem
      sx={{
        width: "100%",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: ".1rem",
      }}
    >
      <ListItemText
        slotProps={{
          primary: {
            sx: {
              width: "100%",
              fontSize: theme.fonts.sizeMedium,
              color: theme.fonts.textDark,
            },
          },
        }}
        primary={label}
      />
      <TextField
        sx={{
          width: "100%",
          backgroundColor: "transparent",
          borderRadius: 0,
          "&:hover": {
            borderColor: theme.background.primary,
          },
        }}
        variant="standard"
        type="date"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) =>
          onChange(propertyName, e.target.value as TModel[keyof TModel])
        }
      />
    </ListItem>
  );
}

export default FormDateField;
