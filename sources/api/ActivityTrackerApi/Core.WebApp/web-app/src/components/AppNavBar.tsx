import {
  Avatar,
  Box,
  Divider,
  FormLabel,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import React from "react";
import useStyles from "../hooks/useStyles";
import { useTokens } from "../hooks/useTokens";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../hooks/useAuth";
import SideBar from "./SideBar";

type AppNavBarProps = {
  showUserInfo: boolean;
};

const AppNavBar: React.FC<AppNavBarProps> = (props) => {
  const { showUserInfo } = props;
  const { theme } = useStyles();
  const { tokenModel } = useTokens();
  const { onLogout } = useAuth();
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
    <AppBar
      sx={{ height: "64px", backgroundColor: "#000000" }}
      position="static"
      color="default"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormLabel
            sx={{
              color: theme.fonts.textLight,
              fontWeight: theme.fonts.bold,
              paddingLeft: showUserInfo ? 10 : 0,
            }}
          >
            {process.env.REACT_APP_TITLE}
          </FormLabel>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          {showUserInfo && (
            <>
              <IconButton onClick={handleOpen} color="inherit">
                <Avatar
                  sx={{
                    padding: 1,
                    width: 30,
                    height: 30,
                    bgcolor: theme.background.primary,
                    color: theme.fonts.textDark,
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

                <MenuItem onClick={onLogout}>
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
        onOpen={() => setSidebarOpen(true)}
      />
    </AppBar>
  );
};

export default AppNavBar;
