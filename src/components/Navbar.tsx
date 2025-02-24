import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  BarChart as AnalyticsIcon,
  Brightness4,
  Brightness7,
  NotificationsActive as ReminderIcon,
  Flag as GoalIcon,
  Calculate as CalculatorIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';

const pages = [
  { name: 'Dashboard', icon: <DashboardIcon sx={{ mr: 1 }} />, path: '/' },
  { name: 'Transactions', icon: <ReceiptIcon sx={{ mr: 1 }} />, path: '/transactions' },
  { name: 'Analytics', icon: <AnalyticsIcon sx={{ mr: 1 }} />, path: '/analytics' },
  { name: 'Reminders', icon: <ReminderIcon sx={{ mr: 1 }} />, path: '/reminders' },
  { name: 'Goals', icon: <GoalIcon sx={{ mr: 1 }} />, path: '/goals' },
  { name: 'Calculator', icon: <CalculatorIcon sx={{ mr: 1 }} />, path: '/calculator' },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            FINTRACK
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleNavigation(page.path)}>
                  {page.icon}
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            FINTRACK
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{
                  my: 2,
                  mx: 1,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {page.icon}
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Theme Toggle */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={() => dispatch(toggleTheme())} sx={{ mr: 2 }}>
              {theme.palette.mode === 'dark' ? (
                <Brightness7 sx={{ color: 'text.primary' }} />
              ) : (
                <Brightness4 sx={{ color: 'text.primary' }} />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 