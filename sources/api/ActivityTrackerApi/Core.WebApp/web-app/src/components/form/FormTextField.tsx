import { TextField } from "@mui/material";
import useStyles from "../../hooks/useStyles";

interface FormTextFieldProps<TModel> {
  label: string;
  propertyName: keyof TModel;
  value: TModel[keyof TModel];
  disabled?: boolean;
  isPassword?: boolean;
  onChange: (key: keyof TModel, value: TModel[keyof TModel]) => void;
}

function FormTextField<TModel>(props: FormTextFieldProps<TModel>) {
  const { label, propertyName, value, disabled, onChange, isPassword } = props;

  const { theme } = useStyles();
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      variant="outlined"
      type={isPassword ? "password" : "text"}
      value={value ?? ""}
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

export default FormTextField;
