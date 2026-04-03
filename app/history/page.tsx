'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Schema for history response (matches actual API)
const HistoryItemSchema = z.object({
  decision_id: z.string(),
  timestamp: z.string(),
  risk_score: z.number().min(0).max(1),
  outcome: z.string().nullable(),
});

const HistoryResponseSchema = z.array(HistoryItemSchema);

type HistoryItem = z.infer<typeof HistoryItemSchema>;
type ChartData = { time: string; risk: number };

export default function History() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const fetchHistory = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/api/v1/history', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized – check API credentials');
        if (response.status === 404) throw new Error('History endpoint not found');
        if (response.status >= 500) throw new Error('Server error – please try later');
        throw new Error(`HTTP error ${response.status}`);
      }

      const rawData = await response.json();
      const validatedData = HistoryResponseSchema.parse(rawData);
      
      // Transform to chart format: { time: formatted timestamp, risk: risk_score }
      const chartData = validatedData.map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString(),
        risk: item.risk_score,
      }));

      if (isMounted.current) {
        setData(chartData);
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
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchHistory();
    return () => { isMounted.current = false; };
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
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Risk History (Last 24h)</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div role="alert" className="text-red-600 mb-4 text-center">{error}</div>
            <button
              onClick={() => { setLoading(true); fetchHistory(); }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
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
            <Tooltip formatter={(value: unknown) => typeof value === 'number' ? value.toFixed(2) : String(value ?? '')} />
            <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
