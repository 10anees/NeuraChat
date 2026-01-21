import React, { useMemo, useCallback } from 'react';
import { MessageList } from './MessageList';
import { getChatName, getChatAvatar } from '@/utils/chatHelpers';

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
  participants: Array<{
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  }>;
}

interface DashboardChatAreaProps {
  selectedChat: Chat;
  messages: Message[];
  messageInput: string;
  sendingMessage: boolean;
  editingMessageId: string | null;
  editingContent: string;
  messageMenuOpen: string | null;
  callState: string;
  isCallUiMinimized: boolean;
  userId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  onTyping: () => void;
  onEditChange: (content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onMenuToggle: (messageId: string | null) => void;
  onUserClick: (userId: string) => void;
  onFileUpload: () => void;
  onAIAssistant: () => void;
  onInitiateCall: (chatId: string, userId: string, userName: string, type: 'audio' | 'video') => void;
  onEndCall: () => void;
  onRestoreCallUi: () => void;
  formatMessageTime: (dateString: string) => string;
  getInitials: (name: string) => string;
  getMediaFileType: (content: string) => string;
  getMediaUrl: (content: string) => string;
  getMediaFilename: (content: string) => string;
}

export const DashboardChatArea = React.memo<DashboardChatAreaProps>(({
  selectedChat,
  messages,
  messageInput,
  sendingMessage,
  editingMessageId,
  editingContent,
  messageMenuOpen,
  callState,
  isCallUiMinimized,
  userId,
  messagesEndRef,
  onMessageInputChange,
  onSendMessage,
  onTyping,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDeleteMessage,
  onMenuToggle,
  onUserClick,
  onFileUpload,
  onAIAssistant,
  onInitiateCall,
  onEndCall,
  onRestoreCallUi,
  formatMessageTime,
  getInitials,
  getMediaFileType,
  getMediaUrl,
  getMediaFilename,
}) => {
  const chatName = useMemo(() => getChatName(selectedChat, userId), [selectedChat, userId]);
  const avatar = useMemo(() => getChatAvatar(selectedChat, userId), [selectedChat, userId]);

  return (
    <div className="flex-1 flex flex-col relative z-10 mt-16 lg:mt-0 min-w-0">
      {/* Chat Header */}
      <div
        className="px-4 py-3 lg:px-6 lg:py-4 backdrop-blur-xl relative"
        style={{
          background: 'rgba(227, 213, 200, 0.8)',
          borderBottom: '1px solid rgba(224, 212, 200, 0.5)',
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedChat.type === 'private') {
                const otherUser = selectedChat.participants.find((p) => p.id !== userId);
                if (otherUser) {
                  onUserClick(otherUser.id);
                }
              }
            }}
            className={`relative ${
              selectedChat.type === 'private'
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
            }`}
            disabled={selectedChat.type !== 'private'}
            title={selectedChat.type === 'private' ? 'View profile' : undefined}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg overflow-hidden">
              {avatar.type === 'image' ? (
                <img src={avatar.value} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                avatar.value
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 shadow-lg" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-100">{chatName}</h2>
              {callState === 'in-call' && (
                <button
                  onClick={onRestoreCallUi}
                  className="px-2 py-0.5 text-xs rounded-full transition"
                  style={{
                    background: 'rgba(139, 94, 60, 0.15)',
                    color: '#8B5E3C',
                    border: '1px solid rgba(139, 94, 60, 0.3)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(139, 94, 60, 0.25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(139, 94, 60, 0.15)')}
                  title={isCallUiMinimized ? 'Return to call' : 'Call in progress'}
                >
                  {isCallUiMinimized ? 'Return to Call' : 'In Call'}
                </button>
              )}
            </div>
            <p className="text-sm" style={{ color: '#6B584A' }}>
              {selectedChat.participants.length}{' '}
              {selectedChat.participants.length === 1 ? 'participant' : 'participants'}
            </p>
          </div>
          {/* Call buttons - only for private chats with 2 participants */}
          {selectedChat.type === 'private' && selectedChat.participants.length === 2 && (
            <div className="flex gap-2">
              {/* Audio Call Button */}
              <button
                onClick={() => {
                  const otherUser = selectedChat.participants.find((p) => p.id !== userId);
                  if (otherUser) {
                    const otherUserName =
                      otherUser.full_name || otherUser.username || selectedChat.name || 'Unknown';
                    onInitiateCall(selectedChat.id, otherUser.id, otherUserName, 'audio');
                  }
                }}
                disabled={callState !== 'idle'}
                className={`relative group ${callState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Start audio call"
              >
                <div
                  className="absolute inset-0 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"
                  style={{ background: '#8B5E3C' }}
                />
                <div
                  className="relative p-2 rounded-lg transition-all duration-300 text-white shadow-lg"
                  style={{ background: '#B08968' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#8B5E3C')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#B08968')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </button>

              {/* Video Call Button */}
              <button
                onClick={() => {
                  const otherUser = selectedChat.participants.find((p) => p.id !== userId);
                  if (otherUser) {
                    const otherUserName =
                      otherUser.full_name || otherUser.username || selectedChat.name || 'Unknown';
                    onInitiateCall(selectedChat.id, otherUser.id, otherUserName, 'video');
                  }
                }}
                disabled={callState !== 'idle'}
                className={`relative group ${callState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Start video call"
              >
                <div
                  className="absolute inset-0 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"
                  style={{ background: '#6B4A2F' }}
                />
                <div
                  className="relative p-2 rounded-lg transition-all duration-300 text-white shadow-lg"
                  style={{ background: '#8B5E3C' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#6B4A2F')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#8B5E3C')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
          {/* End call button - show when in call */}
          {callState === 'in-call' && (
            <button onClick={onEndCall} className="relative group" title="End call">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-500 hover:to-red-600 p-2 rounded-lg transition-all duration-300 text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={userId}
        chatParticipants={selectedChat.participants}
        editingMessageId={editingMessageId}
        editingContent={editingContent}
        messageMenuOpen={messageMenuOpen}
        onEditChange={onEditChange}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onStartEdit={onStartEdit}
        onDeleteMessage={onDeleteMessage}
        onMenuToggle={onMenuToggle}
        onUserClick={onUserClick}
        formatMessageTime={formatMessageTime}
        getInitials={getInitials}
        getMediaFileType={getMediaFileType}
        getMediaUrl={getMediaUrl}
        getMediaFilename={getMediaFilename}
        messagesEndRef={messagesEndRef}
      />

      {/* Message Input */}
      <div
        className="px-4 py-3 lg:px-6 lg:py-4 backdrop-blur-xl relative"
        style={{
          background: 'rgba(227, 213, 200, 0.8)',
          borderTop: '1px solid rgba(224, 212, 200, 0.5)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(139, 94, 60, 0.2), transparent)' }}
        />

        <div className="flex gap-2 lg:gap-3">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => {
                onMessageInputChange(e.target.value);
                onTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              disabled={sendingMessage}
              className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base rounded-lg transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #E0D4C8',
                color: '#3A2A20',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#8B5E3C';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 94, 60, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E0D4C8';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* File Upload Button */}
          <button
            onClick={onFileUpload}
            className="px-3 lg:px-4 py-2 lg:py-3 text-white rounded-lg transition-all duration-300"
            style={{ background: '#B08968' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#8B5E3C')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#B08968')}
            title="Share File"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onAIAssistant}
            disabled={!messageInput.trim()}
            className="px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-300"
            style={{
              background: messageInput.trim() ? '#B08968' : 'rgba(107, 88, 74, 0.3)',
              color: messageInput.trim() ? 'white' : '#6B584A',
              cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) =>
              messageInput.trim() && (e.currentTarget.style.background = '#8B5E3C')
            }
            onMouseLeave={(e) =>
              messageInput.trim() && (e.currentTarget.style.background = '#B08968')
            }
            title="AI Message Assistant"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>

          {/* Send Button */}
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim() || sendingMessage}
            className="px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm lg:text-base font-medium"
            style={{ background: '#6B4A2F' }}
            onMouseEnter={(e) =>
              !e.currentTarget.disabled && (e.currentTarget.style.background = '#8B5E3C')
            }
            onMouseLeave={(e) =>
              !e.currentTarget.disabled && (e.currentTarget.style.background = '#6B4A2F')
            }
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="sm:hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2 -9 -18 -9 18 9 -2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});
