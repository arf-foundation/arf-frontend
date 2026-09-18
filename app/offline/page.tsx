'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--surface-canvas)]">
      <div className="text-center p-8 bg-[color:var(--surface-raised)] rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-[color:var(--text-primary)] mb-4">You&apos;re Offline</h1>
        <p className="text-[color:var(--text-secondary)] mb-6">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-arf-blue text-white rounded-lg transition hover:brightness-110"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
