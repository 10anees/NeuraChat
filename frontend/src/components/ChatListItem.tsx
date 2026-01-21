import React from 'react';

interface ChatListItemProps {
  chat: any;
  isSelected: boolean;
  unreadCount: number;
  getChatName: (chat: any) => string;
  getChatAvatar: (chat: any) => { type: 'image' | 'initials'; value: string };
  renderAvatar: (avatar: { type: 'image' | 'initials'; value: string }, className?: string) => React.ReactNode;
  formatTime: (dateString: string) => string;
  onSelect: () => void;
}

export const ChatListItem = React.memo<ChatListItemProps>(({ 
  chat, 
  isSelected, 
  unreadCount,
  getChatName,
  getChatAvatar,
  renderAvatar,
  formatTime,
  onSelect 
}) => {
  const chatName = getChatName(chat);
  const avatar = getChatAvatar(chat);
  
  return (
    <div
      onClick={onSelect}
      className="flex items-center p-3 cursor-pointer transition-all relative"
      style={{
        background: isSelected ? 'rgba(139, 94, 60, 0.3)' : 'transparent',
        borderRadius: '12px',
        marginBottom: '8px'
      }}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-white font-semibold"
        style={{ 
          background: avatar.type === 'image' ? 'transparent' : 'linear-gradient(135deg, #8B5E3C 0%, #6B584A 100%)',
          overflow: 'hidden'
        }}
      >
        {renderAvatar(avatar)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 
            className="font-semibold truncate" 
            style={{ color: '#3A2A20' }}
          >
            {chatName}
          </h3>
          {chat.last_message?.created_at && (
            <span className="text-xs ml-2 flex-shrink-0" style={{ color: '#8B5E3C' }}>
              {formatTime(chat.last_message.created_at)}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p 
            className="text-sm truncate"
            style={{ color: '#6B584A' }}
          >
            {chat.last_message?.type === 'media' ? '📎 Media' : (chat.last_message?.content || 'No messages yet')}
          </p>
          {unreadCount > 0 && (
            <span 
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0"
              style={{ background: '#8B5E3C' }}
            >
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ChatListItem.displayName = 'ChatListItem';
