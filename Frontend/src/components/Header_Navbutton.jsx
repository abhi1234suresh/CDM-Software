import React, { memo, useState, useEffect, useContext } from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';
import {
  FaUserCog,
  FaPowerOff,
  FaChartBar,
  FaTh,
  FaCog,
  FaHome,
  FaMicrochip,
  FaUser,
  FaClock,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AppBarBackground from "../assets/appBarBackground.jpg";
import CDACLogo from '@assets/CDAC_emblem.png';
import CMERILogo from '@assets/CMERI_emblem.png';

// Colors
const neonBlue = '#00b4d8';
const charcoalGray = '#4A4A4A';
const backgroundDark = '#1a1f25';

const NavButton = memo(({ icon, text, isActive, onClick }) => (
  <button
    className={`btn-modern ${isActive ? 'selected' : ''}`}
    onClick={onClick}
    aria-label={`${text} navigation`}
    style={{
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      backgroundColor: isActive ? 'rgba(0, 183, 255, 0.2)' : 'transparent',
      color: isActive ? neonBlue : '#e0e0e0',
      cursor: 'pointer',
      fontWeight: isActive ? 600 : 500,
      fontSize: '0.95rem',
      fontFamily: "'Roboto', sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? '0 0 0 2px rgba(0, 183, 255, 0.3)' : 'none',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(0, 183, 255, 0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = isActive ? 'rgba(0, 183, 255, 0.2)' : 'transparent';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
      {icon}
    </span>
    <span>{text}</span>
  </button>
));

NavButton.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function UnifiedHeader({
  sidebarOpen,
  setSidebarOpen,
  settingsSidebarOpen,
  setSettingsSidebarOpen,
  activeRoute,
  onLogout,
  setIsManuallyToggled,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isSettingsRoute = location.pathname.startsWith('/app/settings');
  const isConfigurationRoute = location.pathname.startsWith('/app/configuration');

  const handleToggleSidebar = () => {
    setIsManuallyToggled(true);
    if (isSettingsRoute) {
      setSettingsSidebarOpen((prev) => !prev);
      setSidebarOpen(false);
    } else if (isConfigurationRoute) {
      setSidebarOpen((prev) => !prev);
      setSettingsSidebarOpen(false);
    }
  };

  const handleNavigation = (path) => {
    setIsManuallyToggled(false);
    if (path.startsWith('/app/settings')) {
      setSettingsSidebarOpen(true);
      setSidebarOpen(false);
    } else if (path.startsWith('/app/configuration')) {
      setSidebarOpen(true);
      setSettingsSidebarOpen(false);
    } else {
      setSidebarOpen(false);
      setSettingsSidebarOpen(false);
    }
    navigate(path);
  };

  // Home first, Logout last
  const navItems = [
    { text: 'Home', icon: <FaHome />, path: '/app' },
    { text: 'Dashboard', icon: <FaTh />, path: '/app/dashboard' },
    { text: 'Configuration', icon: <FaMicrochip />, path: '/app/configuration' },
    { text: 'Reports', icon: <FaChartBar />, path: '/app/reports' },
    { text: 'User Management', icon: <FaUserCog />, path: '/app/user-management' },
    { text: 'Settings', icon: <FaCog />, path: '/app/settings' },
    { text: 'Logout', icon: <FaPowerOff />, path: '/logout' },
  ];

  return (
    <>
      {/* AppBar Header */}
      <MuiAppBar
        position="fixed"
        sx={{
          height: { xs: '60px', sm: '80px', md: '100px' },
          backgroundColor: 'transparent',
          zIndex: theme.zIndex.drawer + 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Background Image with Blur */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${AppBarBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px)',
            zIndex: -1,
          }}
        />
        <Toolbar
          disableGutters
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: '100%',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Left: Logo and toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {(isSettingsRoute || isConfigurationRoute) && isMobile && (
              <IconButton
                edge="start"
                aria-label="Toggle sidebar"
                onClick={handleToggleSidebar}
                sx={{ color: '#e0e0e0', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <img
              src={CDACLogo}
              alt="CDAC Logo"
              style={{ height: isMobile ? 40 : isTablet ? 50 : 60, objectFit: 'contain' }}
            />
          </Box>

          {/* Center Title */}
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2rem' },
              color: '#e0e0e0',
              fontFamily: "'Montserrat', 'Roboto', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.3,
            }}
          >
            Coal Dust Monitoring Software
          </Typography>

          {/* Right: CMERI Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <img
              src={CMERILogo}
              alt="CMERI Logo"
              style={{ height: isMobile ? 40 : isTablet ? 50 : 60, objectFit: 'contain' }}
            />
          </Box>
        </Toolbar>
      </MuiAppBar>

      {/* Navigation Bar */}
      <Box
        sx={{
          backgroundColor: backgroundDark,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1.5, sm: 2 },
          position: 'fixed',
          top: { xs: '60px', sm: '80px', md: '100px' },
          width: '100%',
          zIndex: 1299,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Left: User Info and Time with Icons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2, md: 3 },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
            }}
          >
            <FaUser style={{ color: '#e0e0e0', fontSize: isMobile ? '0.9rem' : '1rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: '#e0e0e0',
                fontSize: { xs: '0.70rem', sm: '0.80rem', md: '0.90rem' },
                fontWeight: 200,
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {user?.username || 'Guest'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
            }}
          >
            <FaClock style={{ color: '#e0e0e0', fontSize: isMobile ? '0.9rem' : '1rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: '#e0e0e0',
                fontSize: { xs: '0.70rem', sm: '0.80rem', md: '0.90rem' },
                fontWeight: 300,
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {currentTime}
            </Typography>
          </Box>
        </Box>

        {/* Center: Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5, md: 2 },
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            mx: 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start',
            mt: isMobile ? 1 : 0,
          }}
        >
          {navItems.map((item) => (
            <NavButton
              key={item.text}
              icon={item.icon}
              text={item.text}
              isActive={
                item.path === '/app/configuration'
                  ? location.pathname.startsWith('/app/configuration')
                  : item.path === '/app/settings'
                  ? location.pathname.startsWith('/app/settings')
                  : location.pathname === item.path
              }
              onClick={() => {
                if (item.path === '/logout') {
                  onLogout();
                } else {
                  handleNavigation(item.path);
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

UnifiedHeader.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  settingsSidebarOpen: PropTypes.bool.isRequired,
  setSettingsSidebarOpen: PropTypes.func.isRequired,
  activeRoute: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  setIsManuallyToggled: PropTypes.func.isRequired,
};

export default UnifiedHeader;