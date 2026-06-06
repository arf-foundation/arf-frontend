'use client';

/**
 * Landing page for the Agentic Reliability Framework (ARF).
 *
 * This page serves as the primary marketing surface for the ARF governance layer.
 * It explains the problem of ungoverned AI agents, presents ARF as the solution,
 * and provides multiple pathways for enterprise customers to engage (pilot sign‑up,
 * sandbox API, live demos, specification access).
 *
 * Key design decisions:
 * - Hybrid pricing (fixed deployment fee + outcome‑based or retainer) is explained
 *   in the Access Models section.
 * - Trust badges (SOC2 readiness, security‑first design, privacy‑conscious
 *   deployments) appear immediately after the hero call‑to‑action to reduce
 *   perceived risk.
 * - The pilot testimonial was intentionally removed to avoid any appearance of
 *   unsubstantiated marketing claims.
 * - All live‑demo and sandbox‑API sections clearly state that responses are mock
 *   data and that the real engine is access‑controlled.
 *
 * @module LandingPage
 */

import Link from 'next/link';
import { useState, useEffect, useRef, type ReactNode, type ElementType } from 'react';
import {
  ArrowRight,
  Rocket,
  Cpu,
  Brain,
  Scale,
  Network,
  Mail,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  FileText,
} from 'lucide-react';
import { useInView } from './hooks/useInView';
import Mermaid from '../components/Mermaid';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ============================================================================
// Content constants
// ============================================================================

/** Mermaid diagram showing the ARF governance flow (Agent Intent + Telemetry → Evaluate & Decide → Approve/Deny/Escalate). */
const DIAGRAM = `flowchart TD
    subgraph Input["Infrastructure Signals"]
        A[Agent Intent]
        B[Telemetry Data]
    end
    subgraph Governance["ARF Governance"]
        C[Evaluate & Decide]
    end
    subgraph Outcomes["Outcome"]
        F[✅ Approve]
        G[⚠️ Escalate]
        H[❌ Deny]
    end
    A --> C
    B --> C
    C --> F
    C --> G
    C --> H`;

