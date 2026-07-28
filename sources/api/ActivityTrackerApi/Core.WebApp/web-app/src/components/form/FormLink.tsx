import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import useStyles from "../../hooks/useStyles";

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
  const { theme } = useStyles();

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="body2" sx={{ color: theme.palette.textSecondary }}>
        {description}
      </Typography>
      <Button
        size="small"
        sx={{ textTransform: "none", fontWeight: theme.fonts.weightMedium }}
        variant="text"
        onClick={onAction}
      >
        {label}
      </Button>
    </Stack>
  );
};

export default FormLink;
