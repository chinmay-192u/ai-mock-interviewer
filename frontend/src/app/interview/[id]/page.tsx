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
}

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();

  const interviewId = params.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await api(`/interviews/${interviewId}`);

        const loadedInterview = data.interview;

        // If already evaluated, don't allow the user
        // to continue answering it.
        if (loadedInterview.score !== undefined) {
          router.replace(`/interview/${interviewId}/results`);
          return;
        }

        setInterview(loadedInterview);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load interview');
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [interviewId, router]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please enter an answer before continuing.');
      return;
    }

    if (!interview) {
      return;
    }

    const question = interview.questions[currentQuestion];

    try {
      setSubmitting(true);
      setError('');

      // Save answer
      await api(`/interviews/${interviewId}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          questionId: question._id,
          answer: answer.trim(),
        }),
      });

      // Move to next question
      if (currentQuestion < interview.questions.length - 1) {
        setCurrentQuestion((previous) => previous + 1);
        setAnswer('');
        return;
      }

      // Last question -> evaluate complete interview
      try {
        await api(`/interviews/${interviewId}/evaluate`, {
          method: 'POST',
        });

        router.replace(`/interview/${interviewId}/results`);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to evaluate interview');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <AuthGuard>
        <AppShell>
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-6 text-foreground">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />

              <p className="text-sm text-text-secondary">Loading interview...</p>
            </div>
          </main>
        </AppShell>
      </AuthGuard>
    );
  }

  /*
   * Error / interview not found
   */
  if (!interview) {
    return (
      <AuthGuard>
        <AppShell>
          <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-6 text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                !
              </div>

              <h1 className="mt-4 text-xl font-semibold text-text-primary">
                Unable to load interview
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

  const question = interview.questions[currentQuestion];

  const progress = ((currentQuestion + 1) / interview.questions.length) * 100;

  return (
    <AuthGuard>
      <AppShell>
        <main className="min-h-full bg-background text-foreground">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Top section */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Technical Interview
                  </p>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    {interview.role}
                  </h1>

                  <p className="mt-2 text-sm text-text-secondary">
                    Answer each question carefully. Your responses will be evaluated by AI after the
                    interview.
                  </p>
                </div>

                <span
                  className={`
                    w-fit shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize
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
              </div>
            </div>

            {/* Progress */}
            <section className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Interview Progress</span>

                <span className="text-sm font-medium text-text-primary">
                  {currentQuestion + 1} / {interview.questions.length}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {/* Question card */}
            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              {/* Question header */}
              <div className="border-b border-border px-6 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
                    {currentQuestion + 1}
                  </span>

                  <p className="text-sm font-medium text-accent">Question {currentQuestion + 1}</p>
                </div>

                <h2 className="mt-5 text-xl font-semibold leading-relaxed text-text-primary sm:text-2xl">
                  {question.question}
                </h2>
              </div>

              {/* Answer area */}
              <div className="p-6 sm:p-8">
                <div className="mb-3 flex items-center justify-between">
                  <label htmlFor="answer" className="text-sm font-medium text-text-primary">
                    Your Answer
                  </label>

                  <span className="text-xs text-muted">{answer.length} characters</span>
                </div>

                <textarea
                  id="answer"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setError('');
                  }}
                  placeholder="Explain your answer clearly. Include examples where appropriate..."
                  rows={12}
                  disabled={submitting}
                  className="
                    w-full resize-none rounded-xl
                    border border-border
                    bg-background
                    px-4 py-4
                    text-sm leading-relaxed
                    text-text-primary
                    outline-none
                    transition
                    placeholder:text-muted
                    focus:border-accent
                    focus:ring-2
                    focus:ring-accent/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted">Take your time and explain your reasoning.</p>

                  <p className="text-xs text-muted">
                    Clear explanations help improve your evaluation.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answer.trim()}
                  className="
                    mt-6 w-full rounded-xl
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
                    disabled:opacity-50
                    disabled:shadow-none
                  "
                >
                  {submitting
                    ? currentQuestion === interview.questions.length - 1
                      ? 'Evaluating interview...'
                      : 'Saving answer...'
                    : currentQuestion === interview.questions.length - 1
                      ? 'Submit Final Answer'
                      : 'Submit Answer →'}
                </button>
              </div>
            </section>

            {/* Interview information */}
            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center">
              <p className="text-xs text-muted">
                Question {currentQuestion + 1} of {interview.questions.length}
              </p>

              <p className="text-xs text-muted">
                Your answers are evaluated after you complete the interview.
              </p>
            </div>

            {/* Exit */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                disabled={submitting}
                className="rounded-lg px-4 py-2 text-sm text-text-secondary transition hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
              >
                Exit Interview
              </button>
            </div>
          </div>
        </main>
      </AppShell>
    </AuthGuard>
  );
}
