'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    api.me()
      .then((res) => {
        if (res && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    if (res && res.user) {
      setUser(res.user);
      // Route based on role
      if (res.user.is_superuser || res.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (res.user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (res.user.role === 'student') {
        router.push('/student/dashboard');
      } else {
        router.push('/');
      }
      return res.user;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
