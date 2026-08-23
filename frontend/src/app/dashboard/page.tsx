'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';

interface Interview {
  _id: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score?: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await api('/interviews');

        setInterviews(data.interviews || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  const evaluatedInterviews = interviews.filter((interview) => interview.score !== undefined);

  const totalInterviews = interviews.length;

  const averageScore =
    evaluatedInterviews.length > 0
      ? evaluatedInterviews.reduce((total, interview) => total + (interview.score || 0), 0) /
        evaluatedInterviews.length
      : 0;

  const bestScore =
    evaluatedInterviews.length > 0
      ? Math.max(...evaluatedInterviews.map((interview) => interview.score || 0))
      : 0;

  return (
    <AuthGuard>
      <AppShell>
        <main className="min-h-full bg-background text-foreground">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Hero */}
            <section className="mb-10">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="relative p-6 sm:p-8 lg:p-10">
                  {/* Subtle background decoration */}
                  <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

                  <div className="relative max-w-3xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                      Dashboard
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                      Ready for your next interview?
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
                      Practice technical interviews with AI-generated questions and get detailed
                      feedback on your answers.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push('/interview/create')}
                      className="mt-6 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      + Start New Interview
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <section className="mb-10">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-text-primary">Your Statistics</h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Track your interview performance over time.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Total Interviews */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/30">
                  <p className="text-sm text-text-secondary">Total Interviews</p>

                  <p className="mt-2 text-3xl font-bold text-text-primary">{totalInterviews}</p>

                  <p className="mt-1 text-sm text-muted">Interviews completed</p>
                </div>

                {/* Average Score */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/30">
                  <p className="text-sm text-text-secondary">Average Score</p>

                  <p className="mt-2 text-3xl font-bold text-accent">
                    {evaluatedInterviews.length > 0 ? `${averageScore.toFixed(1)}/10` : 'N/A'}
                  </p>

                  <p className="mt-1 text-sm text-muted">Across evaluated interviews</p>
                </div>

                {/* Best Score */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/30">
                  <p className="text-sm text-text-secondary">Best Score</p>

                  <p className="mt-2 text-3xl font-bold text-emerald-500">
                    {evaluatedInterviews.length > 0 ? `${bestScore}/10` : 'N/A'}
                  </p>

                  <p className="mt-1 text-sm text-muted">Your highest score</p>
                </div>
              </div>
            </section>

            {/* Interview History */}
            <section id="history">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">Interview History</h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Review your previous interviews and results.
                  </p>
                </div>

                {interviews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => router.push('/interview/create')}
                    className="hidden rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-hover hover:text-text-primary sm:block"
                  >
                    New Interview
                  </button>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />

                  <p className="text-sm text-text-secondary">Loading interviews...</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && interviews.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl text-accent">
                    ✦
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-text-primary">
                    No interviews yet
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary">
                    Start your first AI-powered mock interview.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push('/interview/create')}
                    className="mt-5 rounded-xl bg-accent px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                  >
                    Start Interview
                  </button>
                </div>
              )}

              {/* Interview list */}
              {!loading && !error && interviews.length > 0 && (
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-accent/30 hover:shadow-md sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Interview information */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {interview.role}
                            </h3>

                            <span
                              className={`
                                rounded-full px-3 py-1 text-xs font-medium capitalize
                                ${
                                  interview.difficulty === 'easy'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : interview.difficulty === 'medium'
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                }
                              `}
                            >
                              {interview.difficulty}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-muted">
                            {new Date(interview.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Score + View */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted">Score</p>

                            <p
                              className={`text-lg font-bold ${
                                interview.score !== undefined ? 'text-accent' : 'text-muted'
                              }`}
                            >
                              {interview.score !== undefined
                                ? `${interview.score}/10`
                                : 'Not evaluated'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                interview.score !== undefined
                                  ? `/interview/${interview._id}/results`
                                  : `/interview/${interview._id}`
                              )
                            }
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </AppShell>
    </AuthGuard>
  );
}
