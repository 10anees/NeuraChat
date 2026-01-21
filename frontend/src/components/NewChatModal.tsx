'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: () => void;
}

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatType, setChatType] = useState<'private' | 'group'>('private');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
      setChatType('private');
      setGroupName('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response: any = await api.searchUsers(searchQuery);
        const filteredUsers = response.users.filter((u: User) => u.id !== user?.id);
        setSearchResults(filteredUsers);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, user?.id]);

  const toggleUserSelection = (selectedUser: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u.id === selectedUser.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== selectedUser.id);
      }
      return [...prev, selectedUser];
    });
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    if (chatType === 'group' && !groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (chatType === 'private' && selectedUsers.length > 1) {
      setError('Private chats can only have one other user');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createChat({
        type: chatType,
        name: chatType === 'group' ? groupName : undefined,
        participants: selectedUsers.map((u) => u.id),
      });

      onChatCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="relative w-full max-w-md max-h-[95vh] overflow-hidden">
        {/* Warm Glow Effect */}
        <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: 'rgba(139, 94, 60, 0.15)' }}></div>
        
        {/* Modal */}
        <div className="relative backdrop-blur-xl rounded-2xl max-h-[95vh] flex flex-col shadow-2xl" style={{
          background: 'rgba(227, 213, 200, 0.95)',
          border: '1px solid rgba(224, 212, 200, 0.5)'
        }}>
          {/* Header */}
          <div className="p-4 sm:p-6" style={{ borderBottom: '1px solid rgba(224, 212, 200, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold" style={{ color: '#8B5E3C' }}>
                New Chat
              </h2>
              <button
                title="Close"
                onClick={onClose}
                className="transition-colors p-2 rounded-lg"
                style={{ color: '#6B584A' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#8B5E3C';
                  e.currentTarget.style.background = 'rgba(139, 94, 60, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6B584A';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setChatType('private')}
                className="flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300"
                style={{
                  background: chatType === 'private' ? '#8B5E3C' : 'rgba(107, 88, 74, 0.15)',
                  color: chatType === 'private' ? 'white' : '#6B584A'
                }}
              >
                Private
              </button>
              <button
                onClick={() => setChatType('group')}
                className="flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300"
                style={{
                  background: chatType === 'group' ? '#8B5E3C' : 'rgba(107, 88, 74, 0.15)',
                  color: chatType === 'group' ? 'white' : '#6B584A'
                }}
              >
                Group
              </button>
            </div>

            {/* Group Name Input */}
            {chatType === 'group' && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-2 backdrop-blur-sm rounded-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #E0D4C8',
                    color: '#3A2A20'
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
            )}

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 backdrop-blur-sm rounded-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #E0D4C8',
                  color: '#3A2A20'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8B5E3C';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 94, 60, 0.1)';
                  const icon = e.currentTarget.previousElementSibling as HTMLElement;
                  if (icon) icon.style.color = '#8B5E3C';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E0D4C8';
                  e.currentTarget.style.boxShadow = 'none';
                  const icon = e.currentTarget.previousElementSibling as HTMLElement;
                  if (icon) icon.style.color = '#6B584A';
                }}
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 transition-colors pointer-events-none"
                style={{ color: '#6B584A' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="px-6 py-3" style={{ borderBottom: '1px solid rgba(224, 212, 200, 0.5)' }}>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 backdrop-blur-sm rounded-lg px-3 py-1"
                    style={{
                      background: 'rgba(139, 94, 60, 0.15)',
                      border: '1px solid rgba(139, 94, 60, 0.3)'
                    }}
                  >
                    <span className="text-sm" style={{ color: '#3A2A20' }}>{user.username}</span>
                    <button
                      title="Remove"
                      onClick={() => toggleUserSelection(user)}
                      className="transition-colors"
                      style={{ color: '#6B584A' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8B5E3C'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6B584A'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((searchUser) => {
                  const isSelected = selectedUsers.find((u) => u.id === searchUser.id);
                  return (
                    <button
                      key={searchUser.id}
                      onClick={() => toggleUserSelection(searchUser)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
                      style={{
                        background: isSelected ? 'rgba(139, 94, 60, 0.15)' : 'transparent',
                        border: isSelected ? '1px solid rgba(139, 94, 60, 0.3)' : '1px solid transparent'
                      }}
                      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = 'rgba(107, 88, 74, 0.1)')}
                      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ background: '#8B5E3C' }}>
                          {getInitials(searchUser.full_name || searchUser.username)}
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'rgba(139, 94, 60, 0.2)' }}></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium" style={{ color: '#3A2A20' }}>{searchUser.full_name}</div>
                        <div className="text-sm" style={{ color: '#6B584A' }}>@{searchUser.username}</div>
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5" style={{ color: '#8B5E3C' }} fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : searchQuery.length >= 2 ? (
              <p className="text-center py-8" style={{ color: '#6B584A' }}>No users found</p>
            ) : (
              <p className="text-center py-8" style={{ color: '#6B584A' }}>Search for users to start a chat</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 pb-4">
              <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm shadow-lg shadow-red-500/20">
                {error}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 sm:p-6 flex gap-3" style={{ borderTop: '1px solid rgba(224, 212, 200, 0.5)' }}>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 font-medium rounded-lg transition-all duration-300"
              style={{ background: 'rgba(107, 88, 74, 0.2)', color: '#3A2A20' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107, 88, 74, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(107, 88, 74, 0.2)'}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChat}
              disabled={loading || selectedUsers.length === 0}
              className="flex-1 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
              style={{ background: '#6B4A2F' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#8B5E3C')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#6B4A2F')}
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}