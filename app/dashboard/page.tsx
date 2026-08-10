'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Network, Shield, Lock, FileText, AlertTriangle, Clock, Printer, ChevronRight } from 'lucide-react';
import DashboardBottomNav from '../../components/DashboardBottomNav';
import {
  DashboardMetricCard,
  RiskGauge,
  RiskFactorBreakdown,
  StatusBadge,
  riskColor,
  ExplainabilityModal,
  type ExplainabilitySection,
} from '@arf/ui';

/* ============================================================================
   Design-migration pass (P3, enterprise-refresh audit). Structure and mock
   data are unchanged -- this re-skins the page onto the token system
   app/page.tsx and app/pricing/page.tsx already use: arf-page-root,
   .arf-card-substantial in place of the single repeated bg-gray-800/90
   backdrop-blur rounded-2xl border pattern (13 instances before this),
   the gradient-tint panel pattern for the two CTA bands, and CSS custom
   properties (--surface-*, --text-*, --hairline) everywhere a color was
   previously a flat gray-N shade, so the page now actually respects the
   site's light/dark toggle instead of always being dark.

   Kept deliberately theme-invariant: the APPROVE/DENY/ESCALATE and
   severity badges. These are semantic status color, not the brand accent,
   and stay as dark chips regardless of page theme -- the same choice
   .arf-card-anchored already makes elsewhere in this design system.
   ========================================================================= */

// ----------------------------------------------------------------------
// Type definitions (unchanged)
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
// Helper: generate deterministic mock risk data (unchanged)
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
// Audit Trail explainability -- one decision record's provenance.
//
// This describes the REAL ARF engine's methodology (Bayesian risk fusion,
// doubly-robust causal counterfactual estimation, immutable+signable
// records) applied to this simulated row. Two things are deliberately
// NOT claimed, because they aren't true of the OSS/sandbox path:
//   - that this specific number was computed live by that engine (it's a
//     illustrative derivation from the mock riskScore, labeled as such)
//   - that "similar past incidents" retrieval is semantic/NLP similarity
//     (it's metric-fingerprint similarity -- see the Semantic Memory card)
// ----------------------------------------------------------------------
function auditLogExplanation(log: AuditLogEntry): {
  title: string;
  summary: string;
  sections: ExplainabilitySection[];
  footer: string;
} {
  const riskBand = log.riskScore >= 0.7 ? 'high' : log.riskScore >= 0.4 ? 'moderate' : 'low';
  const outcome =
    log.decision === 'ESCALATE' ? 'escalated for review' : log.decision === 'DENY' ? 'blocked' : 'approved automatically';
  const altAction = log.decision === 'APPROVE' ? 'denied' : log.decision === 'DENY' ? 'approved' : 'auto-approved without escalation';
  // Illustrative, derived from the mock risk score -- not a live estimate.
  const illustrativeDelta = Math.round(log.riskScore * 28);

  return {
    title: `${log.action} — ${log.component}`,
    summary: `This ${log.action} on ${log.component} was ${outcome} because the risk model scored it in the ${riskBand} band (${(log.riskScore * 100).toFixed(0)}%). The decision record below is immutable once created.`,
    sections: [
      {
        heading: 'Risk assessment',
        body: (
          <>
            Risk score {log.riskScore.toFixed(2)} comes from ARF&rsquo;s Bayesian fusion model: a fast per-category
            conjugate prior, an offline Hamiltonian Monte Carlo model over contextual features, and hierarchical
            shrinkage across categories, combined by weight of evidence. Posterior variance — the model&rsquo;s own
            uncertainty in this score — shrinks as more real outcomes are observed for {log.component}.
          </>
        ),
      },
      {
        heading: 'Counterfactual',
        body: (
          <>
            If this had been {altAction} instead, ARF&rsquo;s doubly-robust causal effect estimator projects success
            probability would have shifted by roughly {illustrativeDelta}% (illustrative for this sandbox — the real
            estimator combines inverse-probability weighting with outcome regression, reports a bootstrap confidence
            interval, and includes an E-value check for how much unmeasured confounding would overturn the result).
          </>
        ),
      },
      {
        heading: 'Record integrity',
        body: (
          <>
            Decision records are deep-frozen at creation — every field becomes immutable — and can be signed with
            RSA-SHA256 for tamper detection. Attributed to <span className="font-mono">{log.user}</span> at{' '}
            {log.timestamp}.
          </>
        ),
      },
    ],
    footer:
      "Sandbox illustration — this reflects the real ARF engine's methodology applied to simulated inputs, not a live production evaluation.",
  };
}

