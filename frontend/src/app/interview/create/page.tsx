'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';

export default function CreateInterviewPage() {
  const router = useRouter();

  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!role.trim()) {
      setError('Please enter a job role.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await api('/interviews/generate', {
        method: 'POST',
        body: JSON.stringify({
          role: role.trim(),
          difficulty,
          count,
        }),
      });

      router.push(`/interview/${data.interview._id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    {
      value: 'easy',
      title: 'Easy',
      description: 'Fundamental concepts',
      icon: '●',
    },
    {
      value: 'medium',
      title: 'Medium',
      description: 'Intermediate concepts',
      icon: '◆',
    },
    {
      value: 'hard',
      title: 'Hard',
      description: 'Advanced concepts',
      icon: '★',
    },
  ];

  return (
    <AuthGuard>
      <AppShell>
        <main className="min-h-full bg-background text-foreground">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page heading */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                    New Interview
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    Create your mock interview
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                    Choose your role, difficulty, and number of questions. Our AI will generate a
                    technical interview tailored to your selection.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-fit rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                >
                  ← Dashboard
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface shadow-sm"
            >
              <div className="p-6 sm:p-8">
                {/* Role */}
                <div className="mb-8">
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Job Role
                  </label>

                  <input
                    id="role"
                    type="text"
                    value={role}
                    onChange={(event) => {
                      setRole(event.target.value);
                      setError('');
                    }}
                    placeholder="e.g. Software Engineer"
                    disabled={loading}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    Examples: Software Engineer, Backend Developer, Frontend Developer, Data
                    Engineer
                  </p>
                </div>

                {/* Difficulty */}
                <div className="mb-8">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-text-primary">
                      Difficulty
                    </label>

                    <p className="mt-1 text-xs text-text-muted">
                      Choose the level that best matches your preparation.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {difficultyOptions.map((option) => {
                      const selected = difficulty === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setDifficulty(option.value);
                            setError('');
                          }}
                          className={`
                            group rounded-xl border p-4 text-left transition
                            ${
                              selected
                                ? 'border-accent bg-accent/10 ring-1 ring-accent'
                                : 'border-border bg-background hover:border-accent/50 hover:bg-surface-hover'
                            }
                            disabled:cursor-not-allowed disabled:opacity-50
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p
                                className={`font-semibold ${
                                  selected ? 'text-accent' : 'text-text-primary'
                                }`}
                              >
                                {option.title}
                              </p>

                              <p className="mt-1 text-xs text-text-muted">{option.description}</p>
                            </div>

                            <span
                              className={`text-xs ${selected ? 'text-accent' : 'text-text-muted'}`}
                            >
                              {option.icon}
                            </span>
                          </div>

                          {selected && (
                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-accent">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                              Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Number of questions */}
                <div className="mb-8">
                  <label
                    htmlFor="count"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Number of Questions
                  </label>

                  <select
                    id="count"
                    value={count}
                    onChange={(event) => setCount(Number(event.target.value))}
                    disabled={loading}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>

                  <p className="mt-2 text-xs text-text-muted">
                    More questions provide a broader evaluation of your technical knowledge.
                  </p>
                </div>

                {/* Interview summary */}
                <div className="mb-8 rounded-xl border border-border bg-surface-secondary p-5">
                  <p className="text-sm font-semibold text-text-primary">Interview Summary</p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-text-muted">Role</p>
                      <p className="mt-1 truncate text-sm font-medium text-text-primary">
                        {role.trim() || 'Not selected'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted">Difficulty</p>
                      <p className="mt-1 capitalize text-sm font-medium text-text-primary">
                        {difficulty}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted">Questions</p>
                      <p className="mt-1 text-sm font-medium text-text-primary">{count}</p>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">
                        !
                      </div>

                      <p className="text-sm leading-6 text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-accent px-6 py-3.5 font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Generating interview...
                    </span>
                  ) : (
                    'Generate Interview'
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-text-muted">
                  AI-generated questions may take a few seconds.
                </p>
              </div>
            </form>

            {/* Bottom information */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
              <span>✦</span>
              <span>Your interview will be evaluated by AI after completion.</span>
            </div>
          </div>
        </main>
      </AppShell>
    </AuthGuard>
  );
}
