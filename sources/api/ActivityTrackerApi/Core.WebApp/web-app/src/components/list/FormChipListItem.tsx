import { Chip, ListItem } from "@mui/material";
import React from "react";

type FormChipItemItem = {
  id: number;
  name: string;
  isActive: boolean;
};

type FormChipContainerProps = {
  items: FormChipItemItem[];
  selectedItemIds?: number[];
  divider?: boolean;
  onDeleteItem?: (itemId: number) => void;
};

const FormChipListItem: React.FC<FormChipContainerProps> = (props) => {
  const { items, selectedItemIds, divider, onDeleteItem } = props;

  const chips = React.useMemo(() => {
    return items.filter((item) => selectedItemIds?.includes(item.id));
  }, [items, selectedItemIds]);

  return (
    <ListItem
      divider={divider}
      sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
    >
      {chips.map((item) => (
        <Chip
          key={item.id}
          size="small"
          sx={{
            fontSize: 13,
            height: 22,
            px: 0.5,
            backgroundColor: "background.paper",
            borderColor: "divider",
            borderWidth: 1,
            borderStyle: "solid",
            color: "text.primary",
            "& .MuiChip-deleteIcon": {
              fontSize: 16,
              marginRight: 0.25,
              marginLeft: 0,
            },
          }}
          label={item.name}
          onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
        />
      ))}
    </ListItem>
  );
};

export default FormChipListItem;
