// ============================================================
// BootZone Client - Auth Context
// File: client/src/context/AuthContext.jsx
// Manages user authentication state across the app
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount, try to restore session
  useEffect(() => {
    const token = localStorage.getItem('bz_token');
    const storedUser = localStorage.getItem('bz_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('bz_token');
        localStorage.removeItem('bz_user');
      }
    }
    setLoading(false);
  }, []);

  // Verify token validity once on first load
  useEffect(() => {
    if (localStorage.getItem('bz_token') && !user) {
      authService.getMe()
        .then(({ data }) => {
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('bz_user', JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem('bz_token');
          localStorage.removeItem('bz_user');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('bz_token', data.token);
    localStorage.setItem('bz_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authService.register(formData);
    localStorage.setItem('bz_token', data.token);
    localStorage.setItem('bz_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('bz_token');
    localStorage.removeItem('bz_user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bz_user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
