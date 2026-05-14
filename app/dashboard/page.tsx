'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Info, Network } from 'lucide-react';
import DashboardBottomNav from '../../components/DashboardBottomNav';

// ----------------------------------------------------------------------
// Type definitions
// ----------------------------------------------------------------------
interface RiskBreakdown {
  conjugate: number;
  hmc: number;
  hyperprior: number;
}

interface RiskWeights {
  conjugate: number;
  hmc: number;
  hyperprior: number;
}

interface RiskData {
  risk: number;
  status: 'critical' | 'warning' | 'safe';
  breakdown: RiskBreakdown;
  weights: RiskWeights;
  variance: number;
}

interface QuotaData {
  tier: string;
  remaining: number;
  limit: number;
}

interface Incident {
  id: number;
  timestamp: string;
  service: string;
  metric: string;
  value: string;
  risk: number;
  action: 'APPROVE' | 'DENY' | 'ESCALATE';
}

// ----------------------------------------------------------------------
// Helper: generate deterministic mock risk data
// ----------------------------------------------------------------------
const generateMockRisk = (): RiskData => {
  const seed = Math.floor(Date.now() / 10000);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    const r = x - Math.floor(x);
    return min + r * (max - min);
  };
  const risk = random(0.2, 0.95);
  let status: RiskData['status'] = 'warning';
  if (risk > 0.7) status = 'critical';
  else if (risk < 0.4) status = 'safe';

  const conjWeight = random(0.3, 0.7);
  const hmcWeight = random(0.1, 0.4);
  const hyperWeight = 1 - conjWeight - hmcWeight;
  return {
    risk,
    status,
    breakdown: {
      conjugate: conjWeight * risk,
      hmc: hmcWeight * risk,
      hyperprior: hyperWeight * risk,
    },
    weights: { conjugate: conjWeight, hmc: hmcWeight, hyperprior: hyperWeight },
    variance: random(0.01, 0.1),
  };
};

const MOCK_INCIDENTS: Incident[] = [
  { id: 1, timestamp: '2026-05-14 10:23:45', service: 'payment-api', metric: 'latency', value: '450ms', risk: 0.82, action: 'ESCALATE' },
  { id: 2, timestamp: '2026-05-14 09:15:22', service: 'auth-service', metric: 'error_rate', value: '12%', risk: 0.45, action: 'APPROVE' },
  { id: 3, timestamp: '2026-05-13 22:10:05', service: 'database', metric: 'cpu_usage', value: '92%', risk: 0.71, action: 'ESCALATE' },
  { id: 4, timestamp: '2026-05-13 18:30:19', service: 'cache', metric: 'hit_rate', value: '34%', risk: 0.38, action: 'APPROVE' },
  { id: 5, timestamp: '2026-05-13 14:45:03', service: 'message-queue', metric: 'backlog', value: '1250', risk: 0.63, action: 'DENY' },
];

const mockMemoryStats = {
  similar_incidents: 3,
  rag_similarity: 0.78,
  memory_usage: 'FAISS IndexFlatL2 (384 dim)',
  cache_hits: 124,
};

// ----------------------------------------------------------------------
// Reusable Components (outside Dashboard)
// ----------------------------------------------------------------------
const RiskGauge = ({ risk, size = 180 }: { risk: number; size?: number }) => {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const normalizedAngle = risk * 270;
  const startAngle = -135;
  const endAngle = startAngle + normalizedAngle;
  const startRad = startAngle * (Math.PI / 180);
  const endRad = endAngle * (Math.PI / 180);
  const largeArcFlag = normalizedAngle > 180 ? 1 : 0;
  const center = size / 2;
  const x1 = center + radius * Math.cos(startRad);
  const y1 = center + radius * Math.sin(startRad);
  const x2 = center + radius * Math.cos(endRad);
  const y2 = center + radius * Math.sin(endRad);
  const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

  const getColor = () => {
    if (risk < 0.4) return '#22c55e';
    if (risk < 0.7) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path
          d={`M ${center + radius * Math.cos(startRad)} ${center + radius * Math.sin(startRad)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos((startAngle + 270) * (Math.PI / 180))} ${center + radius * Math.sin((startAngle + 270) * (Math.PI / 180))}`}
          fill="none"
          stroke="#374151"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path d={arcPath} fill="none" stroke={getColor()} strokeWidth={strokeWidth} strokeLinecap="round" />
        <circle cx={center} cy={center} r={size * 0.05} fill="#fff" />
        <line
          x1={center}
          y1={center}
          x2={center + radius * Math.cos((normalizedAngle - 135) * (Math.PI / 180))}
          y2={center + radius * Math.sin((normalizedAngle - 135) * (Math.PI / 180))}
          stroke="#fff"
          strokeWidth={size * 0.02}
          strokeLinecap="round"
        />
        <text x={center} y={center + size * 0.1} textAnchor="middle" fill="#fff" fontSize={size * 0.12} fontWeight="bold">
          {(risk * 100).toFixed(0)}%
        </text>
      </svg>
    </div>
  );
};

