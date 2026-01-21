import React from 'react';

interface MessageItemProps {
  message: any;
  isOwn: boolean;
  isEditing: boolean;
  editingContent: string;
  menuOpen: boolean;
  formatMessageTime: (dateString: string) => string;
  onEditChange: (content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const MessageItem = React.memo<MessageItemProps>(({
  message,
  isOwn,
  isEditing,
  editingContent,
  menuOpen,
  formatMessageTime,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onMenuToggle,
  onEdit,
  onDelete
}) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs mb-1 px-2" style={{ color: '#8B5E3C' }}>
            {message.users?.full_name || message.users?.username || 'Unknown'}
          </span>
        )}
        <div className="relative">
          <div
            className="px-4 py-2 rounded-2xl relative"
            style={{
              background: isOwn ? '#8B5E3C' : 'rgba(107, 88, 74, 0.15)',
              color: isOwn ? '#FFFFFF' : '#3A2A20',
              borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            }}
          >
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => onEditChange(e.target.value)}
                  className="w-full bg-transparent border-b border-white/30 focus:outline-none mb-2"
                  style={{ color: isOwn ? '#FFFFFF' : '#3A2A20' }}
                  autoFocus
                />
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={onSaveEdit}
                    className="px-2 py-1 rounded"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-2 py-1 rounded"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {message.type === 'media' && message.media_url && (
                  <div className="mb-2">
                    {message.media_type?.startsWith('image/') ? (
                      <img
                        src={message.media_url}
                        alt="Media"
                        className="rounded-lg max-w-full h-auto"
                        style={{ maxHeight: '300px' }}
                      />
                    ) : message.media_type?.startsWith('video/') ? (
                      <video
                        src={message.media_url}
                        controls
                        className="rounded-lg max-w-full"
                        style={{ maxHeight: '300px' }}
                      />
                    ) : (
                      <a
                        href={message.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 underline"
                      >
                        <span>📎</span>
                        <span>{message.file_name || 'File'}</span>
                      </a>
                    )}
                  </div>
                )}
                <p className="break-words whitespace-pre-wrap">{message.content}</p>
              </>
            )}
          </div>
          {isOwn && !isEditing && (
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onMenuToggle}
                className="p-1 rounded-full hover:bg-white/10"
                style={{ color: '#8B5E3C' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-1 py-1 rounded-lg shadow-lg z-10"
                  style={{ background: '#FFFFFF', minWidth: '120px' }}
                >
                  <button
                    onClick={onEdit}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    style={{ color: '#3A2A20' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    style={{ color: '#DC2626' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <span className="text-xs mt-1 px-2" style={{ color: '#8B5E3C' }}>
          {formatMessageTime(message.created_at)}
        </span>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';
