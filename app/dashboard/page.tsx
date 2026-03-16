'use client';

import { useEffect, useState } from 'react';
import { RiskData, Decision, HistoryDataPoint } from '../types';
import EvaluateForm from './EvaluateForm';
import MemoryStats from './MemoryStats';
import RecentDecisions from './RecentDecisions';
import RiskChart from './RiskChart';

export default function DashboardPage() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current risk
        const riskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_risk`, {
          headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
        });
        if (!riskRes.ok) throw new Error(`Risk API error: ${riskRes.status}`);
        const riskData: RiskData = await riskRes.json();
        setRisk(riskData);

        // Fetch history (decisions)
        const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/history`, {
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
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">ARF Dashboard</h1>

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
                <p className="text-sm text-gray-500 mt-4">
                  90% CI: [{risk.confidence_interval[0].toFixed(3)}, {risk.confidence_interval[1].toFixed(3)}]
                </p>
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
