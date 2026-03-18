'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#F5EFEA' }}>
      {/* Subtle Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(139, 94, 60, 0.05)' }}></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(176, 137, 104, 0.05)', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(209, 191, 167, 0.03)', animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-sm relative z-10 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl blur-lg opacity-30" style={{ background: 'rgba(139, 94, 60, 0.2)' }}></div>
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid #D1BFA7' }}>
              <Image src="/icon.svg" alt="NeuraChat logo" fill sizes="64px" className="object-cover" priority />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#8B5E3C' }}>
            NeuraChat
          </h1>
          <p className="text-sm" style={{ color: '#6B584A' }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="relative backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl" style={{ background: 'rgba(227, 213, 200, 0.6)', border: '1px solid rgba(139, 94, 60, 0.2)' }}>
          
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="backdrop-blur-sm rounded-lg p-3 text-sm shadow-lg" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#991B1B' }}>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#3A2A20' }}>
                Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 backdrop-blur-sm rounded-lg transition-all duration-300 focus:outline-none text-sm" style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#3A2A20' }}>
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 backdrop-blur-sm rounded-lg transition-all duration-300 focus:outline-none text-sm" style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #E0D4C8', color: '#3A2A20' }}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm transition-colors relative group" style={{ color: '#8B5E3C' }}
              >
                Forgot Password?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ background: '#8B5E3C' }}></span>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:opacity-90 text-sm"
              style={{ background: '#6B4A2F' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-5 text-center text-sm" style={{ color: '#6B584A' }}>
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="transition-colors font-medium relative group" style={{ color: '#8B5E3C' }}
            >
              Sign up
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ background: '#8B5E3C' }}></span>
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(139, 94, 60, 0.05)' }}></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(176, 137, 104, 0.05)' }}></div>
      </div>
    </div>
  );
}