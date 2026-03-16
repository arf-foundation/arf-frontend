'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Fetch current risk
      const riskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/get_risk`, {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
      });
      if (!riskRes.ok) throw new Error(`Risk API error: ${riskRes.status}`);
      const riskData: RiskData = await riskRes.json();
      setRisk(riskData);

      // Fetch history (decisions)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Make sure the ARF API is running at: {process.env.NEXT_PUBLIC_API_URL}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ARF Dashboard</h1>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
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

      {/* Top row: current risk + memory stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Current Risk Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Current System Risk</h2>
          {risk && (
            <>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-gray-600">Risk Score</span>
                <span className="text-4xl font-mono">{risk.system_risk.toFixed(3)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-white font-medium ${
                  risk.status === 'critical' ? 'bg-red-600' : 'bg-yellow-500'
                }`}>
                  {risk.status.toUpperCase()}
                </span>
              </div>
              {risk.confidence_interval && (
                <div className="mt-4">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ 
                        width: `${(risk.confidence_interval[1] - risk.confidence_interval[0]) * 100}%`,
                        marginLeft: `${risk.confidence_interval[0] * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{risk.confidence_interval[0].toFixed(3)}</span>
                    <span>90% CI</span>
                    <span>{risk.confidence_interval[1].toFixed(3)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Memory Stats */}
        <MemoryStats />
      </div>

      {/* Risk History Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Risk History (Last 24h)</h2>
        <RiskChart data={history} />
      </div>

      {/* Evaluate Form */}
      <div className="mb-8">
        <EvaluateForm />
      </div>

      {/* Recent Decisions */}
      <RecentDecisions />
    </div>
  );
}
