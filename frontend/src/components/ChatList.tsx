import React, { useMemo } from 'react';
import { ChatListItem } from './ChatListItem';

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

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  searchQuery: string;
  unreadCounts: Record<string, number>;
  userId: string;
  onChatSelect: (chat: Chat) => void;
  onNewChatClick: () => void;
}

export const ChatList = React.memo<ChatListProps>(({ 
  chats, 
  selectedChatId, 
  searchQuery,
  unreadCounts,
  userId,
  onChatSelect,
  onNewChatClick
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name || 'Unnamed Group';
    }
    const otherUser = chat.participants.find((p) => p.id !== userId);
    return otherUser?.full_name || otherUser?.username || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat): { type: 'image' | 'initials'; value: string } => {
    if (chat.type === 'group') {
      return { type: 'initials', value: getInitials(chat.name || 'Group') };
    }
    const otherUser = chat.participants.find((p) => p.id !== userId);
    if (otherUser?.avatar_url) {
      return { type: 'image', value: otherUser.avatar_url };
    }
    return { type: 'initials', value: getInitials(otherUser?.full_name || otherUser?.username || 'U') };
  };

  const renderAvatar = (avatar: { type: 'image' | 'initials'; value: string }, className?: string) => {
    if (avatar.type === 'image') {
      return <img src={avatar.value} alt="Avatar" className={`w-full h-full object-cover ${className || ''}`} />;
    }
    return avatar.value;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) => {
        const chatName = getChatName(chat).toLowerCase();
        return chatName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        const aUnread = unreadCounts[a.id] || 0;
        const bUnread = unreadCounts[b.id] || 0;
        
        // Unread chats come first
        if (aUnread > 0 && bUnread === 0) return -1;
        if (bUnread > 0 && aUnread === 0) return 1;
        
        // Then sort by last message time (most recent first)
        const aTime = a.last_message?.created_at ? new Date(a.last_message.created_at).getTime() : 0;
        const bTime = b.last_message?.created_at ? new Date(b.last_message.created_at).getTime() : 0;
        return bTime - aTime;
      });
  }, [chats, searchQuery, unreadCounts]);

  return (
    <div className="h-full overflow-y-auto px-2">
      {filteredChats.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: '#6B584A' }}>
            {searchQuery ? 'No chats found' : 'No conversations yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={onNewChatClick}
              className="mt-4 px-4 py-2 rounded-lg text-white font-medium"
              style={{ background: '#8B5E3C' }}
            >
              Start a chat
            </button>
          )}
        </div>
      ) : (
        filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChatId === chat.id}
            unreadCount={unreadCounts[chat.id] || 0}
            getChatName={getChatName}
            getChatAvatar={getChatAvatar}
            renderAvatar={renderAvatar}
            formatTime={formatTime}
            onSelect={() => onChatSelect(chat)}
          />
        ))
      )}
    </div>
  );
});

ChatList.displayName = 'ChatList';
