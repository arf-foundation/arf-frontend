'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, type ReactNode, type ElementType } from 'react';
import {
  ArrowRight,
  Rocket,
  Cpu,
  Brain,
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
  Building2,
  HeartPulse,
  Landmark,
  Factory,
  Globe,
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

const DIAGRAM = `flowchart LR
    A[Application] --> B[LLM / AI Agent]
    B --> C[ARF Control Plane]
    C --> D[Policies]
    D --> E[Risk Engine]
    E --> F[Approval]
    F --> G[Execution]
    G --> H[Audit Trail]`;

const CURL_COMMAND = `curl -X POST https://a-r-f-arf-sandbox-api.hf.space/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

const CAPABILITIES = [
  {
    title: 'Policy Enforcement',
    description: 'Deterministic policy gates that cannot be bypassed.',
    icon: Shield,
    color: 'green',
    items: [
      'Deterministic execution gates',
      'Approval workflows',
      'Regional policy controls',
      'Cost guardrails',
    ],
  },
  {
    title: 'Decision Governance',
    description: 'Tamper‑evident records with cryptographic signing.',
    icon: FileText,
    color: 'blue',
    items: [
      'Full audit trail',
      'Cryptographic attestation',
      'Attribution & accountability',
      'Regulatory‑ready logs',
    ],
  },
  {
    title: 'Continuous Reliability',
    description: 'Proactive monitoring, predictive foresight, and automated recovery.',
    icon: Cpu,
    color: 'yellow',
    items: [
      'Anomaly detection',
      'Predictive health scoring',
      'Control‑theoretic stability monitoring',
      'Self‑stabilising responses',
    ],
  },
  {
    title: 'Operational Transparency',
    description: 'Explainable risk scoring, causal reasoning, and real‑time observability.',
    icon: Network,
    color: 'purple',
    items: [
      'Explainable risk scores – never a black box',
      'Counterfactual what‑if analysis',
      'Real‑time dashboards',
      'Causal attribution',
    ],
  },
];

const DEMOS = [
  {
    title: 'Risk Simulation',
    description: 'Interactive visualisation of risk scenarios (mock data)',
    link: 'https://arf-foundation.github.io/arf-risk-demo/',
    buttonText: 'Launch',
    external: true,
  },
  {
    title: 'Evaluation API',
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
    title: 'Governance Console',
    description: 'Live view of advisory decisions connected to the public sandbox',
    link: '/dashboard',
    buttonText: 'Open',
    external: false,
  },
  {
    title: 'Reliable AI Stack',
    description: 'Curated tools and reference architectures for AI reliability',
    link: 'https://huggingface.co/collections/petter2025/reliable-ai-systems-stack',
    buttonText: 'Explore',
    external: true,
  },
];

const TRUST_BADGES = [
  { label: 'Architected for SOC2 readiness', color: 'green' },
  { label: 'Security‑first operational design', color: 'blue' },
  { label: 'Supports privacy‑conscious deployments', color: 'purple' },
];

const REPOS = [
  {
    name: 'Core Governance Engine',
    desc: 'Protected core engine – real‑time risk calibration, historical memory, deterministic governance.',
    isPrivate: true,
  },
  {
    name: 'API Control Plane',
    desc: 'API control plane – governs access, enforces quotas, and logs every decision.',
    isPrivate: true,
  },
  {
    name: 'Enterprise Layer',
    desc: 'Enterprise layer – tamper‑proof audit trails, SSO, and commercial SLAs.',
    isPrivate: true,
  },
  {
    name: 'Enterprise Specification',
    desc: 'Full technical specification, data models, and API contracts (shared under written terms).',
    isPrivate: true,
  },
];

const INDUSTRIES = [
  { name: 'Financial Services', icon: Building2 },
  { name: 'Healthcare', icon: HeartPulse },
  { name: 'Government & Defence', icon: Landmark },
  { name: 'Critical Infrastructure', icon: Factory },
  { name: 'Enterprise AI Platforms', icon: Globe },
];

const BADGE_ICON_CLASSES: Record<string, string> = {
  green: 'text-green-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
};

// ============================================================================
// Main component
// ============================================================================

export default function LandingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedFullSnippet, setCopiedFullSnippet] = useState(false);
  const [copiedSandboxResponse, setCopiedSandboxResponse] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<Record<string, unknown> | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    const timeoutRefsCurrent = timeoutRefs.current;
    return () => {
      isMounted.current = false;
      Object.values(timeoutRefsCurrent).forEach(clearTimeout);
    };
  }, []);

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

  const handleCopyEmail = () => handleCopy('juan@arf-ai.com', 'email');
  const handleCopyFullSnippet = () => handleCopy(CURL_COMMAND, 'fullSnippet', 'curl command');
  const handleCopySandboxResponse = () => {
    if (sandboxResponse) handleCopy(JSON.stringify(sandboxResponse, null, 2), 'sandboxResponse', 'API response');
  };

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

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.2, once: true });
  const { ref: problemRef, inView: problemInView } = useInView({ threshold: 0.2, once: true });
  const { ref: whyRef, inView: whyInView } = useInView({ threshold: 0.2, once: true });
  const { ref: whyNowRef, inView: whyNowInView } = useInView({ threshold: 0.2, once: true });
  const { ref: whoRef, inView: whoInView } = useInView({ threshold: 0.2, once: true });
  const { ref: capabilitiesRef, inView: capabilitiesInView } = useInView({ threshold: 0.2, once: true });
  const { ref: trustRef, inView: trustInView } = useInView({ threshold: 0.2, once: true });
  const { ref: demosRef, inView: demosInView } = useInView({ threshold: 0.2, once: true });
  const { ref: reposRef, inView: reposInView } = useInView({ threshold: 0.2, once: true });
  const { ref: footerRef, inView: footerInView } = useInView({ threshold: 0.1, once: true });

  return (
    <div className="min-h-screen text-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className={`container mx-auto px-4 py-20 text-center transition-opacity duration-1000 ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Enterprise Infrastructure for Autonomous AI
            </span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Safely deploy autonomous AI in production with deterministic governance, continuous reliability, and enterprise‑grade auditability.
        </p>

        <p className="text-gray-300 max-w-2xl mx-auto mb-6">
          <strong>ARF AI is not an AI model.</strong> It is the infrastructure layer that governs autonomous AI systems – enforcing policy, managing risk, and providing irrefutable operational records.
        </p>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-8 max-w-md mx-auto">
          <p className="text-blue-300 text-sm">
            Pilot programs are offered to qualified organizations where ARF is a strong fit. Every application is personally reviewed by the founder.
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
            rel="noopener noreferrer"
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            View business briefing <ArrowRight size={18} />
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-700"
              >
                <Shield className={`w-4 h-4 ${BADGE_ICON_CLASSES[badge.color]}`} /> {badge.label}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Designed for regulated environments – audit trails, SSO, and deterministic
            enforcement available in pilot.
          </p>
        </div>

        <p className="text-gray-400 text-sm mt-4">
          ⚡ The public sandbox returns only simulated responses. Real enforcement and
          confidence guarantees require a pilot agreement.
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
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition"
              onClick={trackSlackClick}
            >
              Join our Slack community
            </a>
          </div>
          <a
            href="https://github.com/arf-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Problem / Solution / Outcome */}
      <section
        ref={problemRef}
        className={`container mx-auto px-4 mb-16 transition-opacity duration-1000 ${
          problemInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-red-400 font-bold text-xl mb-2">⚠️ Problem</div>
              <p className="text-gray-300">
                AI agents make autonomous decisions that are difficult to govern, audit, and control.
              </p>
            </div>
            <div>
              <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
              <p className="text-gray-300">
                ARF applies deterministic policy enforcement before every autonomous action.
              </p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
              <p className="text-gray-300">
                Every decision becomes explainable, auditable, and operationally trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why ARF? */}
      <section
        ref={whyRef}
        className={`container mx-auto px-4 mb-16 transition-opacity duration-1000 ${
          whyInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Why ARF?</h2>
          <div className="max-w-3xl mx-auto text-center text-gray-300 space-y-4">
            <p className="text-lg font-semibold">
              Foundation models are probabilistic. Enterprise operations require deterministic control. ARF bridges that gap.
            </p>
            <p>
              Autonomous AI promises unprecedented speed and scale, but without governance it introduces unacceptable operational risk. ARF provides the missing control plane – translating probabilistic model outputs into verifiable, auditable actions that align with your business policies.
            </p>
          </div>
        </div>
      </section>

      {/* Why Now? */}
      <section
        ref={whyNowRef}
        className={`container mx-auto px-4 mb-16 transition-opacity duration-1000 ${
          whyNowInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Why Now?</h2>
          <div className="max-w-3xl mx-auto text-center text-gray-300 space-y-4">
            <p className="text-lg">
              Autonomous AI is moving from copilots to autonomous workflows. As AI gains the ability to act – not just recommend – organizations need infrastructure that governs execution, manages operational risk, and provides auditability by design.
            </p>
            <p>
              ARF AI delivers that control plane. Built for the era where AI doesn't just answer questions – it deploys code, modifies infrastructure, and makes decisions that affect business outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Who It’s For */}
      <section
        ref={whoRef}
        className={`container mx-auto px-4 mb-16 transition-opacity duration-1000 ${
          whoInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Built for Regulated Enterprises</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-items-center">
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="flex flex-col items-center gap-2 text-gray-300">
                <ind.icon className="w-8 h-8 text-blue-400" />
                <span className="text-sm font-medium">{ind.name}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            ARF is designed for environments where compliance, safety, and accountability are non‑negotiable.
          </p>
        </div>
      </section>

      {/* How ARF Works */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-center">How ARF Works</h2>
          <figure>
            <Mermaid chart={DIAGRAM} className="overflow-x-auto flex justify-center" />
            <figcaption className="sr-only">
              Application → LLM → ARF Control Plane → Policies → Risk Engine → Approval → Execution → Audit Trail
            </figcaption>
          </figure>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Application → LLM → ARF Control Plane → Policies → Risk Engine → Approval → Execution → Audit Trail
          </p>
        </div>
      </div>

      {/* Enterprise Capabilities */}
      <section
        ref={capabilitiesRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          capabilitiesInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Enterprise Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CAPABILITIES.map((cap, idx) => (
              <CapabilityCard key={idx} {...cap} />
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Governance */}
      <section
        ref={trustRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          trustInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Enterprise‑Grade Governance
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
            ARF uses a hybrid pricing model: a fixed deployment fee, plus either outcome‑based pricing or a monthly retainer.
            Pilot access is time‑limited and free for qualified organizations — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Sandbox</div>
              <div className="text-gray-400 text-sm mt-1">Simulation Only</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ 1,000 evaluations/month</li>
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
              <div className="text-gray-400 text-sm mt-1">Commercial · Custom</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Custom deployment fee</li>
                <li>✓ Outcome‑based or retainer maintenance</li>
                <li>✓ SSO, multi‑tenancy, SLA</li>
                <li>✓ Full enforcement + audit trails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Try the Evaluation API */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-1">Try the Evaluation API</h2>
          <p className="text-xs text-gray-500 mb-4">
            This endpoint returns simulated responses. Real enforcement requires a pilot agreement.
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
                  <span className="text-xs font-mono text-gray-400">Live sandbox response (simulated)</span>
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
        </div>
      </div>

      {/* Interactive Demonstrations */}
      <section
        ref={demosRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          demosInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Interactive Demonstrations</h2>
          <p className="text-gray-400 text-center text-sm mb-10">
            Explore ARF capabilities through simulated data and the public sandbox.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {DEMOS.map((demo, idx) => (
              <DemoCard key={idx} {...demo} />
            ))}
          </div>
        </div>
      </section>

      {/* Documentation & Technical Specifications */}
      <section
        ref={reposRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          reposInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Documentation &amp; Technical Specifications</h2>
          <p className="text-gray-400 text-center text-sm max-w-3xl mx-auto mb-6">
            Public documentation outlines ARF's capabilities and integration patterns.
            Full technical specifications (data models, API contracts, decision rules) are shared
            with qualified pilots under written terms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPOS.map((repo) => (
              <RepoCard key={repo.name} {...repo} />
            ))}
          </div>
          <p className="text-gray-400 text-center text-xs mt-6">
            <Link href="/signup" className="text-blue-400 hover:underline">Request pilot access</Link> to receive full specifications.
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
                  href="mailto:juan@arf-ai.com"
                  icon={<Mail className="w-5 h-5" />}
                  text="juan@arf-ai.com"
                  emoji="📬"
                />
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />}
                </button>
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
              href="mailto:juan@arf-ai.com?subject=ARF%20Pilot%20Access%20Request"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Mail className="w-4 h-4" /> Apply for Pilot Access
            </a>
          </div>

          <div className="flex justify-center items-center gap-8 mb-8">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src="/ARF - Transparent Primary Logo.png"
                alt="ARF AI"
                width={140}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <a
              href="https://github.com/enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/GitHub_Lockup_White.svg"
                alt="GitHub Enterprise"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/pricing" className="hover:text-white transition">Access Models</Link>
            <Link href="/signup" className="hover:text-white transition">Request Access</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <a href="https://github.com/arf-foundation" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">GitHub</a>
            <a href="https://huggingface.co/ARF-AI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">🤗 Hugging Face</a>
            <a href="https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg" target="_blank" rel="noopener noreferrer" onClick={trackSlackClick} className="hover:text-white transition flex items-center gap-1"><MessageSquare size={18} /> Slack</a>
            <a href="https://www.linkedin.com/company/agentic-reliability" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">LinkedIn</a>
          </div>

          <p className="text-sm">
            © 2026 ARF Foundation. All rights reserved.
          </p>
        </div>
      </footer>

      {copiedEmail && <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">Email copied! ✉️</div>}
      {copiedFullSnippet && <div className="fixed bottom-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">Command copied! 🚀</div>}
      {copyError && <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-4 py-2 rounded-lg shadow-lg border border-red-700 animate-slide-up">{copyError}</div>}
    </div>
  );
}

// ============================================================================
// Sub‑components
// ============================================================================

function CapabilityCard({ title, description, icon: Icon, color, items }: {
  title: string;
  description: string;
  icon: ElementType;
  color: string;
  items: string[];
}) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
  };
  return (
    <div className="bg-gray-800/80 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition">
      <div className="mb-4 flex justify-center">
        <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center mb-4">{description}</p>
      <ul className="space-y-2 text-sm text-gray-300">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DemoCard({ title, description, link, buttonText, external = false }: { title: string; description: ReactNode; link: string; buttonText: string; external?: boolean }) {
  const content = (
    <div className="bg-gray-800/80 p-6 rounded-lg border border-gray-700 h-full flex flex-col hover:border-blue-500 transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-400 mb-4 flex-1">{description}</div>
      <span className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-auto">
        {buttonText} <ArrowRight size={16} />
      </span>
    </div>
  );
  if (external) return <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>;
  return <Link href={link} className="block h-full">{content}</Link>;
}

function RepoCard({ name, desc, isPrivate = false }: { name: string; desc: string; isPrivate?: boolean }) {
  return (
    <div className={`bg-gray-800/80 p-4 rounded-lg border transition ${isPrivate ? 'border-gray-700 opacity-80 cursor-default' : 'border-gray-700 hover:border-blue-500 group'}`}>
      <div className="flex items-start justify-between">
        <h3 className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">{name}</h3>
        <div className="flex items-center gap-2 text-xs flex-shrink-0 ml-2">
          {isPrivate && (
            <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-400 flex items-center gap-1">
              <Shield size={10} /> Pilot‑only
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

function ContactLink({ href, icon, text, emoji, onClick }: { href: string; icon?: ReactNode; text: string; emoji: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
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
