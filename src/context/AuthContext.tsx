import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/db';
import type { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, openaiKey: string) => Promise<void>;
  updateOpenAIKey: (key: string) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize database and check for saved session
    const init = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Verify user still exists in database
          const dbUser = await db.users.get(parsedUser.id);
          if (dbUser) {
            setUser(dbUser);
          } else {
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const foundUser = await db.users
        .where('username')
        .equals(username.toLowerCase())
        .first();

      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (username: string, password: string, openaiKey: string) => {
    try {
      const existingUser = await db.users
        .where('username')
        .equals(username.toLowerCase())
        .first();

      if (existingUser) {
        throw new Error('Username already exists');
      }

      const newUser: User = {
        username: username.toLowerCase(),
        password,
        openaiKey,
        darkMode: false
      };

      const id = await db.users.add(newUser);
      const userWithId = { ...newUser, id };
      setUser(userWithId);
      localStorage.setItem('currentUser', JSON.stringify(userWithId));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateOpenAIKey = async (key: string) => {
    if (!user?.id) return;
    try {
      await db.users.update(user.id, { openaiKey: key });
      const updatedUser = { ...user, openaiKey: key };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      toast.success('API key updated successfully');
    } catch (error) {
      console.error('Failed to update API key:', error);
      toast.error('Failed to update API key');
    }
  };

  const toggleDarkMode = async () => {
    if (!user?.id) return;
    try {
      const newDarkMode = !user.darkMode;
      await db.users.update(user.id, { darkMode: newDarkMode });
      const updatedUser = { ...user, darkMode: newDarkMode };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
      toast.error('Failed to update theme preference');
    }
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateOpenAIKey, toggleDarkMode }}>
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