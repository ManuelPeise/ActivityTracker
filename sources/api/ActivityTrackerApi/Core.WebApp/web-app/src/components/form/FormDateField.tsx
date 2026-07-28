import React from "react";
import useStyles from "../../hooks/useStyles";
import { TextField } from "@mui/material";

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
    <TextField
      fullWidth
      size="small"
      label={label}
      variant="outlined"
      type="date"
      value={value ?? ""}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) =>
        onChange(propertyName, e.target.value as TModel[keyof TModel])
      }
      sx={{
        "& .MuiInputBase-root": {
          borderRadius: theme.borders.radiusMedium,
          backgroundColor: theme.palette.surfaceAlt,
        },
      }}
    />
  );
}

export default FormDateField;
