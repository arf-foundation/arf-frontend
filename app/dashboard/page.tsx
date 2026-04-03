'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { z } from 'zod';

// Schema for risk API response
const RiskDataSchema = z.object({
  system_risk: z.number().min(0).max(1),
  status: z.enum(['critical', 'warning', 'safe']).catch('warning'),
});

type RiskData = z.infer<typeof RiskDataSchema>;

export default function Dashboard() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const fetchRisk = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`/api/v1/get_risk`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized – check API credentials');
        if (response.status === 404) throw new Error('Risk endpoint not found');
        if (response.status >= 500) throw new Error('Server error – please try later');
        throw new Error(`HTTP error ${response.status}`);
      }

      const rawData = await response.json();
      
      // Validate response schema
      const validatedData = RiskDataSchema.parse(rawData);

      if (isMounted.current) {
        setRisk(validatedData);
        setFetchedAt(new Date());
        setError(null);
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out – please check your connection');
        } else if (err instanceof z.ZodError) {
          setError('Unable to parse risk data – invalid format from server');
        } else if (err instanceof Error) {
          setError(err.message || 'Failed to load risk data');
        } else {
          setError('Failed to load risk data');
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
    fetchRisk();

    return () => {
      isMounted.current = false;
    };
  }, [fetchRisk]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl" role="status" aria-label="Loading">
          <div className="animate-pulse">Loading risk data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div role="alert" className="text-red-600 mb-6">
            <p className="font-bold mb-2">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchRisk();
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        No risk data available
      </div>
    );
  }

  const statusColor = 
    risk.status === 'critical' ? 'bg-red-600' :
    risk.status === 'warning' ? 'bg-yellow-500' :
    'bg-green-500';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ARF System Risk</h1>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Risk Score</span>
            <span className="font-mono text-2xl font-bold text-gray-900">
              {(risk.system_risk * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className={`h-2 rounded transition-all ${statusColor}`}
              style={{ width: `${risk.system_risk * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-white font-medium text-sm ${statusColor}`}>
            {risk.status.toUpperCase()}
          </span>
        </div>

        {fetchedAt && (
          <p className="text-xs text-gray-500 text-center">
            Last updated: {fetchedAt.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}