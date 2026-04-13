'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowRight, AlertCircle } from 'lucide-react';

// Schema for risk API response
const RiskDataSchema = z.object({
  system_risk: z.number().min(0).max(1),
  status: z.enum(['critical', 'warning', 'safe']).catch('warning'),
});

type RiskData = z.infer<typeof RiskDataSchema>;

// Schema for quota API response
const QuotaSchema = z.object({
  tier: z.enum(['free', 'pro', 'premium', 'enterprise']),
  remaining: z.number().nullable(), // null for unlimited
  limit: z.number().nullable(),
});

type QuotaData = z.infer<typeof QuotaSchema>;

export default function Dashboard() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('arf_api_key') : null;

  const fetchRisk = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const headers: HeadersInit = {};
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`/api/v1/get_risk`, {
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized – check API credentials');
        if (response.status === 404) throw new Error('Risk endpoint not found');
        if (response.status >= 500) throw new Error('Server error – please try later');
        throw new Error(`HTTP error ${response.status}`);
      }

      const rawData = await response.json();
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
  }, [apiKey]);

  const fetchQuota = useCallback(async () => {
    if (!apiKey) return;

    try {
      const response = await fetch('/api/v1/users/quota', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (response.ok) {
        const data = await response.json();
        const validated = QuotaSchema.parse(data);
        if (isMounted.current) setQuota(validated);
      } else {
        console.warn('Failed to fetch quota:', response.status);
      }
    } catch (err) {
      console.error('Quota fetch error:', err);
    }
  }, [apiKey]);

  useEffect(() => {
    isMounted.current = true;
    fetchRisk();
    fetchQuota();

    return () => {
      isMounted.current = false;
    };
  }, [fetchRisk, fetchQuota]);

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-500';
      case 'pro': return 'bg-blue-600';
      case 'premium': return 'bg-purple-600';
      case 'enterprise': return 'bg-yellow-600';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-xl" role="status" aria-label="Loading">
          <div className="animate-pulse">Loading risk data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        No risk data available
      </div>
    );
  }

  const statusColor = 
    risk.status === 'critical' ? 'bg-red-600' :
    risk.status === 'warning' ? 'bg-yellow-500' :
    'bg-green-500';

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Risk Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">ARF System Risk</h1>
          
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Risk Score</span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-gray-900">
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

          <div className="flex items-center justify-between mb-4 sm:mb-6">
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

        {/* Quota Card */}
        {quota && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Plan</h2>
              <span className={`px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium ${getTierBadgeColor(quota.tier)}`}>
                {quota.tier.toUpperCase()}
              </span>
            </div>

            <div className="mb-4">
              {quota.remaining !== null ? (
                <>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Remaining evaluations this month</span>
                    <span className="font-mono font-medium">{quota.remaining.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${(quota.remaining / (quota.limit || 1)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Limit: {quota.limit?.toLocaleString()} evaluations/month
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Unlimited evaluations</p>
              )}
            </div>

            {quota.tier === 'free' && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
              >
                Upgrade to Pro <ArrowRight size={16} />
              </Link>
            )}
          </div>
        )}

        {/* No API key warning */}
        {!apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-xl p-4 sm:p-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">API key not found</h3>
              <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                Please <Link href="/signup" className="underline font-medium">sign up</Link> to get an API key and see your quota.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
