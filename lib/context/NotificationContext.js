'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_NOTIFICATIONS } from '@/lib/data';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('foodbridge_notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications(MOCK_NOTIFICATIONS);
      }
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
    }
  }, []);

  const saveNotifications = (items) => {
    setNotifications(items);
    localStorage.setItem('foodbridge_notifications', JSON.stringify(items));
  };

  const addNotification = useCallback(
    (notification) => {
      const newNotif = {
        id: `notif_${Date.now()}`,
        ...notification,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newNotif, ...notifications];
      saveNotifications(updated);
    },
    [notifications]
  );

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
