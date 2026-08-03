// Layout.jsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../apiClient';
import UnifiedHeader from '@components/Header_Navbutton';
import LogoutDialog from '@components/LogoutDialog';


function Layout({
  selectedSubsidiary,
  setSelectedSubsidiary,
  sidebarOpen,
  setSidebarOpen,
  settingsSidebarOpen,
  setSettingsSidebarOpen,
  username,
  selectedMine,
  setSelectedMine,
}) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedForm, setSelectedForm] = useState(null);
  const [configKey, setConfigKey] = useState(0);
  const [lastForm, setLastForm] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [formNodeType, setFormNodeType] = useState(null);
  const [formNodeData, setFormNodeData] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const isWelcomeCardsRoute = location.pathname === '/app' && !formNodeType;
  const isSettingsRoute = location.pathname.startsWith('/app/settings');
  const isConfigurationRoute = location.pathname.startsWith('/app/configuration');
  const isRootConfigurationRoute = location.pathname === '/app/configuration';
  const isSubsidiaryDetailsRoute = location.pathname.match(/^\/app\/configuration\/subsidiary\/\d+$/);

  const headerHeights = {
    xs: 80 + 64,
    sm: 90 + 64,
    md: 100 + 64,
  };

  const footerHeight = '1rem';

  useEffect(() => {
    const savedDeviceId = localStorage.getItem('selectedDeviceId');
    if (savedDeviceId && isConfigurationRoute && !isSubsidiaryDetailsRoute) {
      const deviceId = parseInt(savedDeviceId);
      if (!isNaN(deviceId)) {
        console.log('Restoring device from localStorage:', deviceId);
        fetchDevice(deviceId);
      } else {
        console.warn('Invalid deviceId in localStorage:', savedDeviceId);
        localStorage.removeItem('selectedDeviceId');
        setError('Invalid device ID stored. Please select a device again.');
        setTimeout(() => setError(null), 5000);
      }
    }
  }, [isConfigurationRoute, isSubsidiaryDetailsRoute]);

  useEffect(() => {
    if (selectedDevice && selectedDevice.id) {
      console.log('Saving selectedDevice to localStorage:', selectedDevice.id);
      localStorage.setItem('selectedDeviceId', selectedDevice.id);
    } else {
      console.log('Clearing selectedDevice from localStorage');
      localStorage.removeItem('selectedDeviceId');
    }
  }, [selectedDevice]);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialRender(false);
    }, 0);
  }, []);

  useEffect(() => {
    console.log('Layout: Sidebar States:', {
      sidebarOpen,
      settingsSidebarOpen,
      isSettingsRoute,
      isConfigurationRoute,
      isWelcomeCardsRoute,
      isSubsidiaryDetailsRoute,
      location: location.pathname,
      marginLeft: isConfigurationRoute
        ? sidebarOpen ? '280px' : '72px'
        : isSettingsRoute
        ? settingsSidebarOpen ? '280px' : '72px'
        : '0px',
    });
  }, [sidebarOpen, settingsSidebarOpen, isSettingsRoute, isConfigurationRoute, isWelcomeCardsRoute, isSubsidiaryDetailsRoute, location.pathname]);

  useEffect(() => {
    console.log('Route changed:', location.pathname);
    if (!isManuallyToggled) {
      if (isSettingsRoute) {
        console.log('Opening settings sidebar, closing configuration sidebar');
        setSettingsSidebarOpen(true);
        setSidebarOpen(false);
        setSelectedForm(null);
        setFormNodeType(null);
        setFormNodeData(null);
        setIsDeleted(false);
        setIsEditing(false);
      } else if (isConfigurationRoute) {
        console.log('Opening configuration sidebar, closing settings sidebar');
        setSidebarOpen(true);
        setSettingsSidebarOpen(false);
      } else {
        console.log('Closing both sidebars for non-sidebar route');
        setSidebarOpen(false);
        setSettingsSidebarOpen(false);
        setSelectedForm(null);
        setFormNodeType(null);
        setFormNodeData(null);
        setIsDeleted(false);
        setIsEditing(false);
        setSelectedSubsidiary(null);
        setSelectedMine(null);
        setSelectedZone(null);
        setSelectedDevice(null);
        setSelectedTag(null);
        setSelectedItemId(null);
      }
    }
  }, [isSettingsRoute, isConfigurationRoute, isManuallyToggled, location.pathname]);

  const fetchSubsidiaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/subsidiaries-table/');
      setSubsidiaries(response.data.subsidiaries || []);
    } catch (err) {
      console.error('Error fetching subsidiaries:', err);
      setError('Failed to load subsidiaries. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDevice = useCallback(async (deviceId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/devices/${deviceId}/`);
      console.log('Fetched device:', response.data);
      setSelectedDevice(response.data);
      navigate(`/app/configuration/device/${deviceId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching device:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage =
        err.response?.status === 404
          ? 'Device not found. Please select a different device.'
          : err.response?.status === 401
          ? 'Unauthorized access. Please log in again.'
          : 'Failed to load device details. Please try again later.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
      localStorage.removeItem('selectedDeviceId');
      setSelectedDevice(null);
      navigate('/app/configuration');
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isConfigurationRoute) {
      fetchSubsidiaries();
    }
  }, [isConfigurationRoute, fetchSubsidiaries, configKey, isDeleted]);

  useEffect(() => {
    if (isDeleted && isConfigurationRoute && !isSubsidiaryDetailsRoute) {
      setSelectedSubsidiary(null);
      setSelectedMine(null);
      setSelectedZone(null);
      setSelectedDevice(null);
      setSelectedTag(null);
      setSelectedForm(null);
      setFormNodeType(null);
      setFormNodeData(null);
      setSelectedItemId(null);
      setConfigKey((prevKey) => prevKey + 1);
      setIsEditing(false);
      localStorage.removeItem('selectedDeviceId');
      navigate('/app/configuration');
    }
  }, [isDeleted, isConfigurationRoute, isSubsidiaryDetailsRoute, navigate]);

  const toggleExpand = useCallback((id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleFormSelection = useCallback(
    (form) => {
      setFormLoading(true);
      setSelectedSubsidiary(null);
      setSelectedMine(null);
      setSelectedZone(null);
      setSelectedDevice(null);
      setSelectedTag(null);
      setSelectedItemId(null);
      setLastForm(form);
      setSelectedForm(form);
      setConfigKey((prevKey) => prevKey + 1);
      setFormNodeType(null);
      setFormNodeData(null);
      setIsDeleted(false);
      setIsEditing(false);
      localStorage.removeItem('selectedDeviceId');
      navigate('/app/configuration');
      setTimeout(() => setFormLoading(false), 100);
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    setLogoutDialogOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    setLogoutDialogOpen(false);
    setTimeout(() => {
      alert('You have been logged out successfully!');
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }, 100);
  }, [navigate]);

  const handleCancelLogout = useCallback(() => {
    setLogoutDialogOpen(false);
  }, []);

  const handleSelectionAndCloseSidebar = useCallback(
    (setter, nodeType, route) => (value) => {
      if (!value || !value.id) {
        console.error(`❌ Invalid ${nodeType} data:`, value);
        return;
      }
      if (nodeType !== 'Subsidiary') {
        // Do not reset selectedSubsidiary for non-subsidiary selections
        setSelectedMine(null);
        setSelectedZone(null);
        setSelectedDevice(null);
        setSelectedTag(null);
      }
      setIsEditing(false);
      setter(value);
      setSelectedForm(null);
      setFormNodeType(null); 
      setFormNodeData(null);
      setIsDeleted(false);
      navigate(`/app/configuration/${route.toLowerCase()}/${value.id}`);
    },
    [navigate]
  );

  const handleAddForm = useCallback(
    (nodeType, nodeData) => {
      setFormLoading(true);
      setSelectedSubsidiary(null);
      setSelectedMine(null);
      setSelectedZone(null);
      setSelectedDevice(null);
      setSelectedTag(null);
      setSelectedItemId(null);
      setIsDeleted(false);
      setIsEditing(false);

      let formType = null;
      switch (nodeType) {
        case 'subsidiary':
          formType = 'addSubsidiary';
          break;
        case 'mine':
          formType = 'addMine';
          break;
        case 'zone':
          formType = 'addZone';
          break;
        case 'device':
          formType = 'addDevice';
          break;
        case 'tag':
          formType = 'addTag';
          break;
        default:
          formType = null;
      }

      setSelectedForm(formType);
      setLastForm(formType);
      setConfigKey((prevKey) => prevKey + 1);
      setFormNodeType(['mine', 'zone', 'device', 'tag'].includes(nodeType) ? nodeType : null);
      setFormNodeData(['mine', 'zone', 'device', 'tag'].includes(nodeType) ? nodeData : null);
      localStorage.removeItem('selectedDeviceId');
      navigate('/app/configuration');
      setTimeout(() => setFormLoading(false), 100);
    },
    [navigate]
  );

  const handleEditForm = useCallback(
    (nodeType, nodeData) => {
      setFormLoading(true);
      setSelectedSubsidiary(null);
      setSelectedMine(null);
      setSelectedZone(null);
      setSelectedDevice(null);
      setSelectedTag(null);
      setSelectedItemId(null);
      setIsDeleted(false);
      setIsEditing(true);

      setFormNodeType(nodeType);
      setFormNodeData(nodeData);
      setSelectedForm(null);
      setConfigKey((prevKey) => prevKey + 1);
      localStorage.removeItem('selectedDeviceId');
      navigate('/app/configuration');
      setTimeout(() => setFormLoading(false), 100);
    },
    [navigate]
  );

  const handleSettingsAddForm = useCallback(
    (formType) => {
      setFormLoading(true);
      setFormNodeType(formType);
      setFormNodeData(null);
      setSelectedForm(null);
      setIsDeleted(false);
      setIsEditing(false);
      localStorage.removeItem('selectedDeviceId');
      navigate('/app/settings');
      setTimeout(() => setFormLoading(false), 100);
    },
    [navigate]
  );

  const handleFormClose = useCallback(
    () => {
      setFormLoading(true);
      setFormNodeType(null);
      setFormNodeData(null);
      setSelectedForm(null);
      setSelectedSubsidiary(null);
      setSelectedMine(null);
      setSelectedZone(null);
      setSelectedDevice(null);
      setSelectedTag(null);
      setSelectedItemId(null);
      setConfigKey((prevKey) => prevKey + 1);
      setIsDeleted(false);
      setIsEditing(false);
      localStorage.removeItem('selectedDeviceId');
      navigate(location.pathname.startsWith('/app/settings') ? '/app/settings' : '/app/configuration');
      setTimeout(() => setFormLoading(false), 100);
    },
    [navigate, location.pathname]
  );

  const handleTagDelete = useCallback(() => {
    setSelectedTag(null);
    setSelectedItemId(null);
    setConfigKey((prevKey) => prevKey + 1);
    setIsDeleted(true);
    setIsEditing(false);
    localStorage.removeItem('selectedDeviceId');
    navigate('/app/configuration');
  }, [navigate]);

  const handleShowConfigDetails = useCallback(() => {
    setSelectedSubsidiary(null);
    setSelectedMine(null);
    setSelectedZone(null);
    setSelectedDevice(null);
    setSelectedTag(null);
    setSelectedForm(null);
    setFormNodeType(null);
    setFormNodeData(null);
    setSelectedItemId(null);
    setIsDeleted(true);
    setIsEditing(false);
    localStorage.removeItem('selectedDeviceId');
    navigate('/app/configuration');
  }, [navigate]);

  const outletContext = useMemo(
    () => ({
      selectedSubsidiary,
      setSelectedSubsidiary,
      selectedMine,
      setSelectedMine,
      selectedZone,
      setSelectedZone,
      selectedDevice,
      setSelectedDevice,
      selectedTag,
      setSelectedTag,
      sidebarOpen,
      setSidebarOpen,
      settingsSidebarOpen,
      setSettingsSidebarOpen,
      username,
      fetchSubsidiaries,
      fetchDevice,
      isEditMode,
      setIsEditMode,
      isRunning,
      setIsRunning
    }),
    [
      selectedSubsidiary,
      setSelectedSubsidiary,
      selectedMine,
      setSelectedMine,
      selectedZone,
      setSelectedZone,
      selectedDevice,
      setSelectedDevice,
      selectedTag,
      setSelectedTag,
      sidebarOpen,
      setSidebarOpen,
      settingsSidebarOpen,
      setSettingsSidebarOpen,
      username,
      fetchSubsidiaries,
      fetchDevice,
      isEditMode,      // ✅ In dependencies
      setIsEditMode,   // ✅ In dependencies 
      isEditMode,
      isRunning,
    ]
  );

  return (
    <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <LogoutDialog
        open={logoutDialogOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      <UnifiedHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        settingsSidebarOpen={settingsSidebarOpen}
        setSettingsSidebarOpen={setSettingsSidebarOpen}
        activeRoute={location.pathname}
        onLogout={handleLogout}
        setIsManuallyToggled={setIsManuallyToggled}
      />
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          width: '100%',
          height: {
            xs: `calc(100vh - ${headerHeights.xs}px - ${footerHeight})`,
            sm: `calc(100vh - ${headerHeights.sm}px - ${footerHeight})`,
            md: `calc(100vh - ${headerHeights.md}px - ${footerHeight})`,
          },
          minHeight: '300px',
          maxHeight: {
            xs: `calc(100vh - ${headerHeights.xs}px - ${footerHeight})`,
            sm: `calc(100vh - ${headerHeights.sm}px - ${footerHeight})`,
            md: `calc(100vh - ${headerHeights.md}px - ${footerHeight})`,
          },
          position: 'relative',
          marginTop: {
            xs: `${headerHeights.xs}px`,
            sm: `${headerHeights.sm}px`,
            md: `${headerHeights.md}px`,
          },
          overflow: 'hidden',
        }}
      >
        {isConfigurationRoute && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            username={username}
            setSelectedSubsidiary={handleSelectionAndCloseSidebar(setSelectedSubsidiary, 'Subsidiary', 'subsidiary')}
            setSelectedMine={handleSelectionAndCloseSidebar(setSelectedMine, 'Mine', 'mine')}
            setSelectedZone={handleSelectionAndCloseSidebar(setSelectedZone, 'Zone', 'zone')}
            setSelectedDevice={handleSelectionAndCloseSidebar(setSelectedDevice, 'Device', 'device')}
            setSelectedTag={handleSelectionAndCloseSidebar(setSelectedTag, 'Tag', 'tag')}
            onAddForm={handleAddForm}
            onEditForm={handleEditForm}
            onTagDelete={handleTagDelete}
            showSubsidiaryTree={isConfigurationRoute}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            setIsDeleted={setIsDeleted}
            onShowConfigDetails={handleShowConfigDetails}
          />
        )}
        {isSettingsRoute && (
          <SettingsSidebar
            settingsSidebarOpen={settingsSidebarOpen}
            setSettingsSidebarOpen={setSettingsSidebarOpen}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            username={username}
            onAddForm={handleSettingsAddForm}
          />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            transition: isInitialRender ? 'none' : 'margin-left 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '300px',
            height: {
              xs: `calc(100vh - ${headerHeights.xs}px - ${footerHeight})`,
              sm: `calc(100vh - ${headerHeights.sm}px - ${footerHeight})`,
              md: `calc(100vh - ${headerHeights.md}px - ${footerHeight})`,
            },
            minHeight: '300px',
            overflow: 'hidden',
            marginLeft: isConfigurationRoute
              ? sidebarOpen ? '260px' : '30px'
              : isSettingsRoute
              ? settingsSidebarOpen ? '0px' : '0px'
              : '0px',
            zIndex: 1,
          }}
        >
          <Box
            className="content-body"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: { xs: '8px', sm: '16px', md: '24px' },
              backgroundColor: theme.palette.background.default,
              overflowY: 'auto',
              overflowX: 'hidden',
              width: '100%',
              minHeight: 0,
            }}
          >
            {loading || formLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
              </Box>
            ) : error ? (
              <Typography
                variant="h6"
                sx={{ color: 'red', textAlign: 'center', marginTop: '20px' }}
              >
                {error}
              </Typography>
            ) : (
              <>
                {isConfigurationRoute && (formNodeType || selectedForm) ? (
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 5,
                      backgroundColor: theme.palette.background.default,
                      padding: { xs: 1, sm: 2, md: 3 },
                      marginTop: 0,
                    }}
                    className="form-manager-container"
                  >
                    {isEditing ? (
                      <EditConfigurationManager
                        key={configKey}
                        selectedForm={selectedForm}
                        selectedNodeType={formNodeType}
                        selectedNodeData={formNodeData}
                        onClose={handleFormClose}
                      />
                    ) : (
                      <ConfigurationManager
                        key={configKey}
                        selectedForm={selectedForm}
                        selectedNodeType={formNodeType}
                        selectedNodeData={formNodeData}
                        onClose={handleFormClose}
                        onSuccess={() => {
                          setConfigKey((prevKey) => prevKey + 1);
                        }}
                      />
                    )}
                  </Box>
                ) : isSettingsRoute && formNodeType ? (
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 5,
                      backgroundColor: theme.palette.background.default,
                      padding: { xs: 1, sm: 2, md: 3 },
                      marginTop: 0,
                    }}
                    className="form-manager-container"
                  >
                    <AddSettingsForm
                      formType={formNodeType}
                      onClose={handleFormClose}
                    />
                  </Box>
                ) : isConfigurationRoute && isSubsidiaryDetailsRoute ? (
                  <ViewSubsidiaryTable key={configKey} />
                ) : isConfigurationRoute && isRootConfigurationRoute ? (
                  <ViewConfigurationDetails
                    key={configKey}
                    subsidiaries={subsidiaries}
                    setSidebarOpen={setSidebarOpen}
                    setSelectedItemId={setSelectedItemId}
                    setSelectedSubsidiary={setSelectedSubsidiary}
                  />
                ) : (
                  <Outlet context={outletContext} />
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box
    component="footer"
    sx={{
      width: '100%',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5px',
      backgroundColor: "transparent",
      zIndex: 1200,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      Website owned & maintained by: Centre for Development of Advanced Computing (C-DAC) © 2025 All rights reserved.
    </Typography>
  </Box>
</Box>
  );
}

Layout.propTypes = {
  selectedSubsidiary: PropTypes.any,
  setSelectedSubsidiary: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  settingsSidebarOpen: PropTypes.bool.isRequired,
  setSettingsSidebarOpen: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  selectedMine: PropTypes.any,
  setSelectedMine: PropTypes.func.isRequired,
};

export default Layout;