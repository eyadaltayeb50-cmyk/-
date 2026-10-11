import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isActivated: boolean;
  isAdmin: boolean;
  login: (phoneOrEmail: string, password?: string) => Promise<void>;
  register: (data: {
    fullName: string;
    phone: string;
    password?: string;
    institutionId?: string;
    departmentId?: string;
    academicYearId?: string;
  }) => Promise<void>;
  logout: () => void;
  switchDemo: (role: 'active' | 'pending' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (phoneOrEmail: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(phoneOrEmail, password);
      if (res.success) {
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    phone: string;
    password?: string;
    institutionId?: string;
    departmentId?: string;
    academicYearId?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.success) {
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // For demo continuity, switch to pending user on logout
    api.switchDemo('pending').then((res) => {
      setUser(res.user);
    });
  };

  const switchDemo = async (role: 'active' | 'pending' | 'admin') => {
    setIsLoading(true);
    try {
      const res = await api.switchDemo(role);
      if (res.success) {
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isActivated = Boolean(
    user && (user.role === 'admin' || user.role === 'super_admin' || user.status === 'active')
  );

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'content_manager')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: Boolean(user),
        isActivated,
        isAdmin,
        login,
        register,
        logout,
        switchDemo,
        refreshUser,
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
