import React from 'react';

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

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
  formatTime: (dateString: string) => string;
}

export const NotificationPanel = React.memo<NotificationPanelProps>(({
  notifications,
  isOpen,
  onClose,
  onNotificationClick,
  onMarkAllRead,
  formatTime
}) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'call':
        return '📞';
      case 'ai_summary':
        return '🤖';
      default:
        return '🔔';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute top-16 right-4 z-50" style={{ width: '360px', maxHeight: '600px' }}>
        <div
          className="rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 94, 60, 0.95) 0%, rgba(107, 88, 74, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 94, 60, 0.3)',
            maxHeight: '600px',
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-300">No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !notification.is_read;
                return (
                  <div
                    key={notification.id}
                    onClick={() => onNotificationClick(notification)}
                    className="p-4 border-b border-gray-700/30 hover:bg-white/5 cursor-pointer transition-all"
                    style={{
                      background: isUnread ? 'rgba(139, 94, 60, 0.2)' : 'transparent',
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm">
                            {notification.title}
                          </h4>
                          {isUnread && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                              style={{ background: '#F59E0B' }}
                            ></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mb-1 line-clamp-2">
                          {notification.content}
                        </p>
                        <p className="text-xs" style={{ color: '#D4A574' }}>
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700/50 flex-shrink-0">
              <button
                onClick={onMarkAllRead}
                className="w-full py-2 bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30 border border-pink-500/50 text-pink-400 rounded-lg transition-all font-medium text-sm"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

NotificationPanel.displayName = 'NotificationPanel';
