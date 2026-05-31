'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Info, Network, Shield, Lock, FileText, AlertTriangle, Clock, Printer } from 'lucide-react';
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

interface PolicyViolation {
  id: string;
  policy: string;
  component: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  component: string;
  riskScore: number;
  decision: string;
  timestamp: string;
  user: string;
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

const MOCK_POLICY_VIOLATIONS: PolicyViolation[] = [
  { id: 'v1', policy: 'RegionAllowedPolicy', component: 'payment-api', severity: 'high', timestamp: '2026-05-14 11:02:33' },
  { id: 'v2', policy: 'CostThresholdPolicy', component: 'database', severity: 'medium', timestamp: '2026-05-14 10:15:22' },
  { id: 'v3', policy: 'MaxPermissionLevelPolicy', component: 'auth-service', severity: 'low', timestamp: '2026-05-13 23:45:01' },
];

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'a1', action: 'ProvisionResource', component: 'payment-api', riskScore: 0.82, decision: 'ESCALATE', timestamp: '2026-05-14 10:23:45', user: 'system' },
  { id: 'a2', action: 'GrantAccess', component: 'auth-service', riskScore: 0.45, decision: 'APPROVE', timestamp: '2026-05-14 09:15:22', user: 'admin@example.com' },
  { id: 'a3', action: 'DeployConfig', component: 'database', riskScore: 0.71, decision: 'ESCALATE', timestamp: '2026-05-13 22:10:05', user: 'devops@example.com' },
  { id: 'a4', action: 'ScaleOut', component: 'cache', riskScore: 0.38, decision: 'APPROVE', timestamp: '2026-05-13 18:30:19', user: 'system' },
  { id: 'a5', action: 'Rollback', component: 'message-queue', riskScore: 0.63, decision: 'DENY', timestamp: '2026-05-13 14:45:03', user: 'sre@example.com' },
];

const mockMemoryStats = {
  similar_incidents: 3,
  rag_similarity: 0.78,
  memory_usage: 'FAISS IndexFlatL2 (384 dim)',
  cache_hits: 124,
};

