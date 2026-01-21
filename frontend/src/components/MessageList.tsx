import React, { useCallback } from 'react';

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

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  chatParticipants: Array<{
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  }>;
  editingMessageId: string | null;
  editingContent: string;
  messageMenuOpen: string | null;
  onEditChange: (content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onMenuToggle: (messageId: string) => void;
  onUserClick: (userId: string) => void;
  formatMessageTime: (dateString: string) => string;
  getInitials: (name: string) => string;
  getMediaFileType: (content: string) => string;
  getMediaUrl: (content: string) => string;
  getMediaFilename: (content: string) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = React.memo<MessageListProps>(({
  messages,
  currentUserId,
  chatParticipants,
  editingMessageId,
  editingContent,
  messageMenuOpen,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDeleteMessage,
  onMenuToggle,
  onUserClick,
  formatMessageTime,
  getInitials,
  getMediaFileType,
  getMediaUrl,
  getMediaFilename,
  messagesEndRef
}) => {
  const handleDownload = useCallback(async (content: string) => {
    try {
      const fileUrl = getMediaUrl(content);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getMediaFilename(content);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(getMediaUrl(content), '_blank');
    }
  }, [getMediaUrl, getMediaFilename]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-5 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === currentUserId;
        const sender = message.users || chatParticipants.find((p) => p.id === message.sender_id);
        const isEditing = editingMessageId === message.id;

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] sm:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isOwnMessage && (
                <button
                  onClick={() => sender?.id && onUserClick(sender.id)}
                  className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform cursor-pointer"
                  title={`View ${sender?.full_name || sender?.username}'s profile`}
                >
                  {getInitials(sender?.full_name || sender?.username || 'U')}
                </button>
              )}
              <div className="relative group">
                {!isOwnMessage && (
                  <button
                    onClick={() => sender?.id && onUserClick(sender.id)}
                    className="text-xs mb-1 px-3 font-medium hover:underline cursor-pointer transition-colors"
                    style={{ color: '#8B5E3C' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4A2F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#8B5E3C'}
                    title={`View ${sender?.full_name || sender?.username}'s profile`}
                  >
                    {sender?.full_name || sender?.username}
                  </button>
                )}
                
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => onEditChange(e.target.value)}
                      className="w-full px-4 py-2 backdrop-blur-sm rounded-lg resize-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid #E0D4C8',
                        color: '#3A2A20'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#8B5E3C'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E0D4C8'}
                      rows={3}
                      autoFocus
                      aria-label="Edit message"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={onSaveEdit}
                        className="px-3 py-1 text-white text-sm rounded-lg transition-all duration-300"
                        style={{ background: '#6B4A2F' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#8B5E3C'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#6B4A2F'}
                      >
                        Save
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="px-3 py-1 text-white text-sm rounded-lg transition-colors"
                        style={{ background: 'rgba(107, 88, 74, 0.5)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107, 88, 74, 0.7)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(107, 88, 74, 0.5)'}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    {isOwnMessage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMenuToggle(message.id);
                        }}
                        className="absolute top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/30 rounded-lg -left-8"
                        aria-label="message actions"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    )}

                    <div
                      className="px-4 py-2 rounded-lg"
                      style={{
                        background: isOwnMessage ? '#D1BFA7' : 'rgba(227, 213, 200, 0.6)',
                        border: isOwnMessage ? 'none' : '1px solid rgba(224, 212, 200, 0.5)',
                        color: '#3A2A20'
                      }}
                    >
                      {message.type === 'media' ? (
                        <div className="space-y-2">
                          {getMediaFileType(message.content) === 'image' ? (
                            <img
                              src={getMediaUrl(message.content)}
                              alt="Shared image"
                              className="max-w-full max-h-96 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(getMediaUrl(message.content), '_blank')}
                            />
                          ) : getMediaFileType(message.content) === 'video' ? (
                            <video
                              controls
                              className="max-w-full max-h-96 rounded-lg"
                              src={getMediaUrl(message.content)}
                            />
                          ) : getMediaFileType(message.content) === 'audio' ? (
                            <audio
                              controls
                              className="w-full"
                              src={getMediaUrl(message.content)}
                            />
                          ) : (
                            <button
                              onClick={() => handleDownload(message.content)}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full text-left"
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 94, 60, 0.3)' }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {getMediaFilename(message.content)}
                                </p>
                                <p className="text-xs opacity-75">Click to download</p>
                              </div>
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      )}
                      <p className="text-xs mt-1 font-medium" style={{ color: '#5A4734' }}>
                        {formatMessageTime(message.created_at)}
                      </p>

                      {messageMenuOpen === message.id && (
                        <div
                          className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} top-full mt-1 backdrop-blur-xl rounded-lg shadow-2xl py-1 z-20 min-w-[120px]`}
                          style={{
                            background: 'rgba(227, 213, 200, 0.95)',
                            border: '1px solid rgba(224, 212, 200, 0.5)'
                          }}
                        >
                          {isOwnMessage && message.type === 'text' && (
                            <button
                              onClick={() => onStartEdit(message)}
                              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                              style={{ color: '#3A2A20' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 94, 60, 0.15)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteMessage(message.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageList.displayName = 'MessageList';
