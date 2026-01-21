import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  LocalHospital as HospitalIcon,
  Bloodtype as BloodIcon,
  Favorite as DonorIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    if (user?.user_type === 'HOSPITAL') {
      return [
        ...commonItems,
        { text: 'Blood Requests', icon: <BloodIcon />, path: '/requests' },
        { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
      ];
    } else if (user?.user_type === 'BLOOD_BANK') {
      return [
        ...commonItems,
        { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
        { text: 'Requests', icon: <NotificationsIcon />, path: '/requests' },
        { text: 'Donors', icon: <PersonIcon />, path: '/donors' },
      ];
    } else if (user?.user_type === 'DONOR') {
      return [
        ...commonItems,
        { text: 'Donation History', icon: <HistoryIcon />, path: '/history' },
        { text: 'Health Info', icon: <PersonIcon />, path: '/health' },
        { text: 'Requests', icon: <NotificationsIcon />, path: '/requests' },
      ];
    }

    return commonItems;
  };

  const getUserIcon = () => {
    switch (user?.user_type) {
      case 'HOSPITAL':
        return <HospitalIcon />;
      case 'BLOOD_BANK':
        return <BloodIcon />;
      case 'DONOR':
        return <DonorIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getUserTypeLabel = () => {
    switch (user?.user_type) {
      case 'HOSPITAL':
        return 'Hospital';
      case 'BLOOD_BANK':
        return 'Blood Bank';
      case 'DONOR':
        return 'Donor';
      default:
        return 'User';
    }
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <BloodIcon sx={{ fontSize: 40, color: '#d32f2f', mr: 1 }} />
        <Typography variant="h6" noWrap>
          BloodChain AI
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#d32f2f' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#d32f2f',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getUserTypeLabel()} Dashboard
          </Typography>
          
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: 'white', color: '#d32f2f' }}>
              {getUserIcon()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default Layout;