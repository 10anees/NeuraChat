import { useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import socketClient from '@/lib/socket';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'media' | 'system';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  users?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
    type?: 'text' | 'media' | 'system';
  };
  participants: Array<{
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  }>;
}

export const useChatManagement = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const joinedChatsRef = useRef<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      const response: any = await api.getUserChats();
      const fetchedChats: Chat[] = response?.chats || [];
      setChats(fetchedChats);

      // Proactively join all chat rooms
      socketClient.onReady((sock) => {
        fetchedChats.forEach((chat) => {
          if (!joinedChatsRef.current.has(chat.id)) {
            socketClient.joinChat(chat.id);
            joinedChatsRef.current.add(chat.id);
          }
        });
      });
    } catch (error: any) {
      const friendlyMessage = error?.message || 'Unknown error fetching chats';
      const status = error?.status ?? 'n/a';
      console.error(`Failed to fetch chats [status=${status}]:`, error);
      alert(`Could not load chats (status: ${status}). ${friendlyMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string, scrollToBottom?: () => void) => {
    try {
      const response: any = await api.getChatMessages(chatId);
      setMessages(response.messages || []);
      if (scrollToBottom) scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  const handleSendMessage = useCallback(async (
    messageInput: string,
    selectedChatId: string,
    userId: string,
    onSuccess: () => void,
    onError: (content: string) => void
  ) => {
    if (!messageInput.trim() || !selectedChatId || sendingMessage) return;

    const content = messageInput.trim();
    setSendingMessage(true);

    try {
      socketClient.sendMessage({
        chat_id: selectedChatId,
        sender_id: userId,
        content,
        type: 'text',
      });
      socketClient.stopTyping(selectedChatId, userId);
      onSuccess();
    } catch (error) {
      console.error('Failed to send message:', error);
      onError(content);
    } finally {
      setSendingMessage(false);
    }
  }, [sendingMessage]);

  const handleTyping = useCallback((chatId: string, userId: string) => {
    socketClient.startTyping(chatId, userId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketClient.stopTyping(chatId, userId);
    }, 3000);
  }, []);

  const updateChatLastMessage = useCallback((chatId: string, lastMessage: any) => {
    setChats((prev) => {
      const updated = prev.map((chat) =>
        chat.id === chatId ? { ...chat, last_message: lastMessage } : chat
      );
      return updated.sort((a, b) => {
        const aTime = a.last_message?.created_at ? new Date(a.last_message.created_at).getTime() : 0;
        const bTime = b.last_message?.created_at ? new Date(b.last_message.created_at).getTime() : 0;
        return bTime - aTime;
      });
    });
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((message: Message) => {
    setMessages((prev) => prev.map((msg) => (msg.id === message.id ? message : msg)));
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  return {
    chats,
    messages,
    loading,
    sendingMessage,
    fetchChats,
    fetchMessages,
    handleSendMessage,
    handleTyping,
    updateChatLastMessage,
    addMessage,
    updateMessage,
    removeMessage,
    setChats,
    setMessages,
  };
};