// ----------------------------------------------------------------------
// Reusable components
// ----------------------------------------------------------------------
const TrustBadges = () => (
  <div className="my-6 flex flex-wrap justify-center gap-3">
    <div className="flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] px-3 py-1.5 text-xs"><Shield className="h-3.5 w-3.5 text-arf-blue" /> SOC2 Type II (Audit ready)</div>
    <div className="flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] px-3 py-1.5 text-xs"><Shield className="h-3.5 w-3.5 text-arf-blue" /> ISO 27001 (Compliant)</div>
    <div className="flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] px-3 py-1.5 text-xs"><Shield className="h-3.5 w-3.5 text-arf-purple" /> GDPR Ready</div>
  </div>
);

const Testimonial = () => (
  <div className="my-6 rounded-xl border-l-4 border-arf-blue bg-[color:var(--surface-sunken)] p-5 font-serif italic text-[color:var(--text-secondary)]">
    “ARF caught a misconfiguration that would have exposed customer data. The audit trail saved us hours of investigation.”<br/>
    <span className="mt-2 block font-sans font-medium not-italic text-[color:var(--text-primary)]">— CISO, Fortune 500 (pilot customer)</span>
  </div>
);

const LegalFooter = () => (
  <div className="mt-8 flex flex-wrap justify-center gap-4 border-t border-[color:var(--hairline)] pt-6 text-center text-xs text-[color:var(--text-muted)]">
    <Link href="/terms" className="hover:text-[color:var(--text-primary)]">Terms of Service</Link>
    <Link href="/privacy" className="hover:text-[color:var(--text-primary)]">Privacy Policy</Link>
    {/* Imprint link removed: pointed at /legal/imprint, which doesn't exist
        anywhere in this app. Not repointing it at /terms or /privacy --
        an Impressum covers different legal content (company registration,
        address) that isn't safe to fabricate or imply from either page. */}
    <a href="mailto:juan@arf-ai.com" className="hover:text-[color:var(--text-primary)]">Contact</a>
  </div>
);

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------
type TabType = 'risk' | 'governance' | 'compliance';

