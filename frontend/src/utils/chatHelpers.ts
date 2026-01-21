import { getInitials } from './formatters';

interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  participants: Array<{
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  }>;
}

/**
 * Get chat display name (group name or other user's name)
 */
export const getChatName = (chat: Chat, currentUserId?: string): string => {
  if (chat.type === 'group') {
    return chat.name || 'Unnamed Group';
  }
  const otherUser = chat.participants.find((p) => p.id !== currentUserId);
  return otherUser?.full_name || otherUser?.username || 'Unknown User';
};

/**
 * Get other user's name from chat ID
 */
export const getOtherUserNameByChatId = (
  chats: Chat[],
  chatId?: string,
  currentUserId?: string,
  fallback?: string
): string => {
  if (!chatId) return fallback || 'Unknown User';
  const chat = chats.find((c) => c.id === chatId);
  if (chat?.participants) {
    const otherUser = chat.participants.find((p) => p.id !== currentUserId);
    if (otherUser) {
      return otherUser.full_name || otherUser.username || fallback || 'Unknown User';
    }
  }
  return fallback || 'Unknown User';
};

/**
 * Get chat avatar (image URL or initials)
 */
export const getChatAvatar = (
  chat: Chat,
  currentUserId?: string
): { type: 'image' | 'initials'; value: string } => {
  if (chat.type === 'group') {
    return { type: 'initials', value: getInitials(chat.name || 'Group') };
  }
  const otherUser = chat.participants.find((p) => p.id !== currentUserId);
  if (otherUser?.avatar_url) {
    return { type: 'image', value: otherUser.avatar_url };
  }
  return {
    type: 'initials',
    value: getInitials(otherUser?.full_name || otherUser?.username || 'U'),
  };
};
