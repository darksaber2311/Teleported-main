import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(() => localStorage.getItem('tp_token') || null);
  const [user, setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('tp_user')) || null; } catch { return null; }
  });

  const login = (tok, userData) => {
    setToken(tok);
    setUser(userData);
    localStorage.setItem('tp_token', tok);
    localStorage.setItem('tp_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('tp_user', JSON.stringify(updated));
  };

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
