'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Chats',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      href: '/ai-agent', 
      label: 'AI Agent',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      href: '/calls', 
      label: 'Calls',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    { 
      href: '/settings', 
      label: 'Settings',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-16 backdrop-blur-xl border-r 
          flex flex-col items-center py-4 space-y-6 relative
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: 'rgba(227, 213, 200, 0.8)', borderColor: '#E0D4C8' }}
      >
      {/* Vertical Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, rgba(139, 94, 60, 0.3), rgba(176, 137, 104, 0.3))' }}></div>
      
      {/* Close Button (Mobile Only) */}
      {onMobileClose && (
        <button
          onClick={onMobileClose}
          className="lg:hidden absolute top-4 right-4 transition-colors p-2"
          style={{ color: '#6B584A' }}
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Logo */}
      <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center justify-center group">
        <div className="relative">
          {/* Subtle shadow */}
          <div className="absolute inset-0 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" style={{ background: '#8B5E3C' }}></div>
          {/* Logo */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300" style={{ border: '1px solid #D1BFA7' }}>
            <Image src="/icon.svg" alt="NeuraChat logo" fill sizes="40px" className="object-cover" />
          </div>
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="relative group"
              title={item.label}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full shadow-lg" style={{ background: '#8B5E3C' }}></div>
              )}
              
              {/* Icon Container */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'shadow-lg scale-110'
                    : 'hover:scale-105'
                }`}
                style={isActive ? { background: 'rgba(139, 94, 60, 0.15)', color: '#8B5E3C' } : { color: '#6B584A' }}
              >
                {item.icon(isActive)}
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 backdrop-blur-sm rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl" style={{ background: 'rgba(227, 213, 200, 0.95)', border: '1px solid #E0D4C8', color: '#3A2A20' }}>
                {item.label}
                {/* Arrow */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderRightColor: 'rgba(227, 213, 200, 0.95)' }}></div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="relative group cursor-pointer">
        {/* Subtle shadow */}
        <div className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity" style={{ background: '#8B5E3C' }}></div>
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-lg border-2 group-hover:scale-110 transition-all duration-300 overflow-hidden" style={{ background: '#8B5E3C', borderColor: '#E0D4C8' }}>
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            user ? getInitials(user.full_name || user.username) : 'U'
          )}
        </div>
        
        {/* Online Indicator */}
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 shadow-lg animate-pulse" style={{ background: '#10B981', borderColor: '#F5EFEA', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(139, 94, 60, 0.03), transparent)' }}></div>
      </div>
    </>
  );
}