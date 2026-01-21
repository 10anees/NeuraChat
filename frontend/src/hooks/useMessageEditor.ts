import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'media' | 'system';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
}

export const useMessageEditor = (onUpdate: (message: Message) => void) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const startEdit = useCallback((message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setEditingContent('');
  }, []);

  const saveEdit = useCallback(async (messages: Message[]) => {
    if (!editingMessageId || !editingContent.trim()) return;

    try {
      await api.editMessage(editingMessageId, editingContent.trim());
      const editedMsg = messages.find(m => m.id === editingMessageId);
      if (editedMsg) {
        onUpdate({ ...editedMsg, content: editingContent.trim() });
      }
      setEditingMessageId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Failed to edit message:', error);
      alert('Failed to edit message');
    }
  }, [editingMessageId, editingContent, onUpdate]);

  const confirmDelete = useCallback(async (onDelete: (id: string) => void) => {
    if (!messageToDelete) return;
    try {
      await api.deleteMessage(messageToDelete);
      onDelete(messageToDelete);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    } finally {
      setMessageToDelete(null);
      setIsDeleteModalOpen(false);
    }
  }, [messageToDelete]);

  const initiateDelete = useCallback((messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setMessageToDelete(null);
    setIsDeleteModalOpen(false);
  }, []);

  return {
    editingMessageId,
    editingContent,
    setEditingContent,
    isDeleteModalOpen,
    startEdit,
    cancelEdit,
    saveEdit,
    initiateDelete,
    confirmDelete,
    closeDeleteModal,
  };
};
