import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userRole = localStorage.getItem('role');

    if (token && userData && userRole) {
      setUser({
        ...JSON.parse(userData),
        role: userRole,
        token: token
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user: userData, role, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', role);
        
        setUser({
          ...userData,
          role,
          token
        });
        
        return { success: true };
      } else {
        return { success: false, message: response.data.msg };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.msg || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return { 
        success: response.data.success, 
        message: response.data.msg 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.msg || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};