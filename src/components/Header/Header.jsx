import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  VideoLibrary as VideoLibraryIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDark, toggleTheme } = useThemeContext();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'all 0.3s ease',
        background: isDark 
          ? 'linear-gradient(145deg, #1A1D24 0%, #0C0F14 100%)' 
          : 'linear-gradient(145deg, #FFFFFF 0%, #FDF6E3 100%)',
        color: isDark ? '#F5F5F5' : '#1A1A1A',
        boxShadow: isDark 
          ? '0 4px 20px rgba(212, 160, 23, 0.3)' 
          : '0 4px 20px rgba(212, 160, 23, 0.15)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <VideoLibraryIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 20, md: 24 } }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          VideoTech Shop
        </Typography>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            fontSize: '1rem',
            display: { xs: 'block', sm: 'none' }
          }}
        >
          VideoTech
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ transition: 'transform 0.2s ease' }}
          >
            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <Chip
            icon={isAdmin ? <AdminIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />}
            label={isAdmin ? 'Admin' : 'Customer'}
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              backgroundColor: isAdmin 
                ? 'rgba(255,255,255,0.2)' 
                : 'rgba(255,255,255,0.15)',
              color: isDark ? '#F5F5F5' : '#1A1A1A',
              '& .MuiChip-icon': { color: isDark ? '#F5F5F5' : '#1A1A1A' },
              fontWeight: 600,
            }}
          />

          <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: isAdmin 
                  ? 'linear-gradient(135deg, #D4A017, #B8860B)' 
                  : 'linear-gradient(135deg, #FF8C00, #DAA520)',
                color: '#1A1A1A',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 2px 12px rgba(212, 160, 23, 0.4)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="600">
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;