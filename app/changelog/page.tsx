'use client';

import { useEffect, useState } from 'react';
import { Calendar, Tag, Copy, Check, Mail, Sparkles, ArrowRight, Shield, MessageSquare, Rocket } from 'lucide-react';
import Link from 'next/link';

// Types for changelog entries
interface ChangelogEntry {
  date: string;          // ISO date (YYYY-MM-DD)
  title: string;
  description: string;
  type: 'public' | 'pilot';
  link?: string;
}

// Default entries to showcase v4.3.2 upgrades even when no JSON is loaded.
// These are also merged into public/data/changelog.json, but are kept here
// too (and re-merged in on every load) so the showcase content can never
// silently disappear if changelog.json is later edited, reverted, or fails
// to load.
const DEFAULT_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-07-30',
    title: 'v4.3.2 Axiom — Enterprise Control Plane',
    description:
      'The first named ARF AI release. Axiom introduces deterministic replay verification, active cost inference via Bayesian experimental design, a hardened gateway with defense-in-depth, and a fully enterprise-positioned Governance Console. All Dependabot alerts resolved across all repositories.',
    type: 'public',
    link: 'https://github.com/arf-foundation/agentic_reliability_framework/releases/tag/v4.3.2-axiom',
  },
  {
    date: '2026-07-23',
    title: 'Enterprise Repositioning & Governance Console',
    description:
      'The ARF AI public presence has been transformed into an enterprise‑grade control plane for autonomous AI. The landing page, navigation, and messaging now speak directly to CTOs, compliance officers, and AI infrastructure buyers. The live demo dashboard is rebranded as the Governance Console with clearer sandbox disclaimers and enterprise‑ready trust signals.',
    type: 'public',
    link: 'https://github.com/arf-foundation/arf-frontend/releases/tag/v4.3.2',
  },
  {
    date: '2026-07-22',
    title: 'Dynamic Risk Tracking with Augmented Gaussian Sum Filter (AGSF)',
    description:
      'Pilot customers can now enable continuous Bayesian risk tracking via the Augmented Gaussian Sum Filter. Operating in log‑odds space, the filter maintains a Gaussian mixture approximation of the posterior failure probability, updating with every decision. It resists covariance inflation and provides sharper risk estimates than the static conjugate prior—all while preserving deterministic replay via intent‑seeded RNG.',
    type: 'pilot',
    link: 'https://github.com/arf-foundation/agentic_reliability_framework/releases/tag/v4.3.2',
  },
  {
    date: '2026-07-22',
    title: 'Cost Inference Engine (Maximum Entropy IRL)',
    description:
      'The governance loop now learns operational cost parameters from human overrides using maximum entropy inverse reinforcement learning. With a Bayesian prior and MAP estimation, the engine continuously refines expected‑loss minimisation to better match your organisation’s risk appetite. Available after recording 10+ overrides.',
    type: 'pilot',
    link: 'https://github.com/arf-foundation/agentic_reliability_framework/releases/tag/v4.3.2',
  },
  {
    date: '2026-07-22',
    title: 'Offline RL Policy Fallback (CQL + Lyapunov Barrier)',
    description:
      'An optional offline RL policy can now override rule‑based decisions when confidence is high. Trained via Conservative Q‑Learning with a Lyapunov stability constraint, the policy minimises long‑term risk while respecting safety boundaries. This enables adaptive governance that improves with operational history—without online exploration.',
    type: 'pilot',
    link: 'https://github.com/arf-foundation/agentic_reliability_framework/releases/tag/v4.3.2',
  },
];

