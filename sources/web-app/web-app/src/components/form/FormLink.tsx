import { Button, ListItem, ListItemText } from "@mui/material";
import React from "react";

type FormLinkProps = {
  label: string;
  description: string;
  onAction: () => void;
};

const FormLink: React.FC<FormLinkProps> = ({
  label,
  description,
  onAction,
}) => {
  return (
    <ListItem>
      <ListItemText primary={description} onClick={onAction} />
      <Button
        size="small"
        sx={{ "&:hover": { backgroundColor: "#ffffff" } }}
        variant="text"
        onClick={onAction}
      >
        {label}
      </Button>
    </ListItem>
  );
};

export default FormLink;
