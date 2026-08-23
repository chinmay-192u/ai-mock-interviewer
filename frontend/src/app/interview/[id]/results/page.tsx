'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';

interface Question {
  _id: string;
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
}

interface Interview {
  _id: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  score?: number;
  overallFeedback?: string;
  createdAt: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();

  const interviewId = params.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await api(`/interviews/${interviewId}`);

        setInterview(data.interview);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load interview results');
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [interviewId]);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <AuthGuard>
        <AppShell>
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-6 text-foreground">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />

              <p className="text-sm text-text-secondary">Loading results...</p>
            </div>
          </main>
        </AppShell>
      </AuthGuard>
    );
  }

  /*
   * Error state
   */
  if (!interview) {
    return (
      <AuthGuard>
        <AppShell>
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-6 text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-lg font-bold text-red-600 dark:text-red-400">
                !
              </div>

              <h1 className="mt-4 text-xl font-semibold text-text-primary">
                Unable to load results
              </h1>

              <p className="mt-3 text-sm leading-6 text-red-600 dark:text-red-400">
                {error || 'Interview not found.'}
              </p>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="mt-6 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        </AppShell>
      </AuthGuard>
    );
  }

  /*
   * Score styling
   */
  const score = interview.score;

  const scoreColor =
    score === undefined
      ? 'text-text-secondary'
      : score >= 8
        ? 'text-emerald-500'
        : score >= 6
          ? 'text-amber-500'
          : 'text-red-500';

  const scoreLabel =
    score === undefined
      ? 'Not evaluated'
      : score >= 8
        ? 'Excellent performance'
        : score >= 6
          ? 'Good performance'
          : 'Needs improvement';

  return (
    <AuthGuard>
      <AppShell>
        <main className="min-h-full bg-background text-foreground">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page heading */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Interview Results
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    {interview.role}
                  </h1>

                  <p className="mt-2 text-sm text-text-secondary">
                    Review your performance, answers, and AI feedback.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`
                      rounded-full px-4 py-2 text-sm font-medium capitalize
                      ${
                        interview.difficulty === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : interview.difficulty === 'medium'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }
                    `}
                  >
                    {interview.difficulty} difficulty
                  </span>

                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Overall score */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-text-secondary">Overall Score</p>

                  <p className={`mt-3 text-6xl font-bold tracking-tight ${scoreColor}`}>
                    {score !== undefined ? `${score}/10` : '—'}
                  </p>

                  <p className="mt-2 text-sm text-text-secondary">{scoreLabel}</p>
                </div>

                {score !== undefined && (
                  <div className="mx-auto mt-8 max-w-md">
                    <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
                      <div
                        className={`
                          h-full rounded-full transition-all duration-700
                          ${
                            score >= 8
                              ? 'bg-emerald-500'
                              : score >= 6
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }
                        `}
                        style={{
                          width: `${Math.min(Math.max(score * 10, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Overall feedback */}
            <section className="mb-8 rounded-2xl border border-border bg-surface shadow-sm">
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    ✦
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">Overall Feedback</h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      AI-generated summary of your interview performance.
                    </p>
                  </div>
                </div>

                {interview.overallFeedback ? (
                  <div className="mt-6 rounded-xl border border-border bg-surface-secondary p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-text-primary">
                      {interview.overallFeedback}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl border border-border bg-surface-secondary p-5">
                    <p className="text-sm text-text-secondary">
                      Overall feedback is not available for this interview.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Question breakdown */}
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-text-primary">Question Breakdown</h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Review each answer and the feedback provided by the AI interviewer.
                </p>
              </div>

              <div className="space-y-6">
                {interview.questions.map((question, index) => {
                  const questionScore = question.score;

                  const questionScoreColor =
                    questionScore === undefined
                      ? 'text-text-secondary'
                      : questionScore >= 8
                        ? 'text-emerald-500'
                        : questionScore >= 6
                          ? 'text-amber-500'
                          : 'text-red-500';

                  return (
                    <article
                      key={question._id}
                      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                    >
                      {/* Question header */}
                      <div className="border-b border-border px-6 py-6 sm:px-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-4">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
                              {index + 1}
                            </span>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-accent">
                                Question {index + 1}
                              </p>

                              <h3 className="mt-2 text-lg font-semibold leading-relaxed text-text-primary">
                                {question.question}
                              </h3>
                            </div>
                          </div>

                          {questionScore !== undefined && (
                            <span
                              className={`shrink-0 rounded-lg bg-surface-secondary px-3 py-2 text-sm font-bold ${questionScoreColor}`}
                            >
                              {questionScore}/10
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="px-6 py-6 sm:px-8">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">Your Answer</p>

                          <div className="mt-3 rounded-xl border border-border bg-surface-secondary p-5">
                            <p className="whitespace-pre-wrap text-sm leading-7 text-text-primary">
                              {question.answer || 'No answer provided.'}
                            </p>
                          </div>
                        </div>

                        {/* AI feedback */}
                        <div className="mt-6">
                          <p className="text-sm font-semibold text-text-primary">AI Feedback</p>

                          {question.feedback ? (
                            <div className="mt-3 rounded-xl border border-border bg-background p-5">
                              <p className="whitespace-pre-wrap text-sm leading-7 text-text-secondary">
                                {question.feedback}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-3 rounded-xl border border-border bg-background p-5">
                              <p className="text-sm text-text-secondary">
                                No feedback available for this question.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Bottom actions */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push('/interview/create')}
                className="w-full rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 sm:w-auto"
              >
                Start New Interview
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-text-primary transition hover:bg-surface-hover sm:w-auto"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </AppShell>
    </AuthGuard>
  );
}
