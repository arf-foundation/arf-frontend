'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// Type for the API response (kept exactly as before)
interface RiskData {
  system_risk: number;
  status: string;
}

export default function Home() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track mounted state (prevents state updates after unmount)
  const isMounted = useRef(true);

  // Fetch function with timeout, abort controller, and proper error handling
  const fetchRisk = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_risk`, {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Provide a meaningful message based on HTTP status
        if (response.status === 401) throw new Error('Unauthorized – check API key');
        if (response.status === 404) throw new Error('Risk endpoint not found');
        if (response.status >= 500) throw new Error('Server error – please try later');
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (isMounted.current) {
        setRisk(data);
        setError(null);
      }
    } catch (err: any) {
      if (isMounted.current) {
        if (err.name === 'AbortError') {
          setError('Request timed out – please check your connection');
        } else {
          setError(err.message || 'Failed to load risk data');
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Run fetch on mount and clean up
  useEffect(() => {
    isMounted.current = true;
    fetchRisk();

    return () => {
      isMounted.current = false;
    };
  }, [fetchRisk]);

  // --- Rendering (exactly the same as before, only error messages may differ) ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl" role="status" aria-label="Loading">
          Loading risk data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        <div role="alert">Error: {error}</div>
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

  const statusColor = risk.status === 'critical' ? 'bg-red-600' : 'bg-yellow-500';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ARF System Risk</h1>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Risk Score</span>
          <span className="text-3xl font-mono">{risk.system_risk}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-white font-medium ${statusColor}`}>
            {risk.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}