import React, { useMemo, useCallback } from 'react';

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

interface ChatListFullProps {
  chats: Chat[];
  selectedChatId: string | null;
  searchQuery: string;
  unreadCounts: Record<string, number>;
  userId: string;
  loading: boolean;
  onChatSelect: (chat: Chat) => void;
  onMarkChatRead: (chatId: string) => void;
  onUserClick: (userId: string) => void;
  formatTime: (dateString: string) => string;
  getMediaFileType: (content: string) => string;
  getMediaFilename: (content: string) => string;
}

export const ChatListFull = React.memo<ChatListFullProps>(({ 
  chats, 
  selectedChatId, 
  searchQuery,
  unreadCounts,
  userId,
  loading,
  onChatSelect,
  onMarkChatRead,
  onUserClick,
  formatTime,
  getMediaFileType,
  getMediaFilename
}) => {
  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getChatName = useCallback((chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name || 'Unnamed Group';
    }
    const otherUser = chat.participants.find((p) => p.id !== userId);
    return otherUser?.full_name || otherUser?.username || 'Unknown User';
  }, [userId]);

  const getChatAvatar = useCallback((chat: Chat): { type: 'image' | 'initials'; value: string } => {
    if (chat.type === 'group') {
      return { type: 'initials', value: getInitials(chat.name || 'Group') };
    }
    const otherUser = chat.participants.find((p) => p.id !== userId);
    if (otherUser?.avatar_url) {
      return { type: 'image', value: otherUser.avatar_url };
    }
    return { type: 'initials', value: getInitials(otherUser?.full_name || otherUser?.username || 'U') };
  }, [userId, getInitials]);

  const renderAvatar = useCallback((avatar: { type: 'image' | 'initials'; value: string }) => {
    if (avatar.type === 'image') {
      return <img src={avatar.value} alt="Avatar" className="w-full h-full object-cover" />;
    }
    return avatar.value;
  }, []);

  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) => {
        const chatName = getChatName(chat).toLowerCase();
        return chatName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        const aUnread = unreadCounts[a.id] || 0;
        const bUnread = unreadCounts[b.id] || 0;
        
        if (aUnread > 0 && bUnread === 0) return -1;
        if (bUnread > 0 && aUnread === 0) return 1;
        
        const aTime = a.last_message?.created_at ? new Date(a.last_message.created_at).getTime() : 0;
        const bTime = b.last_message?.created_at ? new Date(b.last_message.created_at).getTime() : 0;
        return bTime - aTime;
      });
  }, [chats, searchQuery, getChatName, unreadCounts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (filteredChats.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p style={{ color: '#6B584A' }}>No chats yet</p>
        <p className="text-sm mt-2" style={{ color: '#B08968' }}>Click "New Chat" to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.map((chat) => {
        const unreadCount = unreadCounts[chat.id] || 0;
        const avatar = getChatAvatar(chat);
        const chatName = getChatName(chat);

        return (
          <div
            key={chat.id}
            onClick={() => {
              onChatSelect(chat);
              if (unreadCount > 0) {
                onMarkChatRead(chat.id);
              }
            }}
            className="p-4 cursor-pointer transition-all duration-300 relative group"
            style={{
              borderBottom: '1px solid rgba(224, 212, 200, 0.3)',
              borderLeft: selectedChatId === chat.id ? '3px solid #8B5E3C' : 'none',
              background: selectedChatId === chat.id ? 'rgba(139, 94, 60, 0.1)' : 'transparent',
            }}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (chat.type === 'private') {
                      const otherUser = chat.participants.find((p) => p.id !== userId);
                      if (otherUser) {
                        onUserClick(otherUser.id);
                      }
                    }
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden ${
                    chat.type === 'private' 
                      ? 'hover:scale-110 transition-transform cursor-pointer' 
                      : 'cursor-default'
                  }`}
                  style={{
                    background: '#8B5E3C',
                    boxShadow: '0 4px 6px -1px rgba(139, 94, 60, 0.2)'
                  }}
                  disabled={chat.type !== 'private'}
                  title={chat.type === 'private' ? 'View profile' : undefined}
                >
                  {renderAvatar(avatar)}
                </button>
                {selectedChatId === chat.id && (
                  <div className="absolute inset-0 rounded-full animate-pulse pointer-events-none" style={{ background: 'rgba(139, 94, 60, 0.2)' }}></div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full" style={{ border: '2px solid #F5EFEA' }}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold truncate ${unreadCount > 0 ? 'text-gray' : 'text-black-100'}`}>
                    {chatName}
                  </h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    {chat.last_message && (
                      <span className="text-xs" style={{
                        color: unreadCount > 0 ? '#8B5E3C' : '#6B584A'
                      }}>
                        {formatTime(chat.last_message.created_at)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate flex-1 ${unreadCount > 0 ? 'font-medium' : ''}`} 
                     style={{ color: unreadCount > 0 ? '#3A2A20' : '#6B584A' }}>
                    {chat.last_message ? (
                      chat.last_message.type === 'media' ? (
                        (() => {
                          const mediaType = getMediaFileType(chat.last_message.content);
                          const fileName = getMediaFilename(chat.last_message.content);
                          return (
                            <span className="flex items-center gap-1">
                              {mediaType === 'image' ? (
                                <><svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Photo</>
                              ) : mediaType === 'video' ? (
                                <><svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Video</>
                              ) : mediaType === 'audio' ? (
                                <><svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> Audio</>
                              ) : (
                                <><svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg> {fileName}</>
                              )}
                            </span>
                          );
                        })()
                      ) : (
                        chat.last_message.content
                      )
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                  {unreadCount > 0 && (
                    <div className="ml-2 min-w-5 h-5 px-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/50">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

ChatListFull.displayName = 'ChatListFull';
