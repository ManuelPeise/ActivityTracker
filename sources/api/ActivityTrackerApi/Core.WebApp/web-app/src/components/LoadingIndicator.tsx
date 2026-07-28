import React from "react";
import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";

interface LoadingIndicatorProps {
  message: string;
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  isLoading,
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <Backdrop
      open={isLoading}
      sx={{
        color: "#ffffff",
        zIndex: (theme) => theme.zIndex.drawer + 20,
        backgroundColor: "rgba(15, 23, 42, 0.62)",
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <CircularProgress color="inherit" size={38} thickness={4.5} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}>
          {message}
        </Typography>
      </Stack>
    </Backdrop>
  );
};

export default LoadingIndicator;
