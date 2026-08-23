'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      document.documentElement.classList.toggle('dark', prefersDark);
      setDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = dark ? 'light' : 'dark';

    document.documentElement.classList.toggle('dark', nextTheme === 'dark');

    localStorage.setItem('theme', nextTheme);
    setDark(nextTheme === 'dark');
  };

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
    >
      {dark ? '☀' : '☾'}
    </button>
  );
}
