import React from 'react';

interface DashboardMobileHeaderProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  totalUnreadCount: number;
  onToggleNotifications: () => void;
  selectedChat: any;
  onBackToChats: () => void;
}

export const DashboardMobileHeader: React.FC<DashboardMobileHeaderProps> = ({
  onOpenSidebar,
  totalUnreadCount,
  onToggleNotifications,
  selectedChat,
  onBackToChats,
}) => {
  return (
    <div
      className="lg:hidden fixed top-0 left-0 right-0 z-30 backdrop-blur-xl p-4 flex items-center gap-3"
      style={{ background: 'rgba(227, 213, 200, 0.8)', borderBottom: '1px solid #E0D4C8' }}
    >
      <button
        onClick={onOpenSidebar}
        className="transition-colors p-2"
        style={{ color: '#6B584A' }}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-xl font-bold flex-1" style={{ color: '#8B5E3C' }}>
        NeuraChat
      </h1>

      <button
        onClick={onToggleNotifications}
        className="relative transition-colors p-2"
        style={{ color: '#6B584A' }}
      >
        <svg
          className={`w-6 h-6 ${totalUnreadCount > 0 ? 'text-pink-400' : ''}`}
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
        {totalUnreadCount > 0 && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </div>
        )}
      </button>

      {selectedChat && (
        <button
          onClick={onBackToChats}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="Back to chats"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
    </div>
  );
};
