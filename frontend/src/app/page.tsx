'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';

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
    <MarketingShell>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4" style={{ color: '#8B5E3C' }}>
              Company Introduction
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5" style={{ color: '#3A2A20' }}>
              Connect Smarter. Connect Deeper.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: '#6B584A' }}>
              NeuraChat is a communication platform that combines intelligent messaging, built-in AI assistance,
              and real-time calls so growing teams can move faster with less friction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="px-6 py-3 rounded-lg font-semibold text-white"
                style={{ background: '#6B4A2F' }}
              >
                Explore Services
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-lg font-semibold"
                style={{ border: '1px solid #D1BFA7', color: '#8B5E3C', background: 'rgba(255,255,255,0.65)' }}
              >
                Meet Our Team
              </Link>
            </div>
          </div>
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid #E0D4C8' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#3A2A20' }}>
              Why teams choose NeuraChat
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full" style={{ background: '#8B5E3C' }} />
                <p style={{ color: '#6B584A' }}>Reduce app switching with chat, calls, and AI in one workflow.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full" style={{ background: '#8B5E3C' }} />
                <p style={{ color: '#6B584A' }}>Keep conversations actionable through real-time collaboration tools.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full" style={{ background: '#8B5E3C' }} />
                <p style={{ color: '#6B584A' }}>Scale from startup squads to enterprise communication hubs.</p>
              </li>
            </ul>
            <Link
              href="/contact"
              className="inline-block mt-8 font-semibold"
              style={{ color: '#8B5E3C' }}
            >
              Contact our team &rarr;
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}