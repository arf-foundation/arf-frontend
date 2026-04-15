'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, RefreshCw } from 'lucide-react'; // removed TrendingDown

// Types
interface HistoryPoint {
  timestamp: string;
  risk_score: number;
}

// Mock data generator
const generateMockHistory = (): HistoryPoint[] => {
  const now = new Date();
  const data: HistoryPoint[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const risk = 0.2 + 0.5 * Math.sin(i / 5) + 0.1 * Math.random();
    data.push({
      timestamp: date.toISOString(),
      risk_score: Math.min(0.95, Math.max(0.05, risk)),
    });
  }
  return data;
};

const mockDecisions = [
  { id: 1, timestamp: '2026-04-15 10:23:45', service: 'payment-api', risk: 0.82, action: 'ESCALATE' },
  { id: 2, timestamp: '2026-04-15 09:15:22', service: 'auth-service', risk: 0.45, action: 'APPROVE' },
  { id: 3, timestamp: '2026-04-14 22:10:05', service: 'database', risk: 0.71, action: 'ESCALATE' },
  { id: 4, timestamp: '2026-04-14 18:30:19', service: 'cache', risk: 0.38, action: 'APPROVE' },
  { id: 5, timestamp: '2026-04-14 14:45:03', service: 'message-queue', risk: 0.63, action: 'DENY' },
];

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = generateMockHistory();
      setHistoryData(newData);
      setLastUpdated(new Date());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshData();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading && historyData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <div className="text-xl animate-pulse">Loading history simulation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Disclaimer */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
            <p className="text-blue-200 text-sm">
              📊 This is a <strong>simulated demo</strong> using mock data. The real ARF engine requires pilot access.
              <a href="/signup" className="ml-2 underline font-semibold hover:text-blue-100">Request pilot access →</a>
            </p>
          </div>

          {/* Header with refresh button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Risk History</h1>
              <p className="text-gray-400 text-sm mt-1">
                Simulated risk score evolution over the last 30 days
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Line chart */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> Risk Trend (30 days)
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk_score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {lastUpdated && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Recent decisions table */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" /> Recent Decisions (Simulated)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2 text-gray-400">Time</th>
                    <th className="text-left py-2 px-2 text-gray-400">Service</th>
                    <th className="text-right py-2 px-2 text-gray-400">Risk Score</th>
                    <th className="text-right py-2 px-2 text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDecisions.map((decision) => (
                    <tr key={decision.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                      <td className="py-2 px-2 text-gray-300 whitespace-nowrap">{decision.timestamp}</td>
                      <td className="py-2 px-2 text-gray-300">{decision.service}</td>
                      <td className="py-2 px-2 text-right font-mono text-yellow-400">{(decision.risk * 100).toFixed(0)}%</td>
                      <td className="py-2 px-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          decision.action === 'ESCALATE' ? 'bg-red-900 text-red-200' :
                          decision.action === 'DENY' ? 'bg-orange-900 text-orange-200' :
                          'bg-green-900 text-green-200'
                        }`}>
                          {decision.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Data shown is simulated for demonstration purposes only.
            </p>
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-gray-700 text-center">
            <h2 className="text-xl font-semibold mb-2">Get real‑time risk history</h2>
            <p className="text-gray-300 mb-4">Access detailed historical risk trends and audit trails.</p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
            >
              Request Pilot Access <TrendingUp size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
