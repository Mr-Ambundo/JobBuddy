// src/contexts/NotificationContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authContext';

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'application' | 'message' | 'mentorship';
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: Notification) => {
    // This is a client-side function for real-time updates
    // The actual notification would be created on the server
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prevCount => prevCount + 1);
  };

  const markAsRead = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear notifications');
      }
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to clear notifications');
      console.error('Error clearing notifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    addNotification,
    markAsRead,
    clearNotifications,
    fetchNotifications
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};