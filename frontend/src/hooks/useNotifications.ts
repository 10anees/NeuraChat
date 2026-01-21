import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'call' | 'system' | 'ai_summary';
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  chat_id?: string;
  chats?: {
    id: string;
    type: string;
    name?: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.getNotifications() as { notifications: Notification[] };
      const unreadNotifs = (response.notifications || []).filter((n: Notification) => !n.is_read);
      setNotifications(unreadNotifs);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  const getUnreadCountForChat = useCallback((chatId: string) => {
    return notifications.filter((n) => n.chat_id === chatId && n.chat_id !== null).length;
  }, [notifications]);

  const getTotalUnreadCount = useCallback(() => {
    return notifications.length;
  }, [notifications]);

  const markChatNotificationsAsRead = useCallback(async (chatId: string) => {
    const chatNotifications = notifications.filter((n) => n.chat_id === chatId && n.chat_id !== null);

    if (chatNotifications.length === 0) return;

    for (const notification of chatNotifications) {
      try {
        await api.markNotificationRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    setNotifications((prev) => prev.filter((n) => n.chat_id !== chatId));
  }, [notifications]);

  const handleMarkNotificationRead = useCallback(async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    if (!notification.is_read) {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    }
  }, []);

  return {
    notifications,
    fetchNotifications,
    getUnreadCountForChat,
    getTotalUnreadCount,
    markChatNotificationsAsRead,
    handleMarkNotificationRead,
    handleMarkAllRead,
    addNotification,
  };
};
