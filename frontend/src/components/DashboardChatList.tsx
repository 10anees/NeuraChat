import React, { useCallback } from 'react';
import { ChatListFull } from './ChatListFull';

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

interface DashboardChatListProps {
  selectedChat: Chat | null;
  chats: Chat[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCounts: Record<string, number>;
  userId: string;
  loading: boolean;
  totalUnreadCount: number;
  onChatSelect: (chat: Chat) => void;
  onMarkChatRead: (chatId: string) => void;
  onUserClick: (userId: string) => void;
  onNewChatClick: () => void;
  onToggleNotifications: () => void;
  formatTime: (dateString: string) => string;
  getMediaFileType: (content: string) => string;
  getMediaFilename: (content: string) => string;
}

export const DashboardChatList = React.memo<DashboardChatListProps>(({
  selectedChat,
  chats,
  searchQuery,
  onSearchChange,
  unreadCounts,
  userId,
  loading,
  totalUnreadCount,
  onChatSelect,
  onMarkChatRead,
  onUserClick,
  onNewChatClick,
  onToggleNotifications,
  formatTime,
  getMediaFileType,
  getMediaFilename,
}) => {
  return (
    <div
      className={`
          ${selectedChat ? 'hidden lg:flex' : 'flex'}
          w-full lg:w-72 xl:w-80 backdrop-blur-xl border-r flex-col relative z-10 flex-shrink-0
          ${selectedChat ? '' : 'mt-16 lg:mt-0'}
        `}
      style={{ background: 'rgba(227, 213, 200, 0.4)', borderColor: '#E0D4C8' }}
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b relative" style={{ borderColor: '#E0D4C8' }}>
        {/* Subtle accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(139, 94, 60, 0.2), transparent)',
          }}
        />

        <div className="flex items-center justify-between mb-4 hidden lg:flex">
          <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#8B5E3C' }}>
            Chats
          </h1>

          {/* Notification Button - Desktop */}
          <button onClick={onToggleNotifications} className="relative group">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={
                totalUnreadCount > 0
                  ? { background: '#B08968', color: 'white' }
                  : { background: '#E3D5C8', color: '#6B584A' }
              }
            >
              <svg
                className={`w-5 h-5 ${totalUnreadCount > 0 ? 'animate-pulse' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {/* Badge */}
              {totalUnreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4 group">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 backdrop-blur-sm rounded-lg focus:outline-none transition-all text-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid #E0D4C8',
              color: '#3A2A20',
            }}
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 transition-colors"
            style={{ color: '#6B584A' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChatClick}
          className="w-full text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
          style={{ background: '#6B4A2F' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <ChatListFull
        chats={chats}
        selectedChatId={selectedChat?.id || null}
        searchQuery={searchQuery}
        unreadCounts={unreadCounts}
        userId={userId}
        loading={loading}
        onChatSelect={onChatSelect}
        onMarkChatRead={onMarkChatRead}
        onUserClick={onUserClick}
        formatTime={formatTime}
        getMediaFileType={getMediaFileType}
        getMediaFilename={getMediaFilename}
      />
    </div>
  );
});
