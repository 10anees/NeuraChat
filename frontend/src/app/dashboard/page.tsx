'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import NewChatModal from '@/components/NewChatModal';
import { useAuth } from '@/context/AuthContext';
import socketClient from '@/lib/socket';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import AIMessageAssistant from '@/components/AIMessageAssistant';
import { IncomingCallModal } from '@/components/incoming-call-modal';
import { InCallUI } from '@/components/in-call-ui';
import { InCallVideoUI } from '@/components/in-call-video-ui';
import { CallFloatingBar } from '@/components/call-floating-bar';
import { useCall } from '@/hooks/useCall';
import { OutgoingCallUI } from '@/components/outgoing-call-ui';
import FileUploadModal from '@/components/FileUploadModal';
import UserProfileModal from '@/components/UserProfileModal';
import { ChatListFull } from '@/components/ChatListFull';
import { NotificationPanel } from '@/components/NotificationPanel';
import { MessageList } from '@/components/MessageList';
import { DashboardMobileHeader } from '@/components/DashboardMobileHeader';
import { DashboardEmptyState } from '@/components/DashboardEmptyState';
import { DashboardChatList } from '@/components/DashboardChatList';
import { DashboardChatArea } from '@/components/DashboardChatArea';
import { useNotifications } from '@/hooks/useNotifications';
import { useChatManagement } from '@/hooks/useChatManagement';
import { useMessageEditor } from '@/hooks/useMessageEditor';
import { getMediaUrl, getMediaFilename, getMediaFileType } from '@/utils/mediaHelpers';
import { formatTime, formatMessageTime, getInitials } from '@/utils/formatters';
import { getChatName, getOtherUserNameByChatId, getChatAvatar } from '@/utils/chatHelpers';

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

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // Call functionality
  const { callState, currentCall, isMuted, isCameraOff, isSpeakerMuted, callStartedAt, remoteVideoTracks, isCallUiMinimized, initiateCall, acceptCall, rejectCall, endCall, toggleMute, toggleCamera, toggleSpeaker, resetCallSession, handleJoin, minimizeCallUi, restoreCallUi } = useCall();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Custom hooks for chat and notifications
  const {
    chats,
    messages,
    loading,
    sendingMessage,
    fetchChats,
    fetchMessages,
    handleSendMessage: sendMessage,
    handleTyping: startTyping,
    updateChatLastMessage,
    addMessage,
    updateMessage,
    removeMessage,
    setChats,
    setMessages,
  } = useChatManagement();

  const {
    notifications,
    fetchNotifications,
    getUnreadCountForChat,
    getTotalUnreadCount,
    markChatNotificationsAsRead,
    handleMarkNotificationRead,
    handleMarkAllRead,
    addNotification,
  } = useNotifications();

  const {
    editingMessageId,
    editingContent,
    setEditingContent,
    isDeleteModalOpen,
    startEdit,
    cancelEdit,
    saveEdit,
    initiateDelete,
    confirmDelete,
    closeDeleteModal,
  } = useMessageEditor(updateMessage);

  const handleUserClick = useCallback((userId: string) => {
    if (userId !== user?.id) {
      setSelectedUserId(userId);
      setIsUserProfileModalOpen(true);
    }
  }, [user?.id]);

  const handleApplyAIEnhancement = useCallback((enhancedMessage: string) => {
    setMessageInput(enhancedMessage);
    setIsAIAssistantOpen(false);
  }, []);

  useEffect(() => {
    fetchChats();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!user) return;

    const cleanupFns: Array<() => void> = [];

    const attachHandlers = (socketInstance: any) => {
      const dashboardIncomingCallHandler = (data: any) => {
        // Incoming call is handled by useCall hook
      };
      socketInstance.on('incoming-call', dashboardIncomingCallHandler);

      // Listen for real-time notifications
      const notificationHandler = (notification: Notification) => {
        addNotification(notification);
      };
      socketInstance.on('notification:new', notificationHandler);

      // Listen for chat updates
      const chatUpdatedHandler = (data: { chatId: string; lastMessage: any }) => {
        updateChatLastMessage(data.chatId, data.lastMessage);
      };
      socketInstance.on('chat:updated', chatUpdatedHandler);

      socketClient.onNewMessage((message: Message) => {
        if (selectedChat && message.chat_id === selectedChat.id) {
          addMessage(message);
          scrollToBottom();
        }
        updateChatLastMessage(message.chat_id, {
          content: message.content,
          created_at: message.created_at,
          sender_id: message.sender_id,
        });
      });

      socketClient.onMessageUpdated((message: Message) => {
        updateMessage(message);
      });

      socketClient.onMessageDeleted(({ messageId }) => {
        removeMessage(messageId);
      });

      return () => {
        socketInstance.off('incoming-call', dashboardIncomingCallHandler);
        socketInstance.off('notification:new', notificationHandler);
        socketInstance.off('chat:updated', chatUpdatedHandler);
        socketClient.offNewMessage();
        socketClient.offMessageUpdated();
        socketClient.offMessageDeleted();
      };
    };

    socketClient.onReady((sock) => {
      const cleanup = attachHandlers(sock);
      cleanupFns.push(cleanup);
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [user, selectedChat, callState, currentCall]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id, scrollToBottom);
      socketClient.joinChat(selectedChat.id);
      markChatNotificationsAsRead(selectedChat.id);
    }

    return () => {
      if (selectedChat) {
        socketClient.leaveChat(selectedChat.id);
      }
    };
  }, [selectedChat, fetchMessages, markChatNotificationsAsRead]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (messageMenuOpen) {
        setMessageMenuOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [messageMenuOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = useCallback(async () => {
    if (!selectedChat || !user) return;
    await sendMessage(
      messageInput,
      selectedChat.id,
      user.id,
      () => setMessageInput(''),
      (content) => setMessageInput(content)
    );
  }, [selectedChat, user, messageInput, sendMessage]);

  const handleTyping = useCallback(() => {
    if (!selectedChat || !user) return;
    startTyping(selectedChat.id, user.id);
  }, [selectedChat, user, startTyping]);

  // Memoize unread counts for performance
  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    chats.forEach(chat => {
      counts[chat.id] = getUnreadCountForChat(chat.id);
    });
    return counts;
  }, [notifications, chats, getUnreadCountForChat]);

  // Memoize filtered and sorted chats
  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) => {
        const chatName = getChatName(chat, user?.id).toLowerCase();
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
  }, [chats, searchQuery, user?.id, unreadCounts]);

  return (
    <AuthGuard>
      <div className="flex h-screen relative overflow-hidden" style={{ background: '#F5EFEA' }}>
        {/* Background Pattern Effect */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(139, 94, 60, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        <Sidebar isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />

        <DashboardMobileHeader
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          totalUnreadCount={getTotalUnreadCount()}
          onToggleNotifications={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
          selectedChat={selectedChat}
          onBackToChats={() => setSelectedChat(null)}
        />

        {/* Chat List */}
        <DashboardChatList
          selectedChat={selectedChat}
          chats={filteredChats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCounts={unreadCounts}
          userId={user?.id || ''}
          loading={loading}
          totalUnreadCount={getTotalUnreadCount()}
          onChatSelect={(chat) => setSelectedChat(chat)}
          onMarkChatRead={markChatNotificationsAsRead}
          onUserClick={handleUserClick}
          onNewChatClick={() => setIsNewChatModalOpen(true)}
          onToggleNotifications={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
          formatTime={formatTime}
          getMediaFileType={getMediaFileType}
          getMediaFilename={getMediaFilename}
        />

        {/* Chat Area */}
        {selectedChat ? (
          <DashboardChatArea
            selectedChat={selectedChat}
            messages={messages}
            messageInput={messageInput}
            sendingMessage={sendingMessage}
            editingMessageId={editingMessageId}
            editingContent={editingContent}
            messageMenuOpen={messageMenuOpen}
            callState={callState}
            isCallUiMinimized={isCallUiMinimized}
            userId={user?.id || ''}
            messagesEndRef={messagesEndRef}
            onMessageInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onEditChange={setEditingContent}
            onSaveEdit={() => saveEdit(messages)}
            onCancelEdit={cancelEdit}
            onStartEdit={startEdit}
            onDeleteMessage={(id) => { initiateDelete(id); setMessageMenuOpen(null); }}
            onMenuToggle={(messageId) => setMessageMenuOpen(messageMenuOpen === messageId ? null : messageId)}
            onUserClick={handleUserClick}
            onFileUpload={() => setIsFileUploadOpen(true)}
            onAIAssistant={() => setIsAIAssistantOpen(true)}
            onInitiateCall={initiateCall}
            onEndCall={endCall}
            onRestoreCallUi={restoreCallUi}
            formatMessageTime={formatMessageTime}
            getInitials={getInitials}
            getMediaFileType={getMediaFileType}
            getMediaUrl={getMediaUrl}
            getMediaFilename={getMediaFilename}
          />
        ) : (
          <DashboardEmptyState />
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete(removeMessage)}
        message="Are you sure you want to delete this message? This action cannot be undone."
      />

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onChatCreated={() => {
          fetchChats();
          setIsNewChatModalOpen(false);
        }}
      />

      {/* AI Message Assistant Modal */}
      <AIMessageAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        originalMessage={messageInput}
        onApply={handleApplyAIEnhancement}
      />

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileModal
          userId={selectedUserId}
          isOpen={isUserProfileModalOpen}
          onClose={() => {
            setIsUserProfileModalOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* NOTIFICATION PANEL */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onNotificationClick={(notification) => {
          if (notification.chat_id) {
            const chat = chats.find((c) => c.id === notification.chat_id);
            if (chat) {
              setSelectedChat(chat);
              setIsNotificationPanelOpen(false);
              handleMarkNotificationRead(notification.id);
            }
          }
        }}
        onMarkAllRead={handleMarkAllRead}
        formatTime={formatTime}
      />

      {/* Incoming Call Modal */}
      {callState === 'ringing' && currentCall && (
        <IncomingCallModal
            isOpen={true}
            callerName={
              // Use fromUserName from Socket.IO if available, otherwise look up from chats
              currentCall.fromUserName || (() => {
                // Try to find caller name from selectedChat first
                if (selectedChat?.participants) {
                  const caller = selectedChat.participants.find((p) => p.id === currentCall.fromUserId);
                  if (caller) {
                    return caller.full_name || caller.username || 'Unknown';
                  }
                }
                // If not found, try to find from all chats
                const chatWithCaller = chats.find((chat) => 
                  chat.id === currentCall.chatId && 
                  chat.participants.some((p) => p.id === currentCall.fromUserId)
                );
                if (chatWithCaller) {
                  const caller = chatWithCaller.participants.find((p) => p.id === currentCall.fromUserId);
                  return caller?.full_name || caller?.username || 'Unknown';
                }
                return 'Unknown Caller';
              })()
            }
            onAccept={acceptCall}
            onReject={rejectCall}
            isProcessing={false}
          />
      )}

      {/* In-Call UI - Audio */}
      {callState === 'in-call' && currentCall && currentCall.callType === 'audio' && !isCallUiMinimized && (
        <InCallUI
          isOpen={true}
          otherUserName={currentCall.isCaller ? (currentCall.toUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id)) : (currentCall.fromUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id))}
          isMuted={isMuted}
          isSpeakerMuted={isSpeakerMuted}
          callStartedAt={callStartedAt}
          audioTrack={currentCall.audioTrack}
          onToggleMute={toggleMute}
          onToggleSpeaker={toggleSpeaker}
          onEndCall={endCall}
          onMinimize={minimizeCallUi}
          onClose={minimizeCallUi}
        />
      )}

      {/* In-Call UI - Video */}
      {callState === 'in-call' && currentCall && currentCall.callType === 'video' && !isCallUiMinimized && (
        <InCallVideoUI
          isOpen={true}
          otherUserName={currentCall.isCaller ? (currentCall.toUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id)) : (currentCall.fromUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id))}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          isSpeakerMuted={isSpeakerMuted}
          callStartedAt={callStartedAt}
          audioTrack={currentCall.audioTrack}
          videoTrack={currentCall.videoTrack}
          remoteVideoTracks={remoteVideoTracks}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
          onToggleSpeaker={toggleSpeaker}
          onEndCall={endCall}
          onMinimize={minimizeCallUi}
          onClose={minimizeCallUi}
        />
      )}

      {/* Minimized call bar */}
      {callState === 'in-call' && currentCall && isCallUiMinimized && (
        <CallFloatingBar
          otherUserName={currentCall.isCaller ? (currentCall.toUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id)) : (currentCall.fromUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id))}
          callType={currentCall.callType || 'audio'}
          callStartedAt={callStartedAt}
          isMuted={isMuted}
          isSpeakerMuted={isSpeakerMuted}
          onResume={restoreCallUi}
          onEnd={endCall}
        />
      )}

      {/* Outgoing call UI */}
      {callState === 'calling' && currentCall?.isCaller && (
        <OutgoingCallUI
          otherUserName={currentCall.toUserName || getOtherUserNameByChatId(chats, currentCall.chatId, user?.id)}
          status="calling"
          onCancel={endCall}
          onReturnToChat={() => {
            resetCallSession();
          }}
          onReturnToDashboard={() => {
            resetCallSession();
            router.push('/dashboard');
          }}
        />
      )}

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
        chatId={selectedChat?.id || ''}
        onFileUploaded={() => {
          if (selectedChat) {
            fetchMessages(selectedChat.id);
          }
        }}
      />
    </AuthGuard>
  );
}