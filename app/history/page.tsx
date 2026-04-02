'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Schema for history response
const HistoryItemSchema = z.object({
  time: z.string(),
  risk: z.number().min(0).max(1),
});

const HistoryResponseSchema = z.array(HistoryItemSchema);

type HistoryItem = z.infer<typeof HistoryItemSchema>;

export default function History() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const fetchHistory = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/history`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized – check API credentials');
        if (response.status === 404) throw new Error('History endpoint not found');
        if (response.status >= 500) throw new Error('Server error – please try later');
        throw new Error(`HTTP error ${response.status}`);
      }

      const rawData = await response.json();
      
      // Validate response schema
      const validatedData = HistoryResponseSchema.parse(rawData);

      if (isMounted.current) {
        setData(validatedData);
        setFetchedAt(new Date());
        setError(null);
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out – please check your connection');
        } else if (err instanceof z.ZodError) {
          setError('Unable to parse history data – invalid format from server');
        } else if (err instanceof Error) {
          setError(err.message || 'Failed to load history');
        } else {
          setError('Failed to load history');
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchHistory();

    return () => {
      isMounted.current = false;
    };
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Risk History (Last 24h)</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="h-[400px] bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
<<<<<<< HEAD
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
=======
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Risk History (Last 24h)</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div role="alert" className="text-red-600 mb-4 text-center">
              {error}
            </div>
            <button
              onClick={() => {
                setLoading(true);
                fetchHistory();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
>>>>>>> df58612 (Harden fetch flows, add validation, and enforce tests)
        </div>
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  if (!data || data.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Risk History (Last 24h)</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            No history data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Risk History (Last 24h)</h1>
      {fetchedAt && (
        <p className="text-xs text-gray-500 mb-4">
          Last updated: {fetchedAt.toLocaleTimeString()}
        </p>
      )}
      <div className="bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 1]} />
            <Tooltip formatter={(value: unknown) => {
              if (typeof value === 'number') {
                return value.toFixed(2)
              }
              return String(value ?? '')
            }} />
            <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
>>>>>>> df58612 (Harden fetch flows, add validation, and enforce tests)
      </div>
    </div>
  );
}
