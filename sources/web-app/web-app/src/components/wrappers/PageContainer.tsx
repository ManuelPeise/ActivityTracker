import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AppNavBar from "../AppNavBar";

interface PageContainerProps extends PropsWithChildren {
  showUserInfo?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { children, showUserInfo = false } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        padding: 0,
        margin: 0,
        backgroundColor: "#f5f5f5",
        boxSizing: "border-box",
      }}
    >
      <AppNavBar showUserInfo={showUserInfo} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;