/** cURL command demonstrating the public sandbox API (mock responses only). */
const CURL_COMMAND = `curl -X POST https://a-r-f-arf-sandbox-api.hf.space/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

/** Feature cards displayed in the "Key Capabilities" section. */
const FEATURES = [
  {
    title: 'Continuous Risk Calibration',
    description: 'Confidence that improves with every decision — closed‑loop feedback without exposing internal logic.',
    icon: Brain,
    color: 'blue',
    details:
      'The system learns from outcomes and adjusts its risk assessments over time. This keeps decisions accurate and trustworthy without revealing how calibration works.',
  },
  {
    title: 'Operational Memory',
    description: 'Remembers past incidents so decisions are never made in a vacuum.',
    icon: Network,
    color: 'green',
    details:
      'Past incidents are used to inform future decisions. The system blends experience from previous outcomes into each new assessment, within controlled and auditable limits.',
  },
  {
    title: 'Cost‑Optimized Decisioning',
    description: 'Balances safety, cost, and business impact automatically.',
    icon: Scale,
    color: 'yellow',
    details:
      'Every action is evaluated against a configurable cost model that accounts for impact, restoration speed, and uncertainty. The chosen action comes with a human‑readable justification.',
  },
  {
    title: 'Unified System Oversight',
    description: 'Anomaly detection, diagnostics, and forecasting in one loop.',
    icon: Cpu,
    color: 'purple',
    details:
      'Multiple analysis modules work together to catch early warnings, diagnose issues, and forecast health — producing consolidated, policy‑aligned recommendations.',
  },
];

/** Demo cards for the "Live Demos" section. */
const DEMOS = [
  {
    title: 'Risk Dashboard',
    description: 'Interactive risk visualisation (mock data)',
    link: 'https://arf-foundation.github.io/arf-risk-demo/',
    buttonText: 'Launch',
    external: true,
  },
  {
    title: 'Advisory API',
    description: (
      <div className="flex items-center gap-2">
        <pre className="bg-gray-900 p-2 rounded text-sm font-mono text-green-300 whitespace-pre-wrap break-all flex-1">
          curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/v1/incidents/evaluate
        </pre>
      </div>
    ),
    link: 'https://huggingface.co/spaces/A-R-F/ARF-Sandbox-API',
    buttonText: 'Try API',
    external: true,
  },
  {
    title: 'Governance Dashboard',
    description: 'Advisory visualisation connected to the public sandbox',
    link: '/dashboard',
    buttonText: 'Go',
    external: false,
  },
  {
    title: 'Reliable AI Systems Stack',
    description: 'Curated tools for AI reliability',
    link: 'https://huggingface.co/collections/petter2025/reliable-ai-systems-stack',
    buttonText: 'Explore',
    external: true,
  },
];

/** Trust badges displayed beneath the hero CTA. */
const TRUST_BADGES = [
  { label: 'Architected for SOC2 readiness', color: 'green' },
  { label: 'Security‑first operational design', color: 'blue' },
  { label: 'Supports privacy‑conscious deployments', color: 'purple' },
];

/** Repository cards for the "Open Specs & Protected Core" section. */
const REPOS = [
  { name: "Core Governance Engine", desc: "Protected core engine – Bayesian risk scoring, semantic memory, governance loop.", isPrivate: true },
  { name: "API Control Plane", desc: "Access‑controlled API gateway – governs access, enforces quotas, logs every decision.", isPrivate: true },
  { name: "Management UI", desc: "Frontend dashboard – pilot access only", isPrivate: true },
  { name: "Open Specification", desc: "Canonical specification – Apache 2.0", isPrivate: false },
];

/** Map badge color names to Tailwind text classes for the shield icons. */
const BADGE_ICON_CLASSES: Record<string, string> = {
  green: 'text-green-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
};

// ============================================================================
// Main component
// ============================================================================

/**
 * LandingPage component.
 *
 * Renders the full marketing landing page for ARF, including hero, trust badges,
 * problem/solution/outcome summary, "How ARF Works" diagram, key capabilities,
 * enterprise trust section, access models, sandbox API demo, live demos, open specs,
 * and a footer with contact links and legal navigation.
 *
 * All interactive elements (copy buttons, sandbox fetch) are self‑contained.
 * The component uses the `useInView` hook for scroll‑triggered fade‑in animations.
 */
export default function LandingPage() {
  /* ------------------------------------------------------------------
   * Local state for clipboard operations and sandbox API demo
   * ------------------------------------------------------------------ */
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedFullSnippet, setCopiedFullSnippet] = useState(false);
  const [copiedSandboxResponse, setCopiedSandboxResponse] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<Record<string, unknown> | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  // Mounted guard to prevent state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      const refs = timeoutRefs.current;
      Object.values(refs).forEach(clearTimeout);
    };
  }, []);

  /**
   * Update a copy‑state flag and clear it after a timeout.
   * Prevents stale timeouts by clearing any existing timer for the key.
   */
  const setCopyState = (key: string, value: boolean, duration = 2000) => {
    if (timeoutRefs.current[key]) clearTimeout(timeoutRefs.current[key]);
    if (value) {
      timeoutRefs.current[key] = setTimeout(() => {
        setCopyState(key, false);
        delete timeoutRefs.current[key];
      }, duration);
    }
    switch (key) {
      case 'email':
        setCopiedEmail(value);
        break;
      case 'fullSnippet':
        setCopiedFullSnippet(value);
        break;
      case 'sandboxResponse':
        setCopiedSandboxResponse(value);
        break;
    }
  };

  /** Generic clipboard writer with error handling. */
  const handleCopy = async (text: string, key: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(key, true);
      setCopyError(null);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
      setCopyError(successMessage ? `Could not copy ${successMessage}` : 'Copy failed');
      setTimeout(() => setCopyError(null), 2000);
    }
  };

  const handleCopyEmail = () => handleCopy('contact', 'email');
  const handleCopyFullSnippet = () => handleCopy(CURL_COMMAND, 'fullSnippet', 'curl command');
  const handleCopySandboxResponse = () => {
    if (sandboxResponse) handleCopy(JSON.stringify(sandboxResponse, null, 2), 'sandboxResponse', 'API response');
  };

  /** Fetch a mock evaluation from the public sandbox API. */
  const fetchSandboxResponse = async () => {
    setSandboxLoading(true);
    setSandboxError(null);
    try {
      const res = await fetch('https://a-r-f-arf-sandbox-api.hf.space/v1/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: 'api',
          event_type: 'latency',
          severity: 'high',
          metrics: { latency_ms: 450 },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (isMounted.current) setSandboxResponse(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (isMounted.current) setSandboxError(message);
    } finally {
      if (isMounted.current) setSandboxLoading(false);
    }
  };

  const trackSlackClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slack_invite_click', { event_category: 'engagement' });
    }
  };

  // Intersection observers for scroll‑triggered fade‑in
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.2, once: true });
  const { ref: capabilitiesRef, inView: capabilitiesInView } = useInView({ threshold: 0.2, once: true });
  const { ref: demosRef, inView: demosInView } = useInView({ threshold: 0.2, once: true });
  const { ref: reposRef, inView: reposInView } = useInView({ threshold: 0.2, once: true });
  const { ref: footerRef, inView: footerInView } = useInView({ threshold: 0.1, once: true });

  return (
    <div className="min-h-screen text-white">
      {/* ==================================================================
           Hero section – headline, subhead, trust badges, primary CTAs
           ================================================================== */}
      <section
        ref={heroRef}
        className={`container mx-auto px-4 py-20 text-center transition-opacity duration-1000 ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Govern every AI decision
            </span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Every AI‑assisted infrastructure decision is evaluated, logged, and kept under your
          control — without slowing your team down.
        </p>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-8 max-w-md mx-auto">
          <p className="text-blue-300 text-sm">
            🔐 Pilot access is by invitation only. Every application is personally
            reviewed by the founder and matched to qualified use cases.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-lg"
          >
            Request Pilot Access <ArrowRight size={18} />
          </Link>
          <a
            href="https://github.com/arf-foundation"
            target="_blank"

            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            View Technical Spec <ArrowRight size={18} />
          </a>
        </div>

        {/* Trust badges – immediately after hero CTA */}
        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-700">
              <Shield className="w-4 h-4 text-green-400" /> Architected for SOC2 readiness
            </div>
            <div className="bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-700">
              <Shield className="w-4 h-4 text-blue-400" /> Security‑first operational design
            </div>
            <div className="bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-700">
              <Shield className="w-4 h-4 text-purple-400" /> Supports privacy‑conscious deployments
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Designed for regulated environments – audit trails, SSO, and deterministic
            enforcement available in pilot.
          </p>
        </div>

        <p className="text-gray-400 text-sm mt-4">
          ⚡ The public sandbox returns only mock advisory responses. Real enforcement,
          audit trails, and confidence guarantees require a pilot agreement.
        </p>
      </section>

      {/* Community links */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <a
              href="https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg"
              target="_blank"

              className="text-gray-300 hover:text-white transition"
              onClick={trackSlackClick}
            >
              Join our Slack community
            </a>
          </div>
          <a
            href="https://github.com/arf-foundation"
            target="_blank"

            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Problem / Solution / Outcome + How ARF Works – combined concise block */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
            <div>
              <div className="text-red-400 font-bold text-xl mb-2">⚠️ Problem</div>
              <p className="text-gray-300">
                AI agents fail silently in production, generating untraceable,
                unauditable decisions that expose your organization to operational
                risk and compliance gaps.
              </p>
            </div>
            <div>
              <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
              <p className="text-gray-300">
                ARF wraps AI outputs in a deterministic governance layer that
                evaluates, constrains, and logs every decision — keeping you in
                control, always.
              </p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
              <p className="text-gray-300">
                Auditable operations with mechanical enforcement, calibrated
                confidence, and decision trails that withstand regulatory scrutiny
                and internal review.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-center">How ARF Works</h2>
          <figure>
            <Mermaid chart={DIAGRAM} className="overflow-x-auto flex justify-center" />
            <figcaption className="sr-only">
              Infrastructure signals are evaluated by ARF, which then decides to approve, deny, or escalate.
            </figcaption>
          </figure>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Infrastructure signals → ARF governance → Approve / Deny / Escalate
          </p>
        </div>
      </div>

      {/* Key Capabilities */}
      <section
        ref={capabilitiesRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          capabilitiesInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Key Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Trust */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Built for the Demands of Enterprise Governance
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <FileText className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Tamper‑Evident Audit Trail</h3>
              <p className="text-gray-400">
                Every decision is recorded, timestamped, and attributed. Logs are
                designed for regulatory review, forensic analysis, and compliance
                preparation — no exceptions, no gaps.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <Lock className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Mechanical Enforcement</h3>
              <p className="text-gray-400">
                Policy gates that cannot be bypassed or silently overridden. Every
                override is logged. Enforcement is deterministic — not advisory.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <Brain className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Explainable Reasoning</h3>
              <p className="text-gray-400">
                Every risk score is backed by transparent logic — never a black‑box.
                Suitable for executive briefings, regulator inquiries, and third‑party
                audits.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="bg-gray-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-700"
              >
                <Shield className={`w-4 h-4 ${BADGE_ICON_CLASSES[badge.color]}`} /> {badge.label}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition inline-flex items-center gap-2"
            >
              View Access Models <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Access Models */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-1 text-center">Access Models</h3>
          <p className="text-sm text-gray-400 text-center mb-6">
            ARF uses a hybrid pricing model: a fixed deployment fee starting at $50k,
            plus either outcome‑based pricing or a monthly retainer. Pilot access is
            time‑limited and free for qualified organizations — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Sandbox</div>
              <div className="text-gray-400 text-sm mt-1">Advisory Only</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ 1,000 advisory evaluations/month</li>
                <li>✓ Mock responses — not production</li>
                <li>✓ Community support</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Pilot</div>
              <div className="text-gray-400 text-sm mt-1">Time‑Limited · Free</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Protected core access</li>
                <li>✓ Outcome‑based or retainer after pilot</li>
                <li>✓ Founder‑led onboarding</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Enterprise</div>
              <div className="text-gray-400 text-sm mt-1">Commercial · Hybrid</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Fixed deployment fee (starts $50k)</li>
                <li>✓ Outcome‑based or retainer maintenance</li>
                <li>✓ SSO, multi‑tenancy, SLA</li>
                <li>✓ Full enforcement + audit trails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Try the Advisory API */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-1">Try the Advisory API</h2>
          <p className="text-sm text-amber-400 mb-4">
            ⚠️ This endpoint returns mock responses. The protected core engine is not
            publicly accessible. All responses contain{' '}
            <code className="font-mono bg-gray-900 px-1 rounded">status: &quot;success&quot;</code> and are
            labelled as simulated in the justification.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
              <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">
                {CURL_COMMAND}
              </pre>
              <button
                type="button"
                onClick={handleCopyFullSnippet}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex-shrink-0"
                aria-label="Copy full curl command"
              >
                {copiedFullSnippet ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
              </button>
            </div>

            <button
              type="button"
              onClick={fetchSandboxResponse}
              disabled={sandboxLoading}
              className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {sandboxLoading ? <><span className="animate-spin">⏳</span> Evaluating...</> : <><Rocket size={16} /> Try it live</>}
            </button>

            {sandboxResponse && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-gray-400">Live sandbox response (mock)</span>
                  <button
                    type="button"
                    onClick={handleCopySandboxResponse}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {copiedSandboxResponse ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(sandboxResponse, null, 2)}
                </pre>
              </div>
            )}
            {sandboxError && <p className="text-sm text-red-400">Failed to reach sandbox: {sandboxError}</p>}
          </div>
          <p className="text-sm text-gray-400 mt-4">
            The response includes a recommendation, a mock risk indicator, and a justification that clearly
            states the evaluation is simulated. Mechanical enforcement requires a pilot agreement and access to the
            protected control plane.
          </p>
        </div>
      </div>

      {/* Live Demos */}
      <section
        ref={demosRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          demosInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Live Demos</h2>
          <p className="text-gray-400 text-center text-sm mb-10">
            All demos use mock or advisory data. The protected core engine is not publicly accessible.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {DEMOS.map((demo, idx) => (
              <DemoCard key={idx} {...demo} />
            ))}
          </div>
        </div>
      </section>

      {/* Open Specs & Protected Core */}
      <section
        ref={reposRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          reposInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Open Specifications &amp; Protected Core</h2>
          <p className="text-gray-400 text-center text-sm max-w-3xl mx-auto mb-6">
            ARF’s core engine is access‑controlled and not publicly available. However, we provide open specifications
            (data models, API contracts, decision rules) under written terms to qualified pilots. This approach gives you
            full transparency into how decisions are made, while preserving the integrity and security of the production
            engine. All code, specifications, and materials are proprietary and protected as trade secrets.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPOS.map((repo) => (
              <RepoCard key={repo.name} {...repo} />
            ))}
          </div>
          <p className="text-gray-400 text-center text-xs mt-6">
            The specification and API contracts are shared under written terms. <Link href="/signup" className="text-blue-400 hover:underline">Request pilot access</Link> to receive them.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={footerRef}
        className={`border-t border-gray-700 py-12 text-center text-gray-400 transition-opacity duration-1000 ${
          footerInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Connect with Us</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <ContactLink
                  href="/contact"
                  icon={<Mail className="w-5 h-5" />}
                  text="contact"
                  emoji="📬"
                />
                
              </div>
              <ContactLink href="https://www.linkedin.com/in/petterjuan/" text="Juan Petter" emoji="🔗" />
              <ContactLink href="https://calendly.com/petter2025us/30min" text="Book a Call" emoji="📅" />
              <ContactLink
                href="https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg"
                icon={<MessageSquare className="w-5 h-5" />}
                text="Join Slack"
                emoji="💬"
                onClick={trackSlackClick}
              />
            </div>
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-white mb-2">Request Pilot Access</h4>
            <p className="text-sm text-gray-400 mb-4">
              The core ARF engine is available to qualified pilots under a time‑limited, hybrid evaluation.
              Email us with your organization, use case, and expected evaluation volume.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Mail className="w-4 h-4" /> Apply for Pilot Access
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/pricing" className="hover:text-white transition">Access Models</Link>
            <Link href="/signup" className="hover:text-white transition">Request Access</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <a href="https://github.com/arf-foundation" target="_blank" className="hover:text-white transition flex items-center gap-1" rel="noopener noreferrer">GitHub</a>
            <a href="https://huggingface.co/A-R-F" target="_blank" className="hover:text-white transition flex items-center gap-1" rel="noopener noreferrer">🤗 Hugging Face</a>
            <a href="https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg" target="_blank" onClick={trackSlackClick} className="hover:text-white transition flex items-center gap-1" rel="noopener noreferrer"><MessageSquare size={18} /> Slack</a>
            <a href="https://www.linkedin.com/company/agentic-reliability" target="_blank" className="hover:text-white transition flex items-center gap-1" rel="noopener noreferrer">LinkedIn</a>
          </div>

          <p className="text-sm">
            © 2026 ARF Foundation. All repositories are private and access‑controlled.
            The core engine is proprietary. Selected materials are shared under written
            terms with qualified pilots and enterprise customers.
          </p>
        </div>
      </footer>

      {/* Toast notifications */}
      {copiedEmail && <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">Email copied! ✉️</div>}
      {copiedFullSnippet && <div className="fixed bottom-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">Command copied! 🚀</div>}
      {copyError && <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-4 py-2 rounded-lg shadow-lg border border-red-700 animate-slide-up">{copyError}</div>}
    </div>
  );
}

// ============================================================================
// Sub‑components
// ============================================================================

/**
 * Collapsible feature card.
 *
 * Displays an icon, title, short description, and an expandable details section.
 */
function FeatureCard({
  title,
  description,
  icon: Icon,
  color,
  details,
}: {
  title: string;
  description: string;
  icon: ElementType;
  color: string;
  details: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = `feature-details-${title.replace(/\s/g, '-')}`;
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
  };
  return (
    <div className="bg-gray-800/80 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition relative group">
      <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">
        <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center mb-2">{description}</p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto transition"
        aria-expanded={expanded}
        aria-controls={id}
      >
        {expanded ? 'Show less' : 'Details'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <div
        id={id}
        className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-sm text-gray-300 border-t border-gray-700 pt-4">{details}</p>
      </div>
    </div>
  );
}

/**
 * Demo card linking to an external demo or an internal page.
 */
function DemoCard({
  title,
  description,
  link,
  buttonText,
  external = false,
}: {
  title: string;
  description: ReactNode;
  link: string;
  buttonText: string;
  external?: boolean;
}) {
  const content = (
    <div className="bg-gray-800/80 p-6 rounded-lg border border-gray-700 h-full flex flex-col hover:border-blue-500 transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-400 mb-4 flex-1">{description}</div>
      <span className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-auto">
        {buttonText} <ArrowRight size={16} />
      </span>
    </div>
  );
  if (external) return <a href={link} target="_blank" className="block h-full" rel="noopener noreferrer">{content}</a>;
  return <Link href={link} className="block h-full">{content}</Link>;
}

/**
 * Repository card for the "Open Specs & Protected Core" section.
 *
 * Shows the repository name, a short description, and an access‑controlled badge
 * when the repository is private.
 */
function RepoCard({ name, desc, isPrivate = false }: { name: string; desc: string; isPrivate?: boolean }) {
  return (
    <div className={`bg-gray-800/80 p-4 rounded-lg border transition ${isPrivate ? 'border-gray-700 opacity-80 cursor-default' : 'border-gray-700 hover:border-blue-500 group'}`}>
      <div className="flex items-start justify-between">
        <h3 className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">{name}</h3>
        <div className="flex items-center gap-2 text-xs flex-shrink-0 ml-2">
          {isPrivate && (
            <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-400 flex items-center gap-1">
              <Shield size={10} /> Access‑controlled
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-1">{desc}</p>
      {isPrivate && (
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 mt-3 text-xs text-blue-400 hover:text-blue-300 transition font-medium"
        >
          Apply for pilot access <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

/**
 * Contact link with emoji, optional icon, and hover effects.
 */
function ContactLink({
  href,
  icon,
  text,
  emoji,
  onClick,
}: {
  href: string;
  icon?: ReactNode;
  text: string;
  emoji: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"

      onClick={onClick}
      className="group flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{emoji}</span>
      <span className="flex items-center gap-1 text-gray-300 group-hover:text-white">
        {icon}
        <span className="text-sm font-medium">{text}</span>
      </span>
    </a>
  );
}
