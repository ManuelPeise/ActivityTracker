import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useStyles from "../hooks/useStyles";
import { useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 280;

interface SideBarProps {
  showSidebar: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, showSidebar, onClose }) => {
  const { theme } = useStyles();
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("md"));
  const navigate = useNavigate();

  if (!showSidebar) return null;

  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    {
      label: "Health Connect",
      icon: <FavoriteBorderIcon />,
      path: "/health-connect",
    },
    { label: "Sandbox", icon: <FavoriteBorderIcon />, path: "/sandbox" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: "100%", bgcolor: "#0f172a", color: "#ffffff" }}>
      <Box sx={{ px: 2, py: 2.5 }}>
        <Typography sx={{ fontSize: theme.fonts.sizeSmall, opacity: 0.8 }}>
          Navigation
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <List sx={{ px: 1.5, py: 1.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            sx={{
              borderRadius: theme.borders.radiusMedium,
              mb: 0.5,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon sx={{ color: "#ffffff", minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: { sx: { fontSize: theme.fonts.sizeSmall } },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop ? true : isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          border: "none",
          mt: isDesktop ? "64px" : 0,
          height: isDesktop ? "calc(100% - 64px)" : "100%",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SideBar;
