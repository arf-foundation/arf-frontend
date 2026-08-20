'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      <div className="arf-page-root flex min-h-screen items-center justify-center p-4">
        <div className="animate-pulse text-xl">Loading history simulation...</div>
      </div>
    );
  }

  return (
    <div className="arf-page-root min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Disclaimer */}
          <div className="rounded-lg border border-arf-blue/30 bg-arf-blue/10 p-3 text-center">
            <p className="text-sm text-[color:var(--text-secondary)]">
              📊 This is a <strong>simulated demo</strong> using mock data. The real ARF engine requires pilot access.
              <Link href="/signup" className="ml-2 font-semibold text-arf-blue underline hover:brightness-110">Request pilot access →</Link>
            </p>
          </div>

          {/* Header with refresh button */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Risk History</h1>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                Simulated risk score evolution over the last 30 days
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] px-4 py-2 text-[color:var(--text-primary)] transition hover:border-[color:var(--color-arf-blue)] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Line chart */}
          <div className="arf-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="h-5 w-5 text-arf-blue" /> Risk Trend (30 days)
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatDate}
                    stroke="var(--text-muted)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    stroke="var(--text-muted)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--hairline)', borderRadius: '0.5rem' }}
                    labelStyle={{ color: 'var(--text-primary)' }}
                    formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="risk_score"
                    stroke="#3358e8"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3358e8' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {lastUpdated && (
              <p className="mt-4 text-center text-xs text-[color:var(--text-muted)]">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Recent decisions table */}
          <div className="arf-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Calendar className="h-5 w-5 text-arf-purple" /> Recent Decisions (Simulated)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--hairline)]">
                    <th className="px-2 py-2 text-left text-[color:var(--text-muted)]">Time</th>
                    <th className="px-2 py-2 text-left text-[color:var(--text-muted)]">Service</th>
                    <th className="px-2 py-2 text-right text-[color:var(--text-muted)]">Risk Score</th>
                    <th className="px-2 py-2 text-right text-[color:var(--text-muted)]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDecisions.map((decision) => (
                    <tr key={decision.id} className="border-b border-[color:var(--hairline)] transition hover:bg-[color:var(--surface-sunken)]">
                      <td className="whitespace-nowrap px-2 py-2 text-[color:var(--text-secondary)]">{decision.timestamp}</td>
                      <td className="px-2 py-2 text-[color:var(--text-secondary)]">{decision.service}</td>
                      <td className="px-2 py-2 text-right font-mono text-amber-700 dark:text-amber-400">{(decision.risk * 100).toFixed(0)}%</td>
                      <td className="px-2 py-2 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                          decision.action === 'ESCALATE' ? 'bg-[#b3392a]' :
                          decision.action === 'DENY' ? 'bg-[#9c611c]' :
                          'bg-[#3f7a5c]'
                        }`}>
                          {decision.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-xs text-[color:var(--text-muted)]">
              Data shown is simulated for demonstration purposes only.
            </p>
          </div>

          {/* Call to action */}
          <div className="arf-card-anchored p-6 text-center text-white">
            <h2 className="mb-2 text-xl font-semibold">Get real‑time risk history</h2>
            <p className="mb-4 text-white/80">Access detailed historical risk trends and audit trails.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-arf-blue px-6 py-2 font-medium text-white transition hover:brightness-110"
            >
              Request Pilot Access <TrendingUp size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
