import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import useStyles from "../hooks/useStyles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { useNavigate } from "react-router-dom";
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface SideBarProps {
  showSidebar: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

type SidebarMenuState = {
  interfaceOpen: boolean;
};

const SideBar: React.FC<SideBarProps> = ({
  isOpen,
  showSidebar,
  onClose,
  onOpen,
}) => {
  const [sidebarMenuState, setSidebarMenuState] =
    React.useState<SidebarMenuState>({ interfaceOpen: false });
  const { theme } = useStyles();
  const navigate = useNavigate();

  const updateSidebarMenuState = React.useCallback(
    (newState: Partial<SidebarMenuState>) => {
      setSidebarMenuState((prevState) => ({ ...prevState, ...newState }));
    },
    [],
  );

  if (!showSidebar) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        backgroundColor: "#000000",
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create("width", {
            duration: theme.transitions.duration.standard,
          }),

        "& .MuiDrawer-paper": {
          width: isOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          backgroundColor: "#000000",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: !isOpen ? "center" : "flex-end",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{
            color: theme.fonts.textLight,
          }}
          onClick={isOpen ? onClose : onOpen}
        >
          {isOpen ? (
            <ArrowBackIosNewIcon
              sx={{
                "&:hover": {
                  color: theme.fonts.disabled,
                },
              }}
            />
          ) : (
            <ArrowForwardIosIcon
              sx={{
                "&:hover": {
                  color: theme.fonts.disabled,
                },
              }}
            />
          )}
        </IconButton>
      </Box>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#000000",
        }}
      >
        <ListItemButton
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => navigate("/")}
        >
          <ListItemIcon>
            <DashboardIcon
              sx={{ color: theme.fonts.textLight, width: 30, height: 30 }}
            />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              sx={{ color: theme.fonts.textLight }}
              primary="Dashboard"
            />
          )}
        </ListItemButton>

        {/* Interfaces */}

        <ListItemButton
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() =>
            updateSidebarMenuState({
              interfaceOpen: !sidebarMenuState.interfaceOpen,
            })
          }
        >
          <ListItemIcon>
            <ImportExportIcon
              sx={{ color: theme.fonts.textLight, width: 30, height: 30 }}
            />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              sx={{ color: theme.fonts.textLight }}
              primary="Interfaces"
            />
          )}
          {isOpen && sidebarMenuState.interfaceOpen && (
            <ExpandLess sx={{ color: theme.fonts.textLight }} />
          )}
          {isOpen && !sidebarMenuState.interfaceOpen && (
            <ExpandMore sx={{ color: theme.fonts.textLight }} />
          )}
        </ListItemButton>

        <Collapse
          in={isOpen && sidebarMenuState.interfaceOpen}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/connections")}
            >
              <ListItemText
                sx={{ color: theme.fonts.textLight }}
                primary="Connections"
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default SideBar;
