'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-void text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-gray-400 text-sm">
          An unexpected error occurred. This might be a temporary issue.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/80 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-surface-highlight border border-border text-gray-200 rounded-md hover:border-gray-500 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
