import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Hardcode logged-in state for development
  const isDevelopment = process.env.NODE_ENV === 'development';

  // If in development, consider user always logged-in with dummy user info
  const [isAuthenticated, setIsAuthenticated] = useState(isDevelopment);
  const [user, setUser] = useState(
    isDevelopment
      ? { username: 'devuser', first_name: 'Dev', last_name: 'User' }
      : { username: 'Guest', first_name: '', last_name: '' }
  );
  const [loading, setLoading] = useState(false);

  // Bypass login for dev
  const login = async (identifier, password) => {
    if (isDevelopment) {
      setIsAuthenticated(true);
      setUser({ username: 'devuser', first_name: 'Dev', last_name: 'User' });
      navigate('/app/welcome');
      return;
    }
    try {
      const normalizedIdentifier = identifier.trim().toLowerCase();
      const response = await apiClient.post('login/', { identifier: normalizedIdentifier, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', normalizedIdentifier.split('@')[0]);

      const userResponse = await apiClient.get('users/me/');
      setUser({
        username: userResponse.data.username || normalizedIdentifier.split('@')[0],
        first_name: userResponse.data.profile?.first_name || '',
        last_name: userResponse.data.profile?.last_name || '',
      });
      setIsAuthenticated(true);
      navigate('/app/welcome');
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  // Bypass logout for dev
  const logout = () => {
    if (isDevelopment) {
      setIsAuthenticated(false);
      setUser({ username: 'Guest', first_name: '', last_name: '' });
      navigate('/login');
      return;
    }
    localStorage.clear();
    setIsAuthenticated(false);
    setUser({ username: 'Guest', first_name: '', last_name: '' });
    navigate('/login');
  };

  // Token validation bypass for dev
  const validateToken = async () => {
    if (isDevelopment) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      logout();
      setLoading(false);
      return;
    }
    try {
      const response = await apiClient.get('users/me/');
      setIsAuthenticated(true);
      setUser({
        username: response.data.username || localStorage.getItem('username') || 'Guest',
        first_name: response.data.profile?.first_name || '',
        last_name: response.data.profile?.last_name || '',
      });
    } catch (error) {
      console.error('Token validation error:', error.response?.data);
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