// arf-ai-... not a-r-f-...: the HF org renamed A-R-F -> ARF-AI and the old
// domain 404s directly (verified against HF's api/spaces endpoint), even
// though HF still lists it as a "READY" mapping.
const CURL_COMMAND = `curl -X POST https://arf-ai-arf-sandbox-api.hf.space/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

export default function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    document.title = "ARF AI – Changelog & Pilot Updates";
  }, []);

  const copyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const res = await fetch('/data/changelog.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const loaded: ChangelogEntry[] = data.entries || [];

        // Merge in any showcase entries not already present in the loaded
        // JSON (matched by date+title), so they're always visible regardless
        // of the JSON file's state, without duplicating entries that are
        // already there.
        const loadedKeys = new Set(loaded.map((e) => `${e.date}|${e.title}`));
        const missingDefaults = DEFAULT_ENTRIES.filter(
          (e) => !loadedKeys.has(`${e.date}|${e.title}`)
        );
        const merged = [...missingDefaults, ...loaded].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(merged.length > 0 ? merged : DEFAULT_ENTRIES);
      } catch (err) {
        console.warn('Changelog JSON not available, using default entries.', err);
        setEntries(DEFAULT_ENTRIES);
      } finally {
        setLoading(false);
      }
    };
    fetchChangelog();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="arf-page-root min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-pulse space-y-6">
              <div className="mx-auto h-10 w-2/3 rounded bg-[color:var(--surface-raised)]" />
              <div className="mx-auto h-5 w-1/2 rounded bg-[color:var(--surface-raised)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="arf-page-root min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h1 className="arf-gradient-text mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              What’s New in ARF AI
            </h1>
            <p className="mx-auto max-w-2xl text-base text-[color:var(--text-secondary)] sm:text-lg">
              Updates to the ARF AI Governance Console, public sandbox, and the protected core engine (available to pilot customers).
            </p>
          </div>

          {/* Changelog entries */}
          <div className="mb-16 space-y-8">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl border p-6 transition hover:border-arf-blue/50 hover:shadow-xl ${
                  entry.type === 'pilot'
                    ? 'border-arf-purple/40 bg-arf-purple/5'
                    : 'border-[color:var(--hairline)] bg-[color:var(--surface-raised)]'
                }`}
              >
                {entry.type === 'pilot' && (
                  <div className="absolute right-4 top-0 -translate-y-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-arf-purple px-3 py-1 text-xs font-bold text-white shadow-lg">
                      <Shield size={12} /> PILOT
                    </span>
                  </div>
                )}
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      entry.type === 'public'
                        ? 'border-arf-blue/40 bg-arf-blue/10 text-arf-blue'
                        : 'border-arf-purple/40 bg-arf-purple/10 text-arf-purple'
                    }`}
                  >
                    {entry.type === 'public' ? '📘 Public Console' : '✈️ Pilot Program'}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[color:var(--text-muted)]">
                    <Calendar size={14} />
                    {formatDate(entry.date)}
                  </span>
                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-sm text-arf-blue hover:underline"
                    >
                      <Tag size={14} /> Release notes
                    </a>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-bold text-[color:var(--text-primary)]">{entry.title}</h3>
                <p className="leading-relaxed text-[color:var(--text-secondary)]">{entry.description}</p>
                {entry.type === 'pilot' && (
                  <div className="mt-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-arf-purple" />
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-1 text-sm font-medium text-arf-purple transition hover:brightness-110"
                    >
                      Available to pilot customers → <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Newsletter – lead capture placeholder */}
          <div className="arf-card mb-12 p-8 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-arf-blue" />
            <h2 className="mb-2 text-2xl font-bold">Stay ahead of autonomous AI governance</h2>
            <p className="mx-auto mb-6 max-w-md text-[color:var(--text-muted)]">
              Newsletter signup is coming soon. For now, join our Slack community to get early updates and discuss ARF with the team.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#4A154B] px-6 py-3 font-medium text-white transition hover:bg-[#3e0e3f]"
              >
                <MessageSquare size={18} /> Join Slack
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-arf-blue px-6 py-3 font-medium text-white transition hover:brightness-110"
              >
                Request Pilot Access <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-4 text-xs text-[color:var(--text-muted)]">No spam. Unsubscribe anytime once the newsletter launches.</p>
          </div>

          {/* Sandbox API section */}
          <div className="arf-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Rocket size={18} className="text-green-500" />
              Try the Sandbox API
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-[color:var(--surface-sunken)] p-4">
                <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-green-500">{CURL_COMMAND}</pre>
                <button
                  onClick={() => copyCode(CURL_COMMAND)}
                  className="shrink-0 rounded-lg border border-[color:var(--hairline)] p-2 transition hover:border-[color:var(--color-arf-blue)]"
                  aria-label="Copy curl command"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-[color:var(--text-secondary)]" />}
                </button>
              </div>
              <p className="text-sm text-amber-500">
                ⚠️ This is a simulated evaluation endpoint. It does <strong>not</strong> use the protected core engine. For pilot access,{' '}
                <Link href="/signup" className="underline hover:brightness-110">request here</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
