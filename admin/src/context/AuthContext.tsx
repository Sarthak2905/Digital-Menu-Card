import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('cafe_admin');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user: userData } = res.data as {
      token: string;
      user: { id: string; name: string; email: string; role: string };
    };
    if (userData.role !== 'admin') {
      toast.error('Access denied. Admin accounts only.');
      throw new Error('Not an admin');
    }
    const user: AdminUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      token,
    };
    localStorage.setItem('cafe_admin', JSON.stringify(user));
    setAdmin(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cafe_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
