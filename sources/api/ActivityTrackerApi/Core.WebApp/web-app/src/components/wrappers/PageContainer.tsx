import React, { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import AppNavBar from "../AppNavBar";
import useStyles from "../../hooks/useStyles";

const SIDEBAR_WIDTH = 280;

interface PageContainerProps extends PropsWithChildren {
  showUserInfo?: boolean;
  padding?: number;
  alignRoot?: "flex-start" | "center" | "flex-end";
  alignItems?: "flex-start" | "center" | "flex-end";
  fullWidth?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const {
    children,
    showUserInfo = false,
    alignRoot = "center",
    alignItems = "center",
    padding = 2,
    fullWidth = false,
  } = props;
  const { theme } = useStyles();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        backgroundColor: theme.palette.appBackground,
        boxSizing: "border-box",
      }}
    >
      <AppNavBar showUserInfo={showUserInfo} />
      <Box
        component="main"
        sx={{
          mx: "auto",
          display: "flex",
          justifyContent: alignRoot,
          alignItems: alignItems,
          flex: 1,
          ml: showUserInfo ? { md: `${SIDEBAR_WIDTH}px` } : 0,
          width: showUserInfo
            ? { md: `calc(100% - ${SIDEBAR_WIDTH}px)` }
            : "100%",
          px: theme.spacing.sectionX,
          py: theme.spacing.sectionY,
          pb: { xs: 3, sm: 4 },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: fullWidth ? "none" : "980px",
            p: padding,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PageContainer;
