// Frontend/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, saveUserData, clearUserData, getToken, saveToken, removeToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      const userToken = await getToken();
      
      if (userData && userToken) {
        setUser(userData);
        setToken(userToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, authToken) => {
    try {
      await saveUserData(userData);
      await saveToken(authToken);
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error in login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await clearUserData();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error in logout:', error);
      return false;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      await saveUserData(newUserData);
      setUser(newUserData);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};