'use client';

import { useState, useEffect, useRef } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface AIInteraction {
  id: string;
  session_id: string;
  user_query: string;
  ai_response: string;
  created_at: string;
}

interface AISession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function AIAgentPage() {
  const { user } = useAuth();
  const [session, setSession] = useState<AISession | null>(null);
  const [history, setHistory] = useState<AIInteraction[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSession = async () => {
    try {
      const response = await api.getMainAISession() as { session: AISession };
      setSession(response.session);
      await fetchHistory();
    } catch (error: any) {
      console.error('Failed to fetch AI session:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.status
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.getMainSessionHistory() as { history: AIInteraction[] };
      setHistory(response.history || []);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !session || sendingMessage) return;

    const query = messageInput.trim();
    setMessageInput('');
    setSendingMessage(true);

    // Optimistically add user message
    const tempUserMessage: AIInteraction = {
      id: 'temp-' + Date.now(),
      session_id: session.id,
      user_query: query,
      ai_response: '',
      created_at: new Date().toISOString(),
    };
    setHistory((prev) => [...prev, tempUserMessage]);
    scrollToBottom();

    try {
      const response = await api.chatWithAgent(session.id, query) as { response: string };
      
      // Replace temp message with actual response
      setHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          ai_response: response.response,
        };
        return updated;
      });
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setHistory((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
      setMessageInput(query);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
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

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <AuthGuard>
      <div className="flex h-screen relative overflow-hidden" style={{ background: '#F5EFEA' }}>
        {/* Warm Background Accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-10 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(139, 94, 60, 0.08)' }}></div>
          <div className="absolute bottom-1/4 -right-10 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(176, 137, 104, 0.08)', animationDelay: '1s' }}></div>
        </div>
        
        <Sidebar isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 backdrop-blur-xl p-4 flex items-center gap-3" style={{ background: 'rgba(227, 213, 200, 0.8)', borderBottom: '1px solid #E0D4C8' }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="transition-colors p-2"
            style={{ color: '#6B584A' }}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#8B5E3C' }}>
            AI Agent
          </h1>
        </div>

        {/* AI Agent Chat Area */}
        <div className="flex-1 flex flex-col relative z-10 mt-16 lg:mt-0 min-w-0">
          {/* Header */}
          <div className="px-4 py-3 lg:px-6 lg:py-4 backdrop-blur-xl relative" style={{ background: 'rgba(227, 213, 200, 0.8)', borderBottom: '1px solid #E0D4C8' }}>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#B08968' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 animate-pulse" style={{ background: '#8B5E3C', borderColor: '#F5EFEA' }}></div>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold flex items-center gap-2" style={{ color: '#8B5E3C' }}>
                  <span>
                    NeuraChat AI Assistant
                  </span>
                </h2>
                <p className="text-sm" style={{ color: '#6B584A' }}>Your intelligent copilot</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-5 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(139, 94, 60, 0.2)', borderTopColor: '#8B5E3C' }}></div>
                  <p style={{ color: '#6B584A' }}>Loading AI Assistant...</p>
                </div>
              </div>
            ) : history.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="relative w-24 h-24 backdrop-blur-sm rounded-full flex items-center justify-center" style={{ background: 'rgba(176, 137, 104, 0.3)', border: '1px solid #E0D4C8' }}>
                      <svg className="w-12 h-12" style={{ color: '#8B5E3C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#8B5E3C' }}>
                    Welcome to NeuraChat AI Assistant
                  </h2>
                  <p className="mb-4" style={{ color: '#6B584A' }}>
                    I'm your intelligent copilot, ready to help you with messaging, searching, managing chats, and much more.
                  </p>
                  <div className="text-left space-y-2 text-sm" style={{ color: '#6B584A' }}>
                    <p>💬 Send messages on your behalf</p>
                    <p>🔍 Search users and conversations</p>
                    <p>📊 Summarize chat history</p>
                    <p>🌐 Translate messages</p>
                    <p>⏰ Set reminders</p>
                  </div>
                </div>
              </div>
            ) : (
              history.map((interaction) => (
                <div key={interaction.id} className="space-y-4">
                  {/* User Message */}
                  {interaction.user_query && (
                    <div className="flex justify-end">
                      <div className="flex gap-2 max-w-[85%] sm:max-w-[70%] flex-row-reverse">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" style={{ background: '#8B5E3C' }}>
                          {user ? getInitials(user.full_name || user.username) : 'U'}
                        </div>
                        <div className="relative group">
                          <div className="px-4 py-2 rounded-lg text-white" style={{ background: '#D1BFA7', color: '#3A2A20' }}>
                            <p className="whitespace-pre-wrap break-words">{interaction.user_query}</p>
                            <p className="text-xs mt-1" style={{ color: '#6B584A' }}>
                              {formatMessageTime(interaction.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Response */}
                  {interaction.ai_response && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[85%] sm:max-w-[70%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" style={{ background: '#B08968' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="relative group">
                          <div className="text-xs mb-1 px-3 font-medium" style={{ color: '#8B5E3C' }}>
                            AI Assistant
                          </div>
                          <div className="px-4 py-2 rounded-lg backdrop-blur-sm" style={{ background: 'rgba(227, 213, 200, 0.6)', border: '1px solid #E0D4C8', color: '#3A2A20' }}>
                            <p className="whitespace-pre-wrap break-words">{interaction.ai_response}</p>
                            <p className="text-xs mt-1" style={{ color: '#6B584A' }}>
                              {formatMessageTime(interaction.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading indicator for AI response */}
                  {interaction.user_query && !interaction.ai_response && sendingMessage && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[70%]">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-lg shadow-purple-500/30">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="px-4 py-2 rounded-lg backdrop-blur-sm bg-gray-700/40 border border-gray-600/30">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {/* Message Input */}
          <div className="px-4 py-3 lg:px-6 lg:py-4 backdrop-blur-xl relative" style={{ background: 'rgba(227, 213, 200, 0.8)', borderTop: '1px solid #E0D4C8' }}>
            <div className="flex gap-2 lg:gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sendingMessage}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base backdrop-blur-sm rounded-lg transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
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

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sendingMessage}
                className="px-4 lg:px-6 py-2 lg:py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm lg:text-base font-medium"
                style={{ background: '#6B4A2F' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#8B5E3C')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#6B4A2F')}
              >
                {sendingMessage ? (
                  <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="hidden sm:inline">Send</span>
                )}
                {!sendingMessage && (
                  <svg className="sm:hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}