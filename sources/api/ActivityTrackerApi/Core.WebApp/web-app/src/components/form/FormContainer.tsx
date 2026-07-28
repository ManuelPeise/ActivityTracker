import React, { PropsWithChildren } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
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
    <Card
      sx={{
        width: "100%",
        minWidth: minWidth,
        borderRadius: theme.borders.radiusLarge,
        boxShadow: theme.shadows.card,
        bgcolor: theme.palette.surface,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              sx={{
                fontSize: theme.fonts.sizeLarge,
                fontWeight: theme.fonts.weightBold,
                color: theme.palette.textPrimary,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: theme.fonts.sizeSmall,
                  color: theme.palette.textSecondary,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {children}
          </Box>

          {formButtonProps && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "flex-end", flexWrap: "wrap", rowGap: 1 }}
            >
              {formButtonProps.map((button) => (
                <Button
                  key={button.label}
                  variant="contained"
                  size="small"
                  onClick={button.action}
                  disabled={button.disabled}
                  sx={{
                    minWidth: 110,
                    height: 36,
                    px: 1.75,
                    borderRadius: theme.borders.radiusMedium,
                    textTransform: "none",
                    fontSize: theme.fonts.sizeSmall,
                    fontWeight: theme.fonts.weightMedium,
                    boxShadow: "none",
                    bgcolor: theme.palette.accent,
                    "&:hover": { bgcolor: theme.palette.accentHover },
                  }}
                >
                  {button.label}
                </Button>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FormContainer;
