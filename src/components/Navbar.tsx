import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Home,
  VpnKey,
  Rocket,
  Subscriptions,
  Security,
  Menu as MenuIcon,
  Close,
  Circle,
  MenuBook,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Home />, color: '#1e3c72' },
    { path: '/how-to-use', label: 'How to Use', icon: <MenuBook />, color: '#0ea5e9' },
    { path: '/keys', label: 'Key Generator', icon: <VpnKey />, color: '#2a5298' },
    { path: '/deployment', label: 'Deployment', icon: <Rocket />, color: '#1e40af' },
    { path: '/subscribe', label: 'ONDC Subscribe', icon: <Subscriptions />, color: '#1d4ed8' },
    { path: '/headers', label: 'Auth Headers', icon: <Security />, color: '#0ea5e9' },

  ];

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#1e293b',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Enhanced Logo and Title */}
          <Fade in timeout={800}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                transition: 'transform 0.3s ease',
              }}
              onClick={() => navigate('/')}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: '#0ea5e9',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                Q
              </Avatar>
              <Box>
                                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: '#1e293b',
                      letterSpacing: '-0.5px',
                      lineHeight: 1.2,
                    }}
                  >
                    ONDC QuickSubscribe
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      letterSpacing: '0.25px',
                    }}
                  >
                    Automated Onboarding
                  </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Desktop Navigation Menu */}
          {!isMobile && (
            <Fade in timeout={1000}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {menuItems.map((item, index) => (
                  <Fade in timeout={1200 + index * 100} key={item.path}>
                    <Tooltip title={item.label} arrow>
                      <Button
                        color="inherit"
                        startIcon={item.icon}
                        onClick={() => navigate(item.path)}
                        sx={{
                          backgroundColor: isActive(item.path) 
                            ? '#f1f5f9' 
                            : 'transparent',
                          color: isActive(item.path) ? '#0ea5e9' : '#64748b',
                          border: isActive(item.path) 
                            ? '1px solid #e2e8f0' 
                            : '1px solid transparent',
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                            color: '#0ea5e9',
                            border: '1px solid #e2e8f0',
                          },
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          fontWeight: isActive(item.path) ? 600 : 500,
                          fontSize: '0.875rem',
                          textTransform: 'none',
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {item.label}
                      </Button>
                    </Tooltip>
                  </Fade>
                ))}

              </Box>
            </Fade>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={handleMobileMenuOpen}
              sx={{
                color: '#64748b',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#0ea5e9',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {mobileMenuAnchor ? <Close /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 250,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '& .MuiMenuItem-root': {
                  color: '#64748b',
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    color: '#0ea5e9',
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  backgroundColor: isActive(item.path) 
                    ? '#f1f5f9 !important' 
                    : 'transparent',
                  color: isActive(item.path) ? '#0ea5e9 !important' : '#64748b',
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.icon}
                  <Typography variant="body2">{item.label}</Typography>
                  {isActive(item.path) && (
                    <Circle sx={{ fontSize: 6, color: '#0ea5e9', ml: 'auto' }} />
                  )}
                </Box>
              </MenuItem>
            ))}

          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 