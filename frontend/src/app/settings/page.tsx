'use client';

import { useState, useEffect, useRef } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import EditProfileModal from '@/components/EditProfileModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state to reflect updates immediately
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.full_name || '');
      setUsername(user.username || '');
      setStatusMessage(user.status_message || '');
      setAvatarUrl(user.avatar_url || null);
    }
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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

  const handleProfileUpdated = (updated: { full_name: string; username: string; status_message: string }) => {
    setDisplayName(updated.full_name);
    setUsername(updated.username);
    setStatusMessage(updated.status_message);
    setIsEditProfileOpen(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setAvatarUploading(true);
    try {
      const response = await api.uploadAvatar(file) as { avatar_url: string };
      setAvatarUrl(response.avatar_url);
      // Refresh user context to update avatar everywhere
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      alert(error.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;

    setAvatarUploading(true);
    try {
      await api.deleteAvatar();
      setAvatarUrl(null);
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error: any) {
      console.error('Avatar delete error:', error);
      alert(error.message || 'Failed to delete avatar');
    } finally {
      setAvatarUploading(false);
    }
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
            Settings
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 mt-16 lg:mt-0">
          <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 xl:max-w-3xl">
            {/* Header */}
            <div className="mb-4 lg:mb-6">
              <h1 className="text-xl lg:text-3xl font-bold mb-2 hidden lg:block" style={{ color: '#8B5E3C' }}>
                Settings
              </h1>
              <p className="text-xs lg:text-sm hidden lg:block" style={{ color: '#6B584A' }}>Manage your account and preferences</p>
            </div>

            {/* Profile Section */}
            <div className="relative backdrop-blur-xl rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg" style={{ background: 'rgba(227, 213, 200, 0.6)', border: '1px solid #E0D4C8' }}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold" style={{ color: '#3A2A20' }}>Profile</h2>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-white font-medium rounded-lg transition-all duration-300 text-xs sm:text-sm"
                    style={{ background: '#8B5E3C' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#6B4A2F'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#8B5E3C'}
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div 
                    className="relative group/avatar cursor-pointer flex-shrink-0"
                    onClick={handleAvatarClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg overflow-hidden" style={{ background: '#8B5E3C' }}>
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(displayName || username)
                      )}
                      <div className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity ${avatarUploading ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100'}`}>
                        {avatarUploading ? (
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base mb-1" style={{ color: '#3A2A20' }}>Click to upload a new profile picture</p>
                    <p className="text-xs sm:text-sm mb-2" style={{ color: '#6B584A' }}>Maximum file size: 5MB</p>
                    {avatarUrl && (
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={avatarUploading}
                        className="text-xs transition-colors disabled:opacity-50"
                        style={{ color: '#D97706' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#B45309'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#D97706'}
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Display Name */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#3A2A20' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base backdrop-blur-sm rounded-lg transition-all"
                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
                    aria-label="Display Name"
                  />
                </div>

                {/* Username */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#3A2A20' }}>
                    Username
                  </label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      value={username}
                      readOnly
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base backdrop-blur-sm rounded-lg transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
                      aria-label="Username"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#3A2A20' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base backdrop-blur-sm rounded-lg cursor-not-allowed"
                    style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid #E0D4C8', color: '#6B584A' }}
                    aria-label="Email Address"
                  />
                  <p className="text-xs mt-1" style={{ color: '#8B5E3C' }}>Email address cannot be changed</p>
                </div>

                {/* Status Message */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#3A2A20' }}>
                    Status Message
                  </label>
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={statusMessage}
                    readOnly
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base backdrop-blur-sm rounded-lg transition-all"
                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
                  />
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="relative backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: 'rgba(227, 213, 200, 0.6)', border: '1px solid #E0D4C8' }}>
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#3A2A20' }}>Account</h2>
                
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base backdrop-blur-sm rounded-lg transition-all duration-300"
                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 94, 60, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'}
                  >
                    Change Password
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base backdrop-blur-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#DC2626' }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                  >
                    {loading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm" style={{ color: '#6B584A' }}>
              <p>Account created: <span style={{ color: '#8B5E3C', fontWeight: 500 }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentValues={{
          full_name: displayName,
          username: username,
          status_message: statusMessage,
        }}
        onSave={handleProfileUpdated}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </AuthGuard>
  );
}