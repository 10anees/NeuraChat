import React from 'react';

export const DashboardEmptyState: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center relative z-10">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div
            className="absolute inset-0 rounded-full blur-lg opacity-30"
            style={{ background: '#8B5E3C' }}
          />
          <div
            className="relative w-24 h-24 backdrop-blur-sm rounded-full flex items-center justify-center"
            style={{ background: 'rgba(227, 213, 200, 0.4)', border: '1px solid #E0D4C8' }}
          >
            <svg
              className="w-12 h-12"
              style={{ color: '#8B5E3C' }}
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
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: '#8B5E3C' }}>
          Select a conversation to start messaging
        </h2>
        <p style={{ color: '#6B584A' }}>Choose from your existing conversations or start a new one</p>
      </div>
    </div>
  );
};
