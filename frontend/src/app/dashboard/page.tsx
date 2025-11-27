'use client';

import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock chat data
  const mockChats = [
    {
      id: 1,
      name: 'Sarah Chen',
      initials: 'SC',
      lastMessage: 'Thanks for the report! The analysis...',
      time: '2m ago',
      online: true,
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      initials: 'MR',
      lastMessage: 'Can we schedule a meeting for to...',
      time: '15m ago',
      online: true,
    },
    {
      id: 3,
      name: 'Emily Johnson',
      initials: 'EJ',
      lastMessage: "Perfect! I'll send you the files.",
      time: '1h ago',
      online: false,
    },
    {
      id: 4,
      name: 'David Park',
      initials: 'DP',
      lastMessage: 'The presentation slides are ready f...',
      time: '3h ago',
      online: false,
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      initials: 'LA',
      lastMessage: 'Great work on the project!',
      time: '1d ago',
      online: false,
    },
  ];

  return (
    <AuthGuard>
      <div className="flex h-screen bg-slate-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat List */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-slate-50 mb-4">Chats</h1>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 pl-10 bg-slate-900 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
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
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Chat
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {chat.initials}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-50 truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">
              Select a conversation to start messaging
            </h2>
            <p className="text-slate-500">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}