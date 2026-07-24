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

// Default entries to showcase v4.3.2 upgrades even when no JSON is loaded
const DEFAULT_ENTRIES: ChangelogEntry[] = [
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

const CURL_COMMAND = `curl -X POST https://a-r-f-arf-sandbox-api.hf.space/v1/evaluate \\
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
        const loaded = data.entries || [];
        setEntries(loaded.length > 0 ? loaded : DEFAULT_ENTRIES);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-700 rounded w-2/3 mx-auto" />
              <div className="h-5 bg-gray-700 rounded w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              What’s New in ARF AI
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
              Updates to the ARF AI Governance Console, public sandbox, and the protected core engine (available to pilot customers).
            </p>
          </div>

          {/* Changelog entries */}
          <div className="space-y-8 mb-16">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className={`relative bg-gray-800/70 backdrop-blur-sm rounded-xl border p-6 transition hover:shadow-xl hover:border-blue-500/50 ${
                  entry.type === 'pilot'
                    ? 'border-purple-800/60 bg-purple-900/10'
                    : 'border-gray-700'
                }`}
              >
                {entry.type === 'pilot' && (
                  <div className="absolute top-0 right-4 -translate-y-1/2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Shield size={12} /> PILOT
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      entry.type === 'public'
                        ? 'bg-blue-900/80 text-blue-200 border border-blue-700'
                        : 'bg-purple-900/80 text-purple-200 border border-purple-700'
                    }`}
                  >
                    {entry.type === 'public' ? '📘 Public Console' : '✈️ Pilot Program'}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(entry.date)}
                  </span>
                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm hover:underline flex items-center gap-1 ml-auto"
                    >
                      <Tag size={14} /> Release notes
                    </a>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
                <p className="text-gray-300 leading-relaxed">{entry.description}</p>
                {entry.type === 'pilot' && (
                  <div className="mt-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    <Link
                      href="/signup"
                      className="text-sm font-medium text-purple-400 hover:text-purple-300 transition inline-flex items-center gap-1"
                    >
                      Available to pilot customers → <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Newsletter – lead capture placeholder */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 mb-12 text-center">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">Stay ahead of autonomous AI governance</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Newsletter signup is coming soon. For now, join our Slack community to get early updates and discuss ARF with the team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A154B] hover:bg-[#3e0e3f] text-white rounded-lg font-medium transition"
              >
                <MessageSquare size={18} /> Join Slack
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Request Pilot Access <ArrowRight size={16} />
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">No spam. Unsubscribe anytime once the newsletter launches.</p>
          </div>

          {/* Sandbox API section */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Rocket size={18} className="text-green-400" />
              Try the Sandbox API
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">{CURL_COMMAND}</pre>
                <button
                  onClick={() => copyCode(CURL_COMMAND)}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition shrink-0"
                  aria-label="Copy curl command"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
                </button>
              </div>
              <p className="text-sm text-amber-300/80">
                ⚠️ This is a simulated evaluation endpoint. It does <strong>not</strong> use the protected core engine. For pilot access,{' '}
                <Link href="/signup" className="underline text-amber-200 hover:text-amber-100">request here</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
