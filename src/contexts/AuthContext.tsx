import React, { createContext, useContext, useState } from 'react';
import type { User, AuthContextType } from '../types';
import { initializeOpenAI } from '../utils/openai';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      initializeOpenAI(parsed.openaiKey);
      return parsed;
    }
    return null;
  });

  const login = (username: string, openaiKey: string) => {
    try {
      initializeOpenAI(openaiKey);
      const newUser = { username, openaiKey };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Invalid API key');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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