'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { RiskData, Decision, HistoryDataPoint } from '../types';
import EvaluateForm from './EvaluateForm';
import MemoryStats from './MemoryStats';
import RecentDecisions from './RecentDecisions';
import RiskChart from './RiskChart';

export default function DashboardPage() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const riskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/get_risk`, {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
      });
      if (!riskRes.ok) throw new Error(`Risk API error: ${riskRes.status}`);
      const riskData: RiskData = await riskRes.json();
      setRisk(riskData);

      const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/history`, {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
      });
      if (historyRes.ok) {
        const historyData: Decision[] = await historyRes.json();
        const formatted: HistoryDataPoint[] = historyData.map((item) => ({
          timestamp: item.timestamp,
          risk: item.risk_score ?? 0,
        }));
        setHistory(formatted);
      } else {
        console.warn('History API not available');
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to API. Please check that the backend is running.');
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/80 border border-red-500/30 p-6 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-400">Connection Error</h2>
          <p className="mb-4 text-gray-300">{error}</p>
          <p className="text-sm text-gray-400">
            Make sure the ARF API is running at: {process.env.NEXT_PUBLIC_API_URL}
          </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ARF Dashboard
            </h1>
            <Link
              href="/changelog"
              className="text-sm bg-gray-800/60 text-blue-300 px-2 py-1 rounded-full hover:bg-gray-700 transition border border-blue-500/30"
            >
              v4.2.0
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-400">
                Last updated: {formatLastUpdated()}
              </span>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800/50 transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                'Refresh Data'
              )}
            </button>
          </div>
        </div>

        {/* Top row: current risk + memory stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-200">Current System Risk</h2>
            {risk && (
              <>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="text-5xl font-mono font-bold text-blue-400 glow-text">
                    {risk.system_risk.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-white font-medium ${
                    risk.status === 'critical' ? 'bg-red-600' : 'bg-yellow-600'
                  }`}>
                    {risk.status.toUpperCase()}
                  </span>
                </div>
                {risk.confidence_interval && (
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${(risk.confidence_interval[1] - risk.confidence_interval[0]) * 100}%`,
                          marginLeft: `${risk.confidence_interval[0] * 100}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{risk.confidence_interval[0].toFixed(3)}</span>
                      <span>90% CI</span>
                      <span>{risk.confidence_interval[1].toFixed(3)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <MemoryStats />
        </div>

        {/* Risk History Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Risk History (Last 24h)</h2>
          <RiskChart data={history} />
        </div>

        {/* Evaluate Form (enhanced) */}
        <div className="mb-8">
          <EvaluateForm />
        </div>

        {/* Recent Decisions (enhanced) */}
        <div className="mb-8">
          <RecentDecisions />
        </div>

        {/* Additional Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">🤗 Explore the Stack</h3>
            <p className="text-gray-300 mb-3">
              Discover complementary tools for AI reliability, forecasting, and incident triage.
            </p>
            <a
              href="https://huggingface.co/collections/petter2025/reliable-ai-systems-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition"
            >
              Visit Reliable AI Systems Stack →
            </a>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">📢 What&apos;s New in v4.2.0</h3>
            <p className="text-gray-300 mb-3">
              Full risk factor decomposition, traceable governance loop, and improved API docs.
            </p>
            <Link
              href="/changelog"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition"
            >
              Read the changelog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
