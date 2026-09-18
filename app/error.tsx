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
    // error.message rendered straight to the page (below) until this fix --
    // whatever the underlying exception said, verbatim, to any user who hit
    // this boundary: could be an internal path, a stack detail, or a
    // third-party API's raw error text. Logged here instead; still just
    // console.error, not a real error-tracking service -- that needs a
    // provider chosen and an account set up, which is a decision for
    // whoever owns that, not something to wire up unilaterally.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[color:var(--surface-canvas)] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl text-red-600 mb-4">Something went wrong!</h1>
      <p className="text-[color:var(--text-secondary)] mb-2">Try again, or contact support if it keeps happening.</p>
      {error.digest && (
        <p className="text-xs text-[color:var(--text-secondary)] mb-6 font-mono">Reference: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="px-6 py-2 bg-arf-blue text-white rounded-lg transition hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