const TABS: { id: TabType; label: string }[] = [
  { id: 'risk', label: 'Risk Intelligence' },
  { id: 'governance', label: 'Governance Operations' },
  { id: 'compliance', label: 'Compliance' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('risk');
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHttpWarning, setIsHttpWarning] = useState(false);
  const [explainLog, setExplainLog] = useState<AuditLogEntry | null>(null);

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
      <div className="arf-page-root flex min-h-screen items-center justify-center p-4">
        <div className="animate-pulse text-xl">Loading simulation...</div>
      </div>
    );
  }

  return (
    <div className="arf-page-root min-h-screen">
      <div className="arf-shell py-8 pb-24 sm:py-10 md:pb-10">
        <div className="space-y-6">
          {/* HTTP Warning (unchanged logic) */}
          {isHttpWarning && (
            <div className="rounded-lg border border-[#b3392a]/30 bg-[#b3392a]/10 p-3 text-center">
              <p className="text-sm text-[#b3392a]">⚠️ Security warning: You are viewing this page over HTTP. Sensitive data (simulated) could be intercepted. <a href={window.location.href.replace('http:', 'https:')} className="ml-2 font-semibold underline hover:opacity-80">Switch to HTTPS</a></p>
            </div>
          )}

          {/* Sandbox Disclaimer */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-arf-blue/25 bg-arf-blue/10 p-3 text-center">
            <p className="flex-1 text-sm text-[color:var(--text-secondary)]">🔍 Public sandbox – all data is simulated. Production governance requires a pilot agreement.</p>
            <Link href="/signup" className="whitespace-nowrap text-sm font-medium text-arf-blue underline hover:opacity-80">Request pilot access →</Link>
          </div>

          {/* Page heading + tab switcher. Previously the only heading was an
              <h1> inside the Risk tab's own card, so Governance and
              Compliance had no <h1> anywhere on the page. Also: the only
              control that ever called setActiveTab was DashboardBottomNav,
              which is md:hidden -- there was no way to reach Governance or
              Compliance at all on desktop. This adds both a real, always-
              visible tablist and a persistent page heading. */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-h2 font-semibold">Governance Console</h1>
            <div role="tablist" aria-label="Dashboard sections" className="hidden gap-2 md:flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-arf-blue to-arf-purple text-white'
                      : 'bg-[color:var(--surface-sunken)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Tab Content */}
          {activeTab === 'risk' && (
            <div className="space-y-6" role="tabpanel" id="tabpanel-risk" aria-labelledby="tab-risk">
              <DashboardMetricCard
                title="System Risk"
                action={
                  <button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    aria-label="Refresh data"
                    className="rounded-lg border border-[color:var(--hairline)] p-2 transition hover:border-arf-blue disabled:opacity-50"
                  >
                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                  </button>
                }
                footer={lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
              >
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                  <div className="flex-shrink-0"><RiskGauge risk={riskData.risk} size={180} /></div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><div className="text-sm text-[color:var(--text-muted)]">Risk Score</div><div className="text-3xl font-bold transition-colors duration-500" style={{ color: riskColor(riskData.risk) }}>{(riskData.risk * 100).toFixed(0)}%</div></div>
                      <div><div className="text-sm text-[color:var(--text-muted)]">Status</div><StatusBadge status={riskData.status} /></div>
                      <div><div className="text-sm text-[color:var(--text-muted)]">Posterior Variance</div><div className="font-mono text-lg">{riskData.variance.toFixed(4)}</div></div>
                      <div><div className="text-sm text-[color:var(--text-muted)]">Confidence Interval (90%)</div><div className="font-mono text-sm">[{Math.max(0, riskData.risk - 1.645 * Math.sqrt(riskData.variance)).toFixed(2)}, {Math.min(1, riskData.risk + 1.645 * Math.sqrt(riskData.variance)).toFixed(2)}]</div></div>
                    </div>
                    <RiskFactorBreakdown breakdown={riskData.breakdown} weights={riskData.weights} />
                  </div>
                </div>
              </DashboardMetricCard>

              <TrustBadges />

              {quota && (
                <div className="arf-card-substantial p-6">
                  <div className="mb-4 flex items-start justify-between"><h2 className="text-h3 font-semibold">Plan (Sandbox)</h2><span className="rounded-full bg-gradient-to-br from-arf-blue to-arf-purple px-3 py-1 text-xs font-medium text-white">{quota.tier.toUpperCase()}</span></div>
                  <div className="mb-4"><div className="mb-1 flex justify-between text-sm"><span className="text-[color:var(--text-secondary)]">Remaining evaluations this month</span><span className="font-mono font-medium">{quota.remaining.toLocaleString()}</span></div><div className="h-2 w-full rounded-full bg-[color:var(--surface-sunken)]"><div className="h-2 rounded-full bg-arf-blue" style={{ width: `${(quota.remaining / quota.limit) * 100}%` }} /></div><p className="mt-2 text-xs text-[color:var(--text-muted)]">Limit: {quota.limit.toLocaleString()} evaluations/month (simulated)</p></div>
                  <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-medium text-arf-blue hover:opacity-80">View access models → <ArrowRight size={14} /></Link>
                </div>
              )}

              <DashboardMetricCard title="Semantic Memory (Sandbox)" icon={Network}>
                <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                  <div><div className="text-2xl font-bold text-arf-blue">{mockMemoryStats.similar_incidents}</div><div className="text-xs text-[color:var(--text-muted)]">Similar Incidents</div></div>
                  <div><div className="text-2xl font-bold text-arf-purple">{mockMemoryStats.rag_similarity.toFixed(2)}</div><div className="text-xs text-[color:var(--text-muted)]">RAG Similarity</div></div>
                  <div><div className="text-2xl font-bold text-[#a66a1e]">{mockMemoryStats.cache_hits}</div><div className="text-xs text-[color:var(--text-muted)]">Cache Hits</div></div>
                  <div><div className="break-words font-mono text-xs text-[color:var(--text-secondary)]">{mockMemoryStats.memory_usage}</div><div className="text-xs text-[color:var(--text-muted)]">Index Type</div></div>
                </div>
              </DashboardMetricCard>

              <div className="arf-card-substantial p-6">
                <h2 className="mb-4 text-h3 font-semibold">Recent Incidents (Sandbox)</h2>
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--hairline)]">
                        <th className="px-2 py-2 text-left">Time</th>
                        <th className="px-2 py-2 text-left">Service</th>
                        <th className="px-2 py-2 text-left">Metric</th>
                        <th className="px-2 py-2 text-right">Value</th>
                        <th className="px-2 py-2 text-right">Risk</th>
                        <th className="px-2 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INCIDENTS.map((inc) => (
                        <tr key={inc.id} className="border-b border-[color:var(--hairline)]">
                          <td className="px-2 py-2 text-[color:var(--text-secondary)]">{inc.timestamp}</td>
                          <td className="px-2 py-2 text-[color:var(--text-secondary)]">{inc.service}</td>
                          <td className="px-2 py-2 text-[color:var(--text-secondary)]">{inc.metric}</td>
                          <td className="px-2 py-2 text-right font-mono text-[color:var(--text-secondary)]">{inc.value}</td>
                          <td className="px-2 py-2 text-right font-mono text-[#a66a1e]">{inc.risk.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${inc.action === 'ESCALATE' ? 'bg-[#b3392a]' : inc.action === 'DENY' ? 'bg-[#a66a1e]' : 'bg-[#3f7a5c]'}`}>
                              {inc.action}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* The table above is hidden below sm with no prior fallback --
                    was invisible on every phone. Stacked cards instead of just
                    letting the table scroll, since 6 columns of dense numeric
                    data doesn't reflow to a narrow screen as readably as it
                    scrolls; same row data, same values. */}
                <div className="flex flex-col gap-2.5 sm:hidden">
                  {MOCK_INCIDENTS.map((inc) => (
                    <div key={inc.id} className="rounded-lg bg-[color:var(--surface-sunken)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm">{inc.service}</p>
                          <p className="text-xs text-[color:var(--text-muted)]">{inc.timestamp}</p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white ${inc.action === 'ESCALATE' ? 'bg-[#b3392a]' : inc.action === 'DENY' ? 'bg-[#a66a1e]' : 'bg-[#3f7a5c]'}`}>
                          {inc.action}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
                        <span>{inc.metric}: <span className="font-mono text-[color:var(--text-secondary)]">{inc.value}</span></span>
                        <span>Risk: <span className="font-mono text-[#a66a1e]">{inc.risk.toFixed(2)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-[color:var(--text-muted)]">Simulated data for demonstration purposes only.</p>
              </div>

              <Testimonial />
            </div>
          )}

          {/* Governance Tab Content */}
          {activeTab === 'governance' && (
            <div className="space-y-6" role="tabpanel" id="tabpanel-governance" aria-labelledby="tab-governance">
              <DashboardMetricCard
                title="Policy Violations (Last 7 days)"
                icon={AlertTriangle}
                iconClassName="text-[#a66a1e]"
                footer="Simulated data – real engine provides live policy enforcement."
              >
                <div className="space-y-3">
                  {MOCK_POLICY_VIOLATIONS.map((v) => (
                    <div key={v.id} className="flex flex-col gap-1 rounded-lg bg-[color:var(--surface-sunken)] p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                      <div><span className="font-mono text-sm">{v.policy}</span><span className="ml-2 text-xs text-[color:var(--text-muted)]">on {v.component}</span></div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs text-white ${v.severity === 'high' ? 'bg-[#b3392a]' : v.severity === 'medium' ? 'bg-[#a66a1e]' : 'bg-arf-blue'}`}>{v.severity.toUpperCase()}</span>
                        <span className="text-xs text-[color:var(--text-muted)]">{v.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardMetricCard>

              <DashboardMetricCard
                title="Audit Trail (Recent decisions)"
                icon={FileText}
                footer="Audit logs are immutable and cryptographically signable in production. Click a row to see how a decision was reached."
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--hairline)]">
                        <th className="px-2 py-2 text-left">Timestamp</th>
                        <th className="px-2 py-2 text-left">Component</th>
                        <th className="px-2 py-2 text-left">Action</th>
                        <th className="px-2 py-2 text-right">Risk</th>
                        <th className="px-2 py-2 text-right">Decision</th>
                        <th className="px-2 py-2 text-left">User</th>
                        <th className="px-2 py-2 text-right">
                          <span className="sr-only">Explain</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_AUDIT_LOGS.map((log) => (
                        <tr key={log.id} className="border-b border-[color:var(--hairline)]">
                          <td className="whitespace-nowrap px-2 py-2 text-[color:var(--text-secondary)]">{log.timestamp}</td>
                          <td className="px-2 py-2 text-[color:var(--text-secondary)]">{log.component}</td>
                          <td className="px-2 py-2 text-[color:var(--text-secondary)]">{log.action}</td>
                          <td className="px-2 py-2 text-right font-mono text-[#a66a1e]">{log.riskScore.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right"><span className={`rounded-full px-2 py-0.5 text-xs text-white ${log.decision === 'ESCALATE' ? 'bg-[#b3392a]' : log.decision === 'DENY' ? 'bg-[#a66a1e]' : 'bg-[#3f7a5c]'}`}>{log.decision}</span></td>
                          <td className="px-2 py-2 text-[color:var(--text-muted)]">{log.user}</td>
                          <td className="px-2 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setExplainLog(log)}
                              aria-label={`Explain ${log.action} on ${log.component}`}
                              aria-haspopup="dialog"
                              className="inline-flex items-center justify-center rounded-lg p-1 text-[color:var(--text-muted)] transition hover:text-arf-blue"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashboardMetricCard>

              {explainLog && (
                <ExplainabilityModal open={!!explainLog} onClose={() => setExplainLog(null)} {...auditLogExplanation(explainLog)} />
              )}

              <DashboardMetricCard title="Cooldown & Rate Limits (Sandbox)" icon={Clock} iconClassName="text-[#a66a1e]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-[color:var(--surface-sunken)] p-3"><div><span className="font-mono text-sm">payment-api</span><span className="ml-2 text-xs text-[color:var(--text-muted)]">(policy: latency_gt_100)</span></div><span className="rounded-full bg-[#a66a1e] px-2 py-0.5 text-xs text-white">Cooldown: 45s remaining</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-[color:var(--surface-sunken)] p-3"><div><span className="font-mono text-sm">database</span><span className="ml-2 text-xs text-[color:var(--text-muted)]">(policy: cpu_high)</span></div><span className="rounded-full bg-[#a66a1e] px-2 py-0.5 text-xs text-white">Rate limit: 2/5 per hour</span></div>
                </div>
              </DashboardMetricCard>

              <div className="rounded-[18px] border border-arf-blue/15 bg-gradient-to-br from-arf-blue/10 to-arf-purple/10 p-6 text-center">
                <h2 className="mb-2 text-h3 font-semibold">Take full control of governance</h2>
                <p className="mb-4 text-[color:var(--text-secondary)]">Policy enforcement, audit trails, and compliance reporting are available in the real engine.</p>
                <Link href="/signup" className="arf-btn-primary">Request Pilot Access <ArrowRight size={16} /></Link>
              </div>
            </div>
          )}

          {/* Compliance Tab Content */}
          {activeTab === 'compliance' && (
            <div className="space-y-6" role="tabpanel" id="tabpanel-compliance" aria-labelledby="tab-compliance">
              <div className="arf-card-substantial p-6">
                <h2 className="mb-4 flex items-center gap-2 text-h3 font-semibold"><Shield className="h-5 w-5 text-[#3f7a5c]" /> Compliance & Certifications</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-[color:var(--surface-sunken)] p-3 text-center"><div className="text-2xl font-bold text-[#3f7a5c]">✓</div><div className="text-sm">SOC2 Type II</div><div className="text-xs text-[color:var(--text-muted)]">Audit ready</div></div>
                  <div className="rounded-lg bg-[color:var(--surface-sunken)] p-3 text-center"><div className="text-2xl font-bold text-arf-blue">✓</div><div className="text-sm">ISO 27001</div><div className="text-xs text-[color:var(--text-muted)]">Compliant</div></div>
                  <div className="rounded-lg bg-[color:var(--surface-sunken)] p-3 text-center"><div className="text-2xl font-bold text-arf-purple">✓</div><div className="text-sm">GDPR</div><div className="text-xs text-[color:var(--text-muted)]">Ready</div></div>
                </div>
                <p className="mt-4 text-xs text-[color:var(--text-muted)]">The real engine provides evidence packages for auditors.</p>
              </div>

              <div className="arf-card-substantial p-6">
                <h2 className="mb-4 flex items-center gap-2 text-h3 font-semibold"><Lock className="h-5 w-5 text-arf-blue" /> Data Retention & Privacy</h2>
                <ul className="list-inside list-disc space-y-2 text-sm text-[color:var(--text-secondary)]">
                  <li>Sandbox logs retained for 30 days</li>
                  <li>Pilot/Enterprise logs retained up to 12 months</li>
                  <li>No raw customer data stored – only anonymised risk metrics</li>
                  <li>Encryption at rest (AES-256) and in transit (TLS 1.3)</li>
                  <li>Right to deletion and data portability supported</li>
                </ul>
              </div>

              <div className="arf-card-substantial p-6 text-center">
                <h2 className="mb-2 text-h3 font-semibold">Export Compliance Report</h2>
                <p className="mb-4 text-[color:var(--text-secondary)]">Generate a summary report of governance decisions, policy violations, and system status for auditors.</p>
                <button onClick={() => window.print()} className="arf-btn-secondary"><Printer size={16} /> Print / Save as PDF (simulated)</button>
                <p className="mt-3 text-xs text-[color:var(--text-muted)]">Simulated action – real engine provides automated compliance report generation.</p>
              </div>

              <div className="rounded-[18px] border border-arf-blue/15 bg-gradient-to-br from-arf-blue/10 to-arf-purple/10 p-6 text-center">
                <h2 className="mb-2 text-h3 font-semibold">Get audit‑ready with ARF</h2>
                <p className="mb-4 text-[color:var(--text-secondary)]">Immutable logs, deterministic enforcement, and compliance evidence packages.</p>
                <Link href="/signup" className="arf-btn-primary">Request Pilot Access <ArrowRight size={16} /></Link>
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
