'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              AI
            </div>

            <span className="font-semibold tracking-tight">AI Mock Interviewer</span>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
              >
                {dark ? '☀' : '☾'}
              </button>
            )}

            <button
              onClick={() => router.push('/login')}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              Login
            </button>

            <button
              onClick={() => router.push('/register')}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              AI-powered interview practice
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Practice interviews.
              <br />
              <span className="text-accent">Build confidence.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              Prepare for technical interviews with AI-generated questions, personalized evaluation,
              and detailed feedback on every answer.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => router.push('/register')}
                className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
              >
                Start Practicing
                <span className="ml-2">→</span>
              </button>

              <button
                onClick={() => router.push('/login')}
                className="w-full rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-surface-hover sm:w-auto"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            <Feature
              title="AI-generated interviews"
              description="Generate technical questions based on your role and chosen difficulty."
            />

            <Feature
              title="Detailed evaluation"
              description="Get individual scores, feedback, and an overall assessment of your performance."
            />

            <Feature
              title="Track your progress"
              description="Review previous interviews and understand where you can improve."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} AI Mock Interviewer
          </p>

          <p className="text-sm text-text-muted">Built for better interviews.</p>
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-surface p-8 transition hover:bg-surface-hover">
      <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
        ✦
      </div>

      <h3 className="font-semibold text-text-primary">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
    </div>
  );
}
