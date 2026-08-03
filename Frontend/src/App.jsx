// App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import Login from './pages/UserManagement/pages/Login';
import Signup from './pages/UserManagement/pages/Signup';
import SimpleForgotPassword from './pages/UserManagement/pages/SimpleForgotPassword';
import Layout from './components/Layout';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement/UserManagement';
import AnalyticsProfiles from "./pages/Dashboard/AnalyticsProfiles";
import WelcomeCards from './components/HomePage';
import AuthProvider, { AuthContext } from './context/AuthContext';

function ProtectedLayout() {
  const { isAuthenticated, username, loading } = React.useContext(AuthContext);
  const [selectedSubsidiary, setSelectedSubsidiary] = React.useState(null);
  const [selectedMine, setSelectedMine] = React.useState(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = React.useState(false);

  if (loading) return null; // or loading spinner
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <Layout
      selectedSubsidiary={selectedSubsidiary}
      setSelectedSubsidiary={setSelectedSubsidiary}
      selectedMine={selectedMine}
      setSelectedMine={setSelectedMine}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      settingsSidebarOpen={settingsSidebarOpen}
      setSettingsSidebarOpen={setSettingsSidebarOpen}
      username={username}
    >
      
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <div className="responsive-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/simple-forgot-password" element={<SimpleForgotPassword />} />
            <Route path="/app" element={<ProtectedLayout />}>
              <Route index element={<WelcomeCards />} /> {/* Render WelcomeCards at /app */}
              <Route path="reports" element={<Reports />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="dashboard" element={<AnalyticsProfiles />} />
            </Route>
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;