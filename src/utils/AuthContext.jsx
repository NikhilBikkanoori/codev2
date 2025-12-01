import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, getProfile } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && token) {
        try {
          // Refresh profile from server to ensure role accuracy
          const res = await getProfile();
          const refreshed = res.data || JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify(refreshed));
          setUser(refreshed);
        } catch (e) {
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };
    if (token) init(); else setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      const { token: tk, user: rawUser } = response.data;
      localStorage.setItem('token', tk);
      setToken(tk);
      // Fetch full profile to ensure latest role
      try {
        const prof = await getProfile();
        localStorage.setItem('user', JSON.stringify(prof.data));
        setUser(prof.data);
        return { success: true, user: prof.data };
      } catch {
        localStorage.setItem('user', JSON.stringify(rawUser));
        setUser(rawUser);
        return { success: true, user: rawUser };
      }
    } catch (error) {
      console.error('Login error raw:', error);
      if (error.response) {
        console.error('Login error response data:', error.response.data);
      }
      return { success: false, error: error.response?.data?.msg || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.msg || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
