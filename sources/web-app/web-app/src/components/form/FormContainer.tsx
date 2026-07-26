import React, { PropsWithChildren } from "react";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import useStyles from "../../hooks/useStyles";

export type FormButtonProps = {
  label: string;
  disabled?: boolean;
  action: () => void | Promise<void>;
};

interface FormContainerProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  minWidth?: string;
  formButtonProps?: FormButtonProps[];
}

const FormContainer: React.FC<FormContainerProps> = (props) => {
  const { children, title, subtitle, minWidth, formButtonProps } = props;

  const { theme } = useStyles();

  return (
    <List
      sx={{
        width: "100%",
        minWidth: minWidth,
        bgcolor: theme.background.primary,
        borderRadius: theme.borders.radiusSmall,
        opacity: theme.opacity.hover,
        padding: 2,
      }}
    >
      <ListItem>
        <ListItemText
          slotProps={{
            primary: {
              sx: {
                fontWeight: theme.fonts.bold,
                fontSize: theme.fonts.sizeLarge,
                color: theme.fonts.textDark,
              },
            },
            secondary: {
              sx: {
                fontSize: theme.fonts.sizeMedium,
                color: theme.fonts.disabled,
              },
            },
          }}
          primary={title}
          secondary={subtitle}
        />
      </ListItem>
      <ListItem>{children}</ListItem>
      {formButtonProps && (
        <ListItem sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {formButtonProps.map((props, key) => (
            <Button
              variant="text"
              sx={{
                borderRadius: theme.borders.radiusSmall,
                backgroundColor: theme.background.buttonBlue,
                borderWidth: 0,
                border: "none",
                padding: "0.3rem .8rem",
                color: theme.fonts.textLight,
                "&.Mui-disabled": {
                  backgroundColor: theme.background.buttonBlue,
                  opacity: theme.opacity.disabled,
                },
              }}
              key={key}
              onClick={props.action}
              disabled={props.disabled}
            >
              {props.label}
            </Button>
          ))}
        </ListItem>
      )}
    </List>
  );
};

export default FormContainer;
