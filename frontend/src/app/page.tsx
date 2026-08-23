'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Connecting to backend...');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);

        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();

        setMessage(data.message);
      } catch (error) {
        console.error(error);
        setError('Could not connect to backend');
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">AI Mock Interviewer</h1>

        <p className="mt-4">{error || message}</p>
      </div>
    </main>
  );
}
