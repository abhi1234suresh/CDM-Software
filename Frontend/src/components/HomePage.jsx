import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Stack,
} from '@mui/material';
import {
  FaTachometerAlt,
  FaMicrochip,
  FaFileAlt,
  FaBell,
  FaUsersCog,
  FaCogs,
  FaChartBar,
  FaTruck,
  FaWrench,
  FaShieldAlt,
  FaDatabase,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const [uptime, setUptime] = useState(null);
  const [mineCount, setMineCount] = useState(null);
  const [zoneCount, setZoneCount] = useState(null);
  const [deviceCount, setDeviceCount] = useState(null);
  const [tagCount, setTagCount] = useState(null);

  useEffect(() => {
    const fetchUptime = () => {
      apiClient.get('uptime/', { params: { _t: Date.now() } })
        .then(res => {
          console.log('Uptime API response:', res.data);
          if (res.data.error) {
            setUptime('0h 0m');
            console.warn('Uptime error:', res.data.error);
            return;
          }
          const { hours, minutes, seconds } = res.data.uptime;
          const formattedUptime = `${hours}h ${minutes}m`;
          setUptime(formattedUptime);
          console.log(`Displayed uptime: ${formattedUptime}, seconds: ${seconds}`);
        })
        .catch(err => {
          console.error('Error fetching uptime:', err);
          setUptime('0h 0m');
        });
    };

    const fetchMineAndZoneCount = () => {
      apiClient.get('subsidiaries-table/')
        .then(res => {
          if (res.data.error) {
            setMineCount('0');
            setZoneCount('0');
            console.warn('Subsidiaries table error:', res.data.error);
            return;
          }
          const subsidiaries = res.data.subsidiaries || [];
          const mineCount = subsidiaries.reduce((acc, subsidiary) => {
            return acc + (subsidiary.mines ? subsidiary.mines.length : 0);
          }, 0);
          const zoneCount = subsidiaries.reduce((acc, subsidiary) => {
            return acc + (subsidiary.mines ? subsidiary.mines.reduce((mineAcc, mine) => {
              return mineAcc + (mine.zones ? mine.zones.length : 0);
            }, 0) : 0);
          }, 0);
          setMineCount(mineCount.toString());
          setZoneCount(zoneCount.toString());
        })
        .catch(err => {
          console.error('Error fetching mine and zone counts:', err);
          setMineCount('0');
          setZoneCount('0');
        });
    };

    const fetchDeviceCount = () => {
      apiClient.get('devices/')
        .then(res => {
          if (res.data.error) {
            setDeviceCount('0');
            console.warn('Device count error:', res.data.error);
            return;
          }
          const count = Array.isArray(res.data) ? res.data.length : '0';
          setDeviceCount(count);
        })
        .catch(err => {
          console.error('Error fetching device count:', err);
          setDeviceCount('0');
        });
    };

    const fetchTagCount = () => {
      apiClient.get('tags/')
        .then(res => {
          if (res.data.error) {
            setTagCount('0');
            console.warn('Tag count error:', res.data.error);
            return;
          }
          const count = Array.isArray(res.data) ? res.data.length : '0';
          setTagCount(count);
        })
        .catch(err => {
          console.error('Error fetching tag count:', err);
          setTagCount('0');
        });
    };

    fetchUptime();
    fetchMineAndZoneCount();
    fetchDeviceCount();
    fetchTagCount();
    const uptimeInterval = setInterval(fetchUptime, 5000);
    const countsInterval = setInterval(() => {
      fetchMineAndZoneCount();
      fetchDeviceCount();
      fetchTagCount();
    }, 10000);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(countsInterval);
    };
  }, []);

  const navModules = [
    { icon: <FaTachometerAlt size={20} />, title: 'Dashboard', description: 'Real-time particulate monitoring with analytics', route: '/app/dashboard', color: '#4fc3f7' },
    { icon: <FaMicrochip size={20} />, title: 'Sensor Config', description: 'Configure CDM sensors and Tags', route: '/app/configuration', color: '#66bb6a' },
    { icon: <FaFileAlt size={20} />, title: 'Reports', description: 'Generate and export dust level reports', route: '/app/reports', color: '#ffa726' },
    { icon: <FaBell size={20} />, title: 'Alarms', description: 'Instant alerts for unsafe dust levels', route: '/app/alarms', color: '#ef5350' },
    { icon: <FaUsersCog size={20} />, title: 'User Management', description: 'Manage user roles and access', route: '/app/user-management', color: '#ab47bc' },
    { icon: <FaCogs size={20} />, title: 'Settings', description: 'System configuration and preferences', route: '/app/settings', color: '#26c6da' },
  ];

  const features = [
    { icon: <FaChartBar size={24} />, title: 'Real-Time Monitoring', description: 'Live data visualization', stats: deviceCount !== null ? `${deviceCount} active sensors` : 'Loading...' },
    { icon: <FaMapMarkedAlt size={24} />, title: 'Zone Mapping', description: 'Interactive mine map with dust heatmaps', stats: zoneCount !== null ? `${zoneCount} zones configured` : 'Loading...' },
    { icon: <FaTruck size={24} />, title: 'Dust Suppression', description: 'Automated control for suppression systems', stats: '8 systems connected' },
  ];

  return (
    <Box sx={{
      bgcolor: '#121212',
      color: '#e0e0e0',
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))',
      py: 4,
      pb: 8
    }}>
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Stack spacing={4}>
          {/* Hero Section */}
          <Box sx={{
            textAlign: 'center',
            pt: 4,
            px: { xs: 2, md: 6 }
          }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#ffffff',
                letterSpacing: '0.5px',
                mb: 2,
                lineHeight: 1.2,
                background: 'linear-gradient(90deg, #4fc3f7, #4ff7a5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Coal Dust Monitoring Software
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#b0bec5',
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Advanced SCADA solution for real-time coal dust monitoring, regulatory compliance, and automated suppression control in mining operations.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#4fc3f7',
                  color: '#000',
                  fontWeight: 600,
                  px: 4,
                  border: 'none',
                  '&:hover': {
                    bgcolor: '#42a5f5',
                  }
                }}
                onClick={() => navigate('/app/dashboard')}
              >
                Launch Dashboard
              </Button>
            </Box>
          </Box>

          {/* Stats Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Grid container spacing={2} sx={{ maxWidth: '1200px' }}>
              {[
                { value: uptime || 'Loading...', label: 'Uptime' },
                { value: mineCount !== null ? mineCount : 'Loading...', label: 'Mines Configured' },
                { value: zoneCount !== null ? zoneCount : 'Loading...', label: 'Zones Configured' },
                { value: deviceCount !== null ? deviceCount : 'Loading...', label: 'Sensors Configured' },
                { value: tagCount !== null ? tagCount : 'Loading...', label: 'Tags Available' },
              ].map((stat, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <Card sx={{
                    bgcolor: 'rgba(33, 33, 33, 0.8)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 700,
                        color: '#4fc3f7',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        mb: 1
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: '#b0bec5',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Features Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#ffffff',
              mb: 3,
              textAlign: 'center'
            }}>
              System Features
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    bgcolor: 'rgba(33, 33, 33, 0.8)',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${index % 2 === 0 ? '#4fc3f7' : '#66bb6a'}`,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '10px',
                        bgcolor: 'rgba(79, 195, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4fc3f7',
                        mb: 2
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        fontWeight: 600,
                        color: '#ffffff',
                        mb: 1
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: '#b0bec5',
                        mb: 2,
                        minHeight: '60px'
                      }}>
                        {feature.description}
                      </Typography>
                      <Typography variant="caption" sx={{
                        color: '#4fc3f7',
                        fontWeight: 500
                      }}>
                        {feature.stats}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Modules Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#ffffff',
              mb: 3,
              textAlign: 'center'
            }}>
              Application Modules
            </Typography>

            <Grid container spacing={2}>
              {navModules.map((module, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      bgcolor: 'rgba(33, 33, 33, 0.8)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 20px rgba(${hexToRgb(module.color)}, 0.2)`,
                        borderLeft: `4px solid ${module.color}`
                      }
                    }}
                    onClick={() => navigate(module.route)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '10px',
                          bgcolor: `rgba(${hexToRgb(module.color)}, 0.1)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: module.color,
                          flexShrink: 0
                        }}>
                          {module.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#ffffff',
                            mb: 0.5
                          }}>
                            {module.title}
                          </Typography>
                          <Typography variant="body2" sx={{
                            color: '#b0bec5',
                            fontSize: '0.85rem'
                          }}>
                            {module.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '79, 195, 247';
}

export default HomePage;