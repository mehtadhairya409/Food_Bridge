'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '@/lib/data';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('foodbridge_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('foodbridge_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const userData = { ...found };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('foodbridge_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    // Also check localStorage registered users
    const registeredUsers = JSON.parse(localStorage.getItem('foodbridge_registered_users') || '[]');
    const regUser = registeredUsers.find((u) => u.email === email && u.password === password);
    if (regUser) {
      const userData = { ...regUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('foodbridge_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (userData) => {
    const allUsers = [...MOCK_USERS];
    const registeredUsers = JSON.parse(localStorage.getItem('foodbridge_registered_users') || '[]');
    const exists = [...allUsers, ...registeredUsers].find((u) => u.email === userData.email);
    if (exists) return { success: false, error: 'Email already registered' };

    const newUser = {
      id: `usr_${Date.now()}`,
      ...userData,
      verified: userData.role !== 'ngo',
      badges: [],
      totalDonations: 0,
      mealsServed: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    registeredUsers.push(newUser);
    localStorage.setItem('foodbridge_registered_users', JSON.stringify(registeredUsers));

    const safe = { ...newUser };
    delete safe.password;
    setUser(safe);
    localStorage.setItem('foodbridge_user', JSON.stringify(safe));
    return { success: true, user: safe };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodbridge_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('foodbridge_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