const RiskFactorBreakdown = ({ breakdown, weights }: { breakdown: RiskBreakdown; weights: RiskWeights }) => (
  <div className="border-t border-gray-700 pt-4">
    <div className="text-gray-400 text-sm mb-2 flex items-center gap-1">
      Risk Factor Breakdown
      <span title="Weighted contributions from each Bayesian component"><Info size={14} className="text-gray-500 cursor-help" /></span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm"><span>Conjugate prior</span><span className="font-mono">{(breakdown.conjugate * 100).toFixed(1)}% (weight {weights.conjugate.toFixed(2)})</span></div>
      <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${weights.conjugate * 100}%` }} /></div>
      <div className="flex justify-between text-sm"><span>HMC prediction</span><span className="font-mono">{(breakdown.hmc * 100).toFixed(1)}% (weight {weights.hmc.toFixed(2)})</span></div>
      <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${weights.hmc * 100}%` }} /></div>
      <div className="flex justify-between text-sm"><span>Hyperprior shrinkage</span><span className="font-mono">{(breakdown.hyperprior * 100).toFixed(1)}% (weight {weights.hyperprior.toFixed(2)})</span></div>
      <div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${weights.hyperprior * 100}%` }} /></div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const color = status === 'critical' ? 'bg-red-600' : status === 'warning' ? 'bg-yellow-500' : 'bg-green-500';
  return <span className={`inline-block px-3 py-1 rounded-full text-white font-medium text-sm ${color}`}>{status.toUpperCase()}</span>;
};

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------
type TabType = 'risk' | 'governance' | 'compliance';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('risk');
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHttpWarning, setIsHttpWarning] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsHttpWarning(true);
    }
  }, []);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newRisk = generateMockRisk();
      setRiskData(newRisk);
      setQuota({
        tier: 'pro',
        remaining: Math.floor(Math.random() * 500) + 100,
        limit: 1000,
      });
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  if (!riskData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <div className="text-xl animate-pulse">Loading dashboard simulation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* HTTP Warning */}
          {isHttpWarning && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-center">
              <p className="text-red-200 text-sm">⚠️ Security warning: You are viewing this page over HTTP. Sensitive data (simulated) could be intercepted. <a href={window.location.href.replace('http:', 'https:')} className="ml-2 underline font-semibold hover:text-red-100">Switch to HTTPS</a></p>
            </div>
          )}

          {/* Demo Disclaimer */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
            <p className="text-blue-200 text-sm">🚀 This is a <strong>simulated demo</strong> using mock data. The real ARF engine requires pilot access. <Link href="/signup" className="ml-2 underline font-semibold hover:text-blue-100">Request pilot access →</Link></p>
          </div>

          {/* Risk Tab Content */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              {/* Main Risk Card */}
              <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold">ARF System Risk</h1>
                  <button onClick={refreshData} disabled={isRefreshing} aria-label="Refresh data" className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"><RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} /></button>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="flex-shrink-0"><RiskGauge risk={riskData.risk} size={180} /></div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><div className="text-gray-400 text-sm">Risk Score</div><div className="text-3xl font-bold text-white">{(riskData.risk * 100).toFixed(0)}%</div></div>
                      <div><div className="text-gray-400 text-sm">Status</div><StatusBadge status={riskData.status} /></div>
                      <div><div className="text-gray-400 text-sm">Posterior Variance</div><div className="font-mono text-lg">{riskData.variance.toFixed(4)}</div></div>
                      <div><div className="text-gray-400 text-sm">Confidence Interval (90%)</div><div className="font-mono text-sm">[{Math.max(0, riskData.risk - 1.645 * Math.sqrt(riskData.variance)).toFixed(2)}, {Math.min(1, riskData.risk + 1.645 * Math.sqrt(riskData.variance)).toFixed(2)}]</div></div>
                    </div>
                    <RiskFactorBreakdown breakdown={riskData.breakdown} weights={riskData.weights} />
                  </div>
                </div>
                {lastUpdated && <p className="text-xs text-gray-400 text-center mt-4">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
              </div>

              {/* Quota Card */}
              {quota && (
                <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4"><h2 className="text-xl font-semibold">Your Plan (Demo)</h2><span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium">{quota.tier.toUpperCase()}</span></div>
                  <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Remaining evaluations this month</span><span className="font-mono font-medium text-white">{quota.remaining.toLocaleString()}</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(quota.remaining / quota.limit) * 100}%` }} /></div><p className="text-xs text-gray-400 mt-2">Limit: {quota.limit.toLocaleString()} evaluations/month (simulated)</p></div>
                  <Link href="/pricing" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium">View access models → <ArrowRight size={14} /></Link>
                </div>
              )}

              {/* Semantic Memory */}
              <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Network className="w-5 h-5 text-green-400" /> Semantic Memory (Simulated)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div><div className="text-2xl font-bold text-blue-400">{mockMemoryStats.similar_incidents}</div><div className="text-xs text-gray-400">Similar Incidents</div></div>
                  <div><div className="text-2xl font-bold text-purple-400">{mockMemoryStats.rag_similarity.toFixed(2)}</div><div className="text-xs text-gray-400">RAG Similarity</div></div>
                  <div><div className="text-2xl font-bold text-yellow-400">{mockMemoryStats.cache_hits}</div><div className="text-xs text-gray-400">Cache Hits</div></div>
                  <div><div className="text-xs font-mono text-gray-300 break-words">{mockMemoryStats.memory_usage}</div><div className="text-xs text-gray-400">Index Type</div></div>
                </div>
              </div>

              {/* Recent Incidents */}
              <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Recent Incidents (Simulated)</h2>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-700"><th className="text-left py-2 px-2">Time</th><th className="text-left py-2 px-2">Service</th><th className="text-left py-2 px-2">Metric</th><th className="text-right py-2 px-2">Value</th><th className="text-right py-2 px-2">Risk</th><th className="text-right py-2 px-2">Action</th></tr></thead>
                    <tbody>
                      {MOCK_INCIDENTS.map((inc) => (
                        <tr key={inc.id} className="border-b border-gray-700/50">
                          <td className="py-2 px-2 text-gray-300">{inc.timestamp}</td>
                          <td className="py-2 px-2 text-gray-300">{inc.service}</td>
                          <td className="py-2 px-2 text-gray-300">{inc.metric}</td>
                          <td className="py-2 px-2 text-right font-mono text-gray-300">{inc.value}</td>
                          <td className="py-2 px-2 text-right font-mono text-yellow-400">{inc.risk.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inc.action === 'ESCALATE' ? 'bg-red-900 text-red-200' : inc.action === 'DENY' ? 'bg-orange-900 text-orange-200' : 'bg-green-900 text-green-200'}`}>{inc.action}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Data shown is simulated for demonstration purposes only.</p>
              </div>
            </div>
          )}

          {/* Governance Tab Content (placeholder) */}
          {activeTab === 'governance' && (
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Governance Operations (Simulated)</h2>
              <p className="text-gray-400">Policy violations, audit logs, and enforcement status will appear here.</p>
            </div>
          )}

          {/* Compliance Tab Content (placeholder) */}
          {activeTab === 'compliance' && (
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Compliance & Certifications (Simulated)</h2>
              <p className="text-gray-400">SOC2, ISO27001, GDPR status and audit reports.</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-gray-700 text-center">
            <h2 className="text-xl font-semibold mb-2">Ready to govern your AI agents?</h2>
            <p className="text-gray-300 mb-4">Get real‑time risk scoring, semantic memory, and audit trails.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">Request Pilot Access <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
      <DashboardBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