// ----------------------------------------------------------------------
// Reusable Components
// ----------------------------------------------------------------------
const RiskGauge = ({ risk, size = 180 }: { risk: number; size?: number }) => {
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - risk);
  const getColor = () => {
    if (risk < 0.4) return '#22c55e';
    if (risk < 0.7) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#374151" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x={size / 2} y={size / 2 + size * 0.08} textAnchor="middle" fill="#fff" fontSize={size * 0.12} fontWeight="bold">
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

const TrustBadges = () => (
  <div className="flex flex-wrap justify-center gap-4 my-6">
    <div className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
      <Shield className="w-3 h-3 text-green-400" /> SOC2 Type II (Audit ready)
    </div>
    <div className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
      <Shield className="w-3 h-3 text-blue-400" /> ISO 27001 (Compliant)
    </div>
    <div className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
      <Shield className="w-3 h-3 text-purple-400" /> GDPR Ready
    </div>
  </div>
);

const Testimonial = () => (
  <div className="bg-gray-800/50 rounded-xl p-5 italic text-gray-300 border-l-4 border-blue-400 my-6">
    “ARF caught a misconfiguration that would have exposed customer data. The audit trail saved us hours of investigation.”<br/>
    <span className="text-white font-medium mt-2 block">— CISO, Fortune 500 (pilot customer)</span>
  </div>
);

const LegalFooter = () => (
  <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500 flex flex-wrap justify-center gap-4">
    <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
    <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
    <Link href="/legal/imprint" className="hover:text-gray-300">Imprint</Link>
    <a href="mailto:juan@arf-ai.com" className="hover:text-gray-300">Contact</a>
  </div>
);

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
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [refreshData]);

  if (!riskData) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-4">
        <div className="text-xl animate-pulse">Loading dashboard simulation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* HTTP Warning */}
          {isHttpWarning && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-red-200 text-sm">
                ⚠️ Security warning: You are viewing this page over HTTP. Sensitive data (simulated) could be intercepted.
                <a href={window.location.href.replace('http:', 'https:')} className="ml-2 underline font-semibold hover:text-red-100">Switch to HTTPS</a>
              </p>
            </div>
          )}

          {/* Demo Disclaimer */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center flex flex-wrap justify-between items-center gap-2 backdrop-blur-sm">
            <p className="text-blue-200 text-sm flex-1">
              🚀 This is a <strong>simulated demo</strong> using mock data. The real ARF engine requires pilot access.
            </p>
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 text-sm font-medium underline whitespace-nowrap">
              Request pilot access →
            </Link>
          </div>

          {/* Risk Tab Content */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold">ARF System Risk</h1>
                  <button onClick={refreshData} disabled={isRefreshing} aria-label="Refresh data" className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50">
                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                  </button>
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

              <TrustBadges />

              {quota && (
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4"><h2 className="text-xl font-semibold">Your Plan (Demo)</h2><span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium">{quota.tier.toUpperCase()}</span></div>
                  <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Remaining evaluations this month</span><span className="font-mono font-medium text-white">{quota.remaining.toLocaleString()}</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(quota.remaining / quota.limit) * 100}%` }} /></div><p className="text-xs text-gray-400 mt-2">Limit: {quota.limit.toLocaleString()} evaluations/month (simulated)</p></div>
                  <Link href="/pricing" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium">View access models → <ArrowRight size={14} /></Link>
                </div>
              )}

              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Network className="w-5 h-5 text-green-400" /> Semantic Memory (Simulated)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div><div className="text-2xl font-bold text-blue-400">{mockMemoryStats.similar_incidents}</div><div className="text-xs text-gray-400">Similar Incidents</div></div>
                  <div><div className="text-2xl font-bold text-purple-400">{mockMemoryStats.rag_similarity.toFixed(2)}</div><div className="text-xs text-gray-400">RAG Similarity</div></div>
                  <div><div className="text-2xl font-bold text-yellow-400">{mockMemoryStats.cache_hits}</div><div className="text-xs text-gray-400">Cache Hits</div></div>
                  <div><div className="text-xs font-mono text-gray-300 break-words">{mockMemoryStats.memory_usage}</div><div className="text-xs text-gray-400">Index Type</div></div>
                </div>
              </div>

              {/* Recent Incidents - clean table */}
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Recent Incidents (Simulated)</h2>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-2">Time</th>
                        <th className="text-left py-2 px-2">Service</th>
                        <th className="text-left py-2 px-2">Metric</th>
                        <th className="text-right py-2 px-2">Value</th>
                        <th className="text-right py-2 px-2">Risk</th>
                        <th className="text-right py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INCIDENTS.map((inc) => (
                        <tr key={inc.id} className="border-b border-gray-700/50">
                          <td className="py-2 px-2 text-gray-300">{inc.timestamp}</td>
                          <td className="py-2 px-2 text-gray-300">{inc.service}</td>
                          <td className="py-2 px-2 text-gray-300">{inc.metric}</td>
                          <td className="py-2 px-2 text-right font-mono text-gray-300">{inc.value}</td>
                          <td className="py-2 px-2 text-right font-mono text-yellow-400">{inc.risk.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inc.action === 'ESCALATE' ? 'bg-red-900 text-red-200' : inc.action === 'DENY' ? 'bg-orange-900 text-orange-200' : 'bg-green-900 text-green-200'}`}>
                              {inc.action}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Data shown is simulated for demonstration purposes only.</p>
              </div>

              <Testimonial />
            </div>
          )}

          {/* Governance Tab Content */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-400" /> Policy Violations (Last 7 days)</h2>
                <div className="space-y-3">
                  {MOCK_POLICY_VIOLATIONS.map((v) => (
                    <div key={v.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-700/30 rounded-lg">
                      <div><span className="font-mono text-sm">{v.policy}</span><span className="text-xs text-gray-400 ml-2">on {v.component}</span></div>
                      <div className="flex items-center gap-3 mt-1 sm:mt-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${v.severity === 'high' ? 'bg-red-900 text-red-200' : v.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' : 'bg-blue-900 text-blue-200'}`}>{v.severity.toUpperCase()}</span>
                        <span className="text-xs text-gray-400">{v.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Simulated data – real engine provides live policy enforcement.</p>
              </div>

              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Audit Trail (Recent decisions)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-2">Timestamp</th>
                        <th className="text-left py-2 px-2">Component</th>
                        <th className="text-left py-2 px-2">Action</th>
                        <th className="text-right py-2 px-2">Risk</th>
                        <th className="text-right py-2 px-2">Decision</th>
                        <th className="text-left py-2 px-2">User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_AUDIT_LOGS.map((log) => (
                        <tr key={log.id} className="border-b border-gray-700/50">
                          <td className="py-2 px-2 text-gray-300 whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-2 px-2 text-gray-300">{log.component}</td>
                          <td className="py-2 px-2 text-gray-300">{log.action}</td>
                          <td className="py-2 px-2 text-right font-mono text-yellow-400">{log.riskScore.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right"><span className={`px-2 py-0.5 rounded-full text-xs ${log.decision === 'ESCALATE' ? 'bg-red-900 text-red-200' : log.decision === 'DENY' ? 'bg-orange-900 text-orange-200' : 'bg-green-900 text-green-200'}`}>{log.decision}</span></td>
                          <td className="py-2 px-2 text-gray-400">{log.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Audit logs are immutable and cryptographically signed in production.</p>
              </div>

              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-400" /> Cooldown & Rate Limits (Simulated)</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"><div><span className="font-mono text-sm">payment-api</span><span className="text-xs text-gray-400 ml-2">(policy: latency_gt_100)</span></div><span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-0.5 rounded-full">Cooldown: 45s remaining</span></div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"><div><span className="font-mono text-sm">database</span><span className="text-xs text-gray-400 ml-2">(policy: cpu_high)</span></div><span className="text-xs bg-orange-900 text-orange-200 px-2 py-0.5 rounded-full">Rate limit: 2/5 per hour</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-gray-700 text-center backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-2">Take full control of governance</h2>
                <p className="text-gray-300 mb-4">Policy enforcement, audit trails, and compliance reporting are available in the real engine.</p>
                <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">Request Pilot Access <ArrowRight size={16} /></Link>
              </div>
            </div>
          )}

          {/* Compliance Tab Content */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /> Compliance & Certifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg"><div className="text-2xl font-bold text-green-400">✓</div><div className="text-sm">SOC2 Type II</div><div className="text-xs text-gray-400">Audit ready</div></div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg"><div className="text-2xl font-bold text-blue-400">✓</div><div className="text-sm">ISO 27001</div><div className="text-xs text-gray-400">Compliant</div></div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg"><div className="text-2xl font-bold text-purple-400">✓</div><div className="text-sm">GDPR</div><div className="text-xs text-gray-400">Ready</div></div>
                </div>
                <p className="text-xs text-gray-500 mt-4">The real engine provides evidence packages for auditors.</p>
              </div>

              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-400" /> Data Retention & Privacy</h2>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                  <li>Sandbox logs retained for 30 days</li>
                  <li>Pilot/Enterprise logs retained up to 12 months</li>
                  <li>No raw customer data stored – only anonymised risk metrics</li>
                  <li>Encryption at rest (AES-256) and in transit (TLS 1.3)</li>
                  <li>Right to deletion and data portability supported</li>
                </ul>
              </div>

              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700 text-center">
                <h2 className="text-xl font-semibold mb-2">Export Compliance Report</h2>
                <p className="text-gray-300 mb-4">Generate a summary report of governance decisions, policy violations, and system status for auditors.</p>
                <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition"><Printer size={16} /> Print / Save as PDF (mock)</button>
                <p className="text-xs text-gray-500 mt-3">Mock action – real engine provides automated compliance report generation.</p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-gray-700 text-center backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-2">Get audit‑ready with ARF</h2>
                <p className="text-gray-300 mb-4">Immutable logs, deterministic enforcement, and compliance evidence packages.</p>
                <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">Request Pilot Access <ArrowRight size={16} /></Link>
              </div>
            </div>
          )}

          <LegalFooter />
        </div>
      </div>
      <DashboardBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
