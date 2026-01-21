'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5EFEA' }}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderTopColor: '#8B5E3C', borderRightColor: '#8B5E3C', borderBottomColor: '#E0D4C8', borderLeftColor: '#E0D4C8' }}></div>
          <p className="mt-4" style={{ color: '#6B584A' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5EFEA' }}>
      {/* Navigation */}
      <nav className="px-4 sm:px-6 py-3 backdrop-blur-sm sticky top-0 z-50" style={{ background: 'rgba(227, 213, 200, 0.8)', borderBottom: '1px solid #E0D4C8' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#8B5E3C' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold" style={{ color: '#8B5E3C' }}>NeuraChat</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all font-medium"
              style={{ background: 'rgba(139, 94, 60, 0.1)', color: '#8B5E3C' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 94, 60, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 94, 60, 0.1)'}
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg text-white transition-all font-medium"
              style={{ background: '#6B4A2F' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#8B5E3C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#6B4A2F'}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight" style={{ color: '#8B5E3C' }}>
            AI-Powered Messaging<br className="hidden sm:block" /> Made Simple
          </h1>
          <p className="text-sm sm:text-base lg:text-lg mb-5 sm:mb-6 leading-relaxed" style={{ color: '#6B584A' }}>
            Experience the future of communication with NeuraChat's intelligent assistant, 
            seamless video calls, and real-time messaging—all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={() => router.push('/register')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white text-sm sm:text-base font-semibold transition-all shadow-sm"
              style={{ background: '#6B4A2F' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8B5E3C';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 74, 47, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#6B4A2F';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all"
              style={{ background: 'rgba(139, 94, 60, 0.1)', color: '#8B5E3C', border: '2px solid #E0D4C8' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 94, 60, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 94, 60, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#8B5E3C' }}>
          Everything You Need
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* AI Assistant */}
          <div className="p-4 sm:p-5 rounded-xl backdrop-blur-sm transition-all" 
            style={{ background: 'rgba(227, 213, 200, 0.4)', border: '1px solid #E0D4C8' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(227, 213, 200, 0.6)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 94, 60, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(227, 213, 200, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#B08968' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#3A2A20' }}>AI Assistant</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#6B584A' }}>
              Your intelligent copilot helps with messaging, searching, and managing conversations effortlessly.
            </p>
          </div>

          {/* Video Calls */}
          <div className="p-4 sm:p-5 rounded-xl backdrop-blur-sm transition-all" 
            style={{ background: 'rgba(227, 213, 200, 0.4)', border: '1px solid #E0D4C8' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(227, 213, 200, 0.6)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 94, 60, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(227, 213, 200, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#B08968' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#3A2A20' }}>HD Video Calls</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#6B584A' }}>
              Crystal-clear video and audio calls with real-time notifications and seamless connectivity.
            </p>
          </div>

          {/* Real-time Chat */}
          <div className="p-4 sm:p-5 rounded-xl backdrop-blur-sm transition-all sm:col-span-2 lg:col-span-1" 
            style={{ background: 'rgba(227, 213, 200, 0.4)', border: '1px solid #E0D4C8' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(227, 213, 200, 0.6)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 94, 60, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(227, 213, 200, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#B08968' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#3A2A20' }}>Real-time Messaging</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#6B584A' }}>
              Instant messaging with read receipts, typing indicators, and media sharing capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-4 sm:py-6 backdrop-blur-sm" style={{ background: 'rgba(227, 213, 200, 0.6)', borderTop: '1px solid #E0D4C8' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm" style={{ color: '#6B584A' }}>
          <p>© 2026 NeuraChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}