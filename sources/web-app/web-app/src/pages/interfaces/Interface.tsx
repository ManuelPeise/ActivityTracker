import React from "react";
import PageContainer from "../../components/wrappers/PageContainer";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

type ConnectionsTabs = "health-connect" | "google-fit";

const Interface: React.FC = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<ConnectionsTabs>("health-connect");

  const handleSelectTab = React.useCallback((tab: ConnectionsTabs) => {
    setSelectedTab(tab);
  }, []);

  return (
    <PageContainer
      showUserInfo={true}
      alignRoot="flex-start"
      alignItems="flex-start"
      padding={0}
    >
      <Box
        sx={{
          width: "100%",
          height: "98%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: "5rem",
          paddingTop: ".5rem",
          paddingRight: "1rem",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "350px",
          }}
        >
          <List disablePadding sx={{ width: "100%", height: "100%" }}>
            <ListItemButton
              key="health-connect-list-item"
              sx={{ padding: 1 }}
              onClick={() => handleSelectTab("health-connect")}
            >
              <ListItemText
                primary="Health Connect"
                secondary="Connect to your health data"
              />
            </ListItemButton>
            <ListItemButton
              key="google-fit-list-item"
              sx={{ padding: 1 }}
              onClick={() => handleSelectTab("google-fit")}
            >
              <ListItemText
                primary="Google Fit"
                secondary="Connect to your Google Fit data"
              />
            </ListItemButton>
          </List>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ margin: 1 }} />
        <Box sx={{ width: "100%", height: "100%" }}>
          {selectedTab === "health-connect" && (
            <Box sx={{ padding: 2 }}>
              <h2>Health Connect</h2>
            </Box>
          )}
          {selectedTab === "google-fit" && (
            <Box sx={{ padding: 2 }}>
              <h2>Google Fit</h2>
            </Box>
          )}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Interface;
