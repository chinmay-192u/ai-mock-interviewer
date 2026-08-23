'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20">
            AI
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            AI Mock Interviewer
          </h1>

          <p className="mt-2 text-sm text-text-secondary">Practice smarter. Interview better.</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          {/* Card heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-text-primary">Welcome back</h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Sign in to continue your interview practice.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-primary">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError('');
                }}
                placeholder="you@example.com"
                required
                autoComplete="email"
                disabled={loading}
                className="
                  w-full rounded-xl
                  border border-border
                  bg-background
                  px-4 py-3
                  text-sm text-text-primary
                  outline-none
                  transition
                  placeholder:text-text-muted
                  focus:border-accent
                  focus:ring-2
                  focus:ring-accent/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={loading}
                className="
                  w-full rounded-xl
                  border border-border
                  bg-background
                  px-4 py-3
                  text-sm text-text-primary
                  outline-none
                  transition
                  placeholder:text-text-muted
                  focus:border-accent
                  focus:ring-2
                  focus:ring-accent/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">
                    !
                  </div>

                  <p className="text-sm leading-6 text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex w-full items-center justify-center
                rounded-xl
                bg-accent
                px-6 py-3.5
                font-semibold text-white
                shadow-lg shadow-accent/20
                transition
                hover:opacity-90
                focus:outline-none
                focus:ring-2
                focus:ring-accent/50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-border pt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-accent transition hover:opacity-80"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-text-muted">
          AI-powered technical interview practice
        </p>
      </div>
    </main>
  );
}
