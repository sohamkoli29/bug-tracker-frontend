import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

const API_URL = `${import.meta.env.VITE_API_URL}/api/notifications`;


  // Get config with token
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL, getConfig());
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/read`, {}, getConfig());
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/read-all`, {}, getConfig());
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      return { success: true };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { success: false };
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      const deletedNotif = notifications.find((n) => n._id === id);
      setNotifications(notifications.filter((n) => n._id !== id));
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false };
    }
  };

  // Clear read notifications
  const clearReadNotifications = async () => {
    try {
      await axios.delete(`${API_URL}/clear-read`, getConfig());
      setNotifications(notifications.filter((n) => !n.read));
      return { success: true };
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      return { success: false };
    }
  };

  // Auto-fetch notifications on mount and set up polling
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
