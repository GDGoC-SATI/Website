import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gdg_token') || null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load current user from token on mount
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('gdg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const sendLoginOtp = async (email) => {
    return await api.auth.sendLoginOtp({ email });
  };

  const loginWithOtp = async (email, otp) => {
    const res = await api.auth.verifyLoginOtp({ email, otp });
    if (res.success && res.token) {
      localStorage.setItem('gdg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const sendSignupOtp = async (name, email, password) => {
    return await api.auth.sendSignupOtp({ name, email, password });
  };

  const verifySignupOtp = async (email, otp) => {
    const res = await api.auth.verifySignupOtp({ email, otp });
    if (res.success && res.token) {
      localStorage.setItem('gdg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const sendForgotPasswordOtp = async (email) => {
    return await api.auth.sendForgotPasswordOtp({ email });
  };

  const resetPasswordWithOtp = async (email, otp, newPassword) => {
    return await api.auth.resetPasswordWithOtp({ email, otp, newPassword });
  };

  const signup = async (name, email, password) => {
    const res = await api.auth.signup({ name, email, password });
    if (res.success && res.token) {
      localStorage.setItem('gdg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const googleAuth = async (userData) => {
    const res = await api.auth.googleAuth(userData);
    if (res.success && res.token) {
      localStorage.setItem('gdg_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('gdg_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.auth.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        sendLoginOtp,
        loginWithOtp,
        signup,
        sendSignupOtp,
        verifySignupOtp,
        sendForgotPasswordOtp,
        resetPasswordWithOtp,
        googleAuth,
        logout,
        updateProfile,
        refreshUser,
        isProfileOpen,
        setIsProfileOpen,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
