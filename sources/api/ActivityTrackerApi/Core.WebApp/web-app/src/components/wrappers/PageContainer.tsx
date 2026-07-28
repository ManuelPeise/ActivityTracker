import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AppNavBar from "../AppNavBar";

interface PageContainerProps extends PropsWithChildren {
  showUserInfo?: boolean;
  padding?: number;
  alignRoot?: "flex-start" | "center" | "flex-end";
  alignItems?: "flex-start" | "center" | "flex-end";
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const {
    children,
    showUserInfo = false,
    alignRoot = "center",
    alignItems = "center",
    padding = 2,
  } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: alignRoot,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
      }}
    >
      <AppNavBar showUserInfo={showUserInfo} />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: alignItems,
          flex: 1,
          padding: padding,
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;
