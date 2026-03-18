import Link from 'next/link';
import { ReactNode } from 'react';
import Image from 'next/image';

interface MarketingShellProps {
  children: ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen" style={{ background: '#F5EFEA' }}>
      <header
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{ background: 'rgba(227, 213, 200, 0.8)', borderBottom: '1px solid #E0D4C8' }}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden" style={{ border: '1px solid #D1BFA7' }}>
              <Image src="/icon.svg" alt="NeuraChat logo" fill sizes="36px" className="object-cover" />
            </div>
            <span className="text-xl font-bold" style={{ color: '#8B5E3C' }}>
              NeuraChat
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm sm:text-base rounded-md font-medium"
                style={{ color: '#6B584A' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(139, 94, 60, 0.1)', color: '#8B5E3C' }}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: '#6B4A2F' }}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {children}

      <footer className="mt-10 py-6" style={{ background: 'rgba(227, 213, 200, 0.6)', borderTop: '1px solid #E0D4C8' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          <p className="text-sm" style={{ color: '#6B584A' }}>
            © 2026 NeuraChat. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: '#6B584A' }}>
            Intelligent communication for modern teams.
          </p>
        </div>
      </footer>
    </div>
  );
}
