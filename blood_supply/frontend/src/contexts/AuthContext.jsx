import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = 'Registration failed';
      
      if (errorData?.errors) {
        // Handle validation errors
        const errors = errorData.errors;
        if (typeof errors === 'object') {
          // Get first error message from validation errors
          for (const [key, messages] of Object.entries(errors)) {
            if (Array.isArray(messages)) {
              errorMessage = messages[0];
            } else if (typeof messages === 'string') {
              errorMessage = messages;
            }
            break;
          }
        } else {
          errorMessage = errorData.message || 'Registration failed';
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      userType: user?.user_type
    }}>
      {children}
    </AuthContext.Provider>
  );
};