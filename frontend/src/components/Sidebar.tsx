'use client';

import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: '▦',
    },
    {
      name: 'Interviews',
      href: '/dashboard#history',
      icon: '◫',
    },
    {
      name: 'Practice',
      href: '/interview/create',
      icon: '✦',
    },
  ];

  const handleNavigation = (href: string) => {
    onClose();

    if (href.includes('#')) {
      const [path, hash] = href.split('#');

      if (pathname === path) {
        document.getElementById(hash)?.scrollIntoView({
          behavior: 'smooth',
        });
      } else {
        router.push(href);
      }

      return;
    }

    router.push(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-border
          bg-surface
          transition-transform duration-200
          lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <button
            type="button"
            onClick={() => {
              router.push('/dashboard');
              onClose();
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white shadow-sm">
              AI
            </div>

            <span className="text-sm font-semibold tracking-tight text-text-primary">
              AI Interviewer
            </span>
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-hover hover:text-text-primary lg:hidden"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const [itemPath] = item.href.split('#');

              const active =
                itemPath === '/interview/create'
                  ? pathname.startsWith('/interview/create')
                  : pathname === itemPath;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    flex w-full items-center gap-3
                    rounded-lg px-3 py-2.5
                    text-sm transition
                    ${
                      active
                        ? 'bg-accent/10 font-medium text-accent'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }
                  `}
                >
                  <span
                    className={`
                      flex w-5 items-center justify-center text-base
                      ${active ? 'text-accent' : 'text-text-secondary'}
                    `}
                  >
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* Account */}
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Account
          </p>

          <button
            type="button"
            onClick={() => {
              onClose();

              // Settings page can be implemented later.
              // router.push('/settings');
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
          >
            <span className="flex w-5 items-center justify-center text-base">⚙</span>

            <span>Settings</span>
          </button>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-muted">AI-powered interview practice</p>
        </div>
      </aside>
    </>
  );
}
