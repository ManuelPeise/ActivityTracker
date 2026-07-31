import {
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

export type DropDownItemOption = {
  id: number;
  label: string;
  disabled?: boolean;
};

type DropdownListItemProps = {
  minimumWidth: number;
  maximumWidth: number;
  label: string;
  propertyName: string;
  placeholderLabel: string;
  value: string | number;
  options: DropDownItemOption[];
  disabled?: boolean;
  divider?: boolean;
  onChange: (key: string, value: number) => void;
};

const DropdownListItem: React.FC<DropdownListItemProps> = (props) => {
  const {
    minimumWidth,
    maximumWidth,
    label,
    propertyName,
    placeholderLabel,
    value,
    options,
    disabled,
    divider,
    onChange,
  } = props;

  const normalizedValue = value?.toString() ?? "";

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedOption = options.find(
        (option) => option.id.toString() === event.target.value,
      );

      onChange(propertyName, selectedOption?.id ?? 0);
    },
    [onChange, options, propertyName],
  );

  return (
    <ListItem divider={divider}>
      <ListItemText primary={label} />
      <Select
        size="small"
        displayEmpty
        value={normalizedValue}
        disabled={disabled}
        onChange={handleChange}
        sx={{ minWidth: minimumWidth, maxWidth: maximumWidth }}
        variant="standard"
        renderValue={(selectedValue) => {
          if (!selectedValue) {
            return placeholderLabel;
          }

          const selectedOption = options.find(
            (option) => option.id.toString() === selectedValue,
          );

          return selectedOption?.label ?? placeholderLabel;
        }}
      >
        {placeholderLabel && (
          <MenuItem value="" disabled>
            {placeholderLabel ?? ""}
          </MenuItem>
        )}
        {options &&
          options.map((option) => (
            <MenuItem
              key={option.id.toString()}
              value={option.id.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </ListItem>
  );
};

export default DropdownListItem;
