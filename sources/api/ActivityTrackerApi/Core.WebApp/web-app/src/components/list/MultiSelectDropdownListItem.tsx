import {
  Checkbox,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

type MultiSelectItem = {
  id: number;
  name: string;
  isActive: boolean;
};

type MultiSelectListItemProps = {
  minimumWidth: number;
  maximumWidth: number;
  label: string;
  items: MultiSelectItem[];
  selectedItemIds: number[];
  disabled?: boolean;
  divider?: boolean;
  placeholderLabel?: string;
  onSelectedItem: (itemId: number, isSelected: boolean) => void;
};

const MultiSelectDropdownListItem: React.FC<MultiSelectListItemProps> = (
  props,
) => {
  const {
    label,
    items,
    selectedItemIds,
    onSelectedItem,
    divider,
    maximumWidth,
    minimumWidth,
    placeholderLabel,
    disabled,
  } = props;
  const selectedItemIdsAsString = selectedItemIds.map((id) => id.toString());

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const selectedIds = event.target.value as string[];
      const selectedIdSet = new Set(selectedIds.map((id) => Number(id)));

      items.forEach((item) => {
        const isSelected = selectedIdSet.has(item.id);
        const wasSelected = selectedItemIds.includes(item.id);

        if (isSelected !== wasSelected) {
          onSelectedItem(item.id, isSelected);
        }
      });
    },
    [items, onSelectedItem, selectedItemIds],
  );

  return (
    <ListItem divider={divider}>
      <ListItemText primary={label} />
      <Select
        style={{ minWidth: minimumWidth, maxWidth: maximumWidth }}
        labelId="selected-metrics-label"
        displayEmpty
        multiple
        variant="standard"
        value={selectedItemIdsAsString}
        onChange={handleChange}
        renderValue={() => {
          if (selectedItemIds.length === 0) {
            return placeholderLabel || "Select items";
          }
          return `${selectedItemIds?.length ?? 0} selected items`;
        }}
        disabled={disabled}
      >
        {items.map((item) => {
          const isSelected = selectedItemIds.includes(item.id);

          return (
            <MenuItem key={item.id} value={item.id.toString()}>
              <Checkbox checked={isSelected} />
              <ListItemText primary={item.name} />
            </MenuItem>
          );
        })}
      </Select>
    </ListItem>
  );
};

export default MultiSelectDropdownListItem;
