'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

interface TopbarProps {
  onMenuClick: () => void;
}

interface User {
  id?: string;
  name?: string;
  email?: string;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const getInitials = (name?: string) => {
    if (!name) {
      return 'U';
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 1).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push('/login');
  };

  const initials = getInitials(user?.name);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-surface-hover hover:text-text-primary lg:hidden"
        >
          ☰
        </button>

        {/* Application name */}
        <div>
          <p className="text-sm font-semibold text-text-primary">AI Mock Interviewer</p>

          <p className="hidden text-xs text-text-secondary sm:block">
            Practice smarter. Interview better.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme */}
        <ThemeToggle />

        <div className="hidden h-6 w-px bg-border sm:block" />

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label="Open user menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-surface-hover"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              {initials}
            </div>

            {/* User name */}
            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-medium text-text-primary">
                {user?.name || 'User'}
              </p>

              <p className="max-w-32 truncate text-xs text-text-secondary">{user?.email || ''}</p>
            </div>

            {/* Dropdown arrow */}
            <span className="hidden text-xs text-text-secondary sm:block">▾</span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
              {/* User information */}
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {user?.name || 'User'}
                </p>

                <p className="mt-1 truncate text-xs text-text-secondary">{user?.email || ''}</p>
              </div>

              {/* Menu */}
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/dashboard');
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/dashboard');
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                >
                  My Interviews
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                >
                  Settings
                </button>

                <div className="my-1 border-t border-border" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
