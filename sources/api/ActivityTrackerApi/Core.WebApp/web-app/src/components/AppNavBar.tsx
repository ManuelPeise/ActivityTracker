import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import React from "react";
import useStyles from "../hooks/useStyles";
import { useTokens } from "../hooks/useTokens";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../hooks/useAuth";
import SideBar from "./SideBar";
import MenuIcon from "@mui/icons-material/Menu";

type AppNavBarProps = {
  showUserInfo: boolean;
};

const AppNavBar: React.FC<AppNavBarProps> = (props) => {
  const { showUserInfo } = props;
  const { theme } = useStyles();
  const { tokenModel } = useTokens();
  const { onLogout } = useAuth();
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const accountAbbreviation = React.useMemo(() => {
    if (!tokenModel?.name) return "";
    const nameParts = tokenModel.name.split(" ");
    return nameParts.map((part) => part[0]).join("");
  }, [tokenModel]);

  return (
    <AppBar sx={{ height: "64px", backgroundColor: "#0f172a" }} position="sticky">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "64px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {showUserInfo && !isDesktop && (
            <IconButton color="inherit" onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography sx={{ color: "#ffffff", fontWeight: theme.fonts.weightBold }}>
            {process.env.REACT_APP_TITLE ?? "Activity Tracker"}
          </Typography>
        </Box>

        <Box sx={{ marginLeft: "auto" }}>
          {showUserInfo && (
            <>
              <IconButton onClick={handleOpen} color="inherit">
                <Avatar
                  sx={{
                    fontSize: theme.fonts.sizeSmall,
                    width: 30,
                    height: 30,
                    bgcolor: "#ffffff",
                    color: theme.palette.textPrimary,
                  }}
                >
                  {accountAbbreviation}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1">
                    {tokenModel?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tokenModel?.emailaddress}
                  </Typography>
                </Box>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleClose();
                    onLogout();
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
      <SideBar
        isOpen={sidebarOpen}
        showSidebar={showUserInfo}
        onClose={() => setSidebarOpen(false)}
      />
    </AppBar>
  );
};

export default AppNavBar;
