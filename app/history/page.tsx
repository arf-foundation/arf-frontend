'use client';

import { useEffect, useState } from 'react';
import { Decision } from '../types';

export default function HistoryPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/history`, {
          headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data: Decision[] = await res.json();
        setDecisions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/80 border border-red-500/30 p-6 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-400">Error</h2>
          <p className="mb-4 text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Helper to get action based on risk_score
  const getAction = (riskScore?: number) => {
    if (riskScore === undefined) return undefined;
    if (riskScore < 0.2) return 'approve';
    if (riskScore > 0.8) return 'deny';
    return 'escalate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Decision History
        </h1>

        {decisions.length === 0 ? (
          <p className="text-gray-400">No decisions recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {decisions.map((dec) => {
              const action = getAction(dec.risk_score);
              return (
                <div
                  key={dec.decision_id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-gray-300">
                          {dec.decision_id}
                        </span>
                        {dec.risk_score !== undefined && (
                          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                            Risk: {dec.risk_score.toFixed(3)}
                          </span>
                        )}
                        {action && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            action === 'approve' ? 'bg-green-900/50 text-green-300' :
                            action === 'deny' ? 'bg-red-900/50 text-red-300' :
                            'bg-yellow-900/50 text-yellow-300'
                          }`}>
                            {action}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          dec.outcome === 'success' ? 'bg-green-900/50 text-green-300' :
                          dec.outcome === 'failure' ? 'bg-red-900/50 text-red-300' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {dec.outcome || 'pending'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(dec.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
