import React from "react";
import { FormField } from "../factories/formFieldFactory";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  ListItem,
  ListItemText,
  Switch,
  TextField,
} from "@mui/material";

type FormFieldProps<TModel> = FormField<TModel> & {
  value: TModel[keyof TModel] | null | undefined;
  isPassword?: boolean;
  onChange?: (key: keyof TModel, value: TModel[keyof TModel]) => void;
};

export type FormFieldComponents = {
  TextField: <TModel>(props: FormFieldProps<TModel>) => React.ReactElement;
  ListItemTextField: <TModel>(
    props: FormFieldProps<TModel>,
  ) => React.ReactElement;
  NumberField: <TModel>(props: FormFieldProps<TModel>) => React.ReactElement;
  ListItemNumberField: <TModel>(
    props: FormFieldProps<TModel>,
  ) => React.ReactElement;
  CheckboxField: <TModel>(props: FormFieldProps<TModel>) => React.ReactElement;
  ListItemCheckboxField: <TModel>(
    props: FormFieldProps<TModel>,
  ) => React.ReactElement;
  SwitchField: <TModel>(props: FormFieldProps<TModel>) => React.ReactElement;
  ListItemSwitchField: <TModel>(
    props: FormFieldProps<TModel>,
  ) => React.ReactElement;
  StatusListItem: <TModel>(props: FormFieldProps<TModel>) => React.ReactElement;
};

function formTextfield<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const {
    propertyName,
    isPassword,
    label,
    value,
    required,
    disabled,
    onChange,
    validationCallback,
  } = props;

  const isHighlighted =
    validationCallback && value != null
      ? !validationCallback(value as TModel[keyof TModel])
      : false;

  return (
    <TextField
      key={propertyName as string}
      type={isPassword ? "password" : "text"}
      variant="standard"
      label={label}
      required={required}
      disabled={disabled}
      onChange={(event) =>
        onChange?.(propertyName, event.target.value as TModel[keyof TModel])
      }
      value={value ?? ""}
      error={isHighlighted}
      slotProps={{
        htmlInput: {
          style: { textAlign: "left" },
        },
      }}
    />
  );
}

function formListItemTextField<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const formTextfieldProps = {
    ...props,
    label: undefined,
  };

  const errorMessage =
    props.validationCallback &&
    props.required &&
    !props.validationCallback(props.value as TModel[keyof TModel])
      ? props.message
      : undefined;

  return (
    <ListItem
      sx={{ display: "flex", alignItems: "baseline", height: 70 }}
      key={props.propertyName as string}
      divider
    >
      <ListItemText
        primary={props.required ? `${props.label} *` : props.label}
        secondary={errorMessage}
      />
      {formTextfield(formTextfieldProps)}
    </ListItem>
  );
}

function formNumberfield<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const {
    propertyName,
    type,
    label,
    value,
    required,
    disabled,
    onChange,
    validationCallback,
  } = props;

  const isHighlighted =
    validationCallback && value != null
      ? !validationCallback(value as TModel[keyof TModel])
      : false;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const newValue = rawValue === "" ? null : Number(rawValue);

    if (newValue === null || !Number.isNaN(newValue)) {
      onChange?.(propertyName, newValue as TModel[keyof TModel]);
    }
  };

  return (
    <TextField
      key={propertyName as string}
      type={type}
      variant="standard"
      label={label}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      value={value ?? ""}
      error={isHighlighted}
      slotProps={{
        htmlInput: {
          inputMode: "decimal",
          style: { textAlign: "right" },
        },
      }}
    />
  );
}

function formListItemNumberField<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const formNumberfieldProps = {
    ...props,
    label: undefined,
  };

  const errorMessage =
    props.validationCallback &&
    props.required &&
    !props.validationCallback(props.value as TModel[keyof TModel])
      ? props.message
      : undefined;

  return (
    <ListItem
      sx={{ display: "flex", alignItems: "baseline", height: 70 }}
      key={props.propertyName as string}
      divider
    >
      <ListItemText
        primary={props.required ? `${props.label} *` : props.label}
        secondary={errorMessage}
      />
      {formNumberfield(formNumberfieldProps)}
    </ListItem>
  );
}

function formCheckboxfield<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const {
    propertyName,
    label,
    value,
    required,
    disabled,
    onChange,
    validationCallback,
  } = props;

  const isHighlighted =
    validationCallback && required && value != null
      ? !validationCallback(value as TModel[keyof TModel])
      : false;

  return (
    <FormGroup key={propertyName as string}>
      <FormControlLabel
        key={propertyName as string}
        required={required}
        control={
          <Checkbox
            checked={Boolean(value)}
            required={required}
            disabled={disabled}
            onChange={(event) =>
              onChange?.(
                propertyName,
                event.target.checked as TModel[keyof TModel],
              )
            }
          />
        }
        label={label}
      />
      {isHighlighted && <ListItemText secondary={props.message} />}
    </FormGroup>
  );
}

function formListItemCheckboxField<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const formCheckboxfieldProps = {
    ...props,
    label: undefined,
  };
  return (
    <ListItem
      key={props.propertyName as string}
      sx={{ display: "flex", alignItems: "baseline", height: 70 }}
      divider
    >
      <ListItemText primary={props.label} secondary={props.message} />
      {formCheckboxfield(formCheckboxfieldProps)}
    </ListItem>
  );
}

function formSwitchfield<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const { propertyName, label, value, required, disabled, onChange } = props;

  const hasVisibleLabel = Boolean(label);
  const isRequiredForControl = Boolean(required && hasVisibleLabel);

  return (
    <FormGroup key={propertyName as string}>
      <FormControlLabel
        key={propertyName as string}
        control={
          <Switch
            checked={Boolean(value)}
            required={isRequiredForControl}
            disabled={disabled}
            onChange={(event) =>
              onChange?.(
                propertyName,
                event.target.checked as TModel[keyof TModel],
              )
            }
          />
        }
        label={label}
      />
    </FormGroup>
  );
}

function formListItemSwitchField<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const switchProps = {
    ...props,
    label: undefined,
  };

  const errorMessage =
    props.validationCallback &&
    props.required &&
    !props.validationCallback(props.value as TModel[keyof TModel])
      ? props.message
      : undefined;

  return (
    <ListItem
      sx={{ display: "flex", alignItems: "baseline", height: 70 }}
      key={props.propertyName as string}
      divider
    >
      <ListItemText
        primary={props.required ? `${props.label} *` : props.label}
        secondary={errorMessage}
      />
      {formSwitchfield(switchProps)}
    </ListItem>
  );
}

function formStatusListItem<TModel>(
  props: FormFieldProps<TModel>,
): React.ReactElement {
  const { propertyName, label, message, avatarSrc, statusColor } = props;
  const StatusAvatar = avatarSrc ? React.createElement(avatarSrc) : null;

  return (
    <ListItem
      sx={{ display: "flex", alignItems: "baseline", height: 70 }}
      key={propertyName as string}
      divider
    >
      <ListItemText primary={label} secondary={message} />
      <Avatar
        sx={{
          bgcolor: "transparent",
          color: statusColor,
        }}
      >
        {StatusAvatar}
      </Avatar>
    </ListItem>
  );
}

export const formFields: FormFieldComponents = {
  TextField: formTextfield,
  ListItemTextField: formListItemTextField,
  NumberField: formNumberfield,
  ListItemNumberField: formListItemNumberField,
  CheckboxField: formCheckboxfield,
  ListItemCheckboxField: formListItemCheckboxField,
  SwitchField: formSwitchfield,
  ListItemSwitchField: formListItemSwitchField,
  StatusListItem: formStatusListItem,
};
