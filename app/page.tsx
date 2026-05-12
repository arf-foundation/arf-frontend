'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Github,
  Rocket,
  BookOpen,
  Users,
  Code,
  Cpu,
  Brain,
  Scale,
  Network,
  Mail,
  Linkedin,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Gauge,
  Star,
  Shield,
  Lock,
  FileText,
} from 'lucide-react';
import GitHubStars from '../components/GitHubStars';
// Changed from '../hooks/useInView' (root, no `once` support) to
// './hooks/useInView' (app-level, supports `once: true`).
// This prevents scroll animations from re-firing on scroll-up.
import { useInView } from './hooks/useInView';
import Mermaid from '../components/Mermaid';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RepoData {
  stargazers_count: number;
  language: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// System flow — abstract, enterprise‑safe.
const DIAGRAM = `flowchart TD
    subgraph Input["Input Sources"]
        S1[Infrastructure Signals]
        S2[Application Telemetry]
    end
    S1 --> Eval[Evaluation & Risk Assessment]
    S2 --> Eval
    Eval --> Policy[Policy Enforcement]
    Policy --> Decision{Action Decision}
    Decision -->|Approved| Execute[Controlled Execution]
    Decision -->|Denied| Alert[Alert & Audit Log]
    Decision -->|Escalated| Review[Human Review]`;

// Advisory API endpoint — not the protected engine.
const CURL_COMMAND = `curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/v1/incidents/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);
  const [copiedFullSnippet, setCopiedFullSnippet] = useState(false);

  // Live sandbox "Try it" state
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<Record<string, unknown> | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);
  const [copiedSandboxResponse, setCopiedSandboxResponse] = useState(false);


  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('juan@arf-ai.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };
  const handleCopyCodeSnippet = async () => {
    await navigator.clipboard.writeText(
      'curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/v1/incidents/evaluate'
    );
    setCopiedCodeSnippet(true);
    setTimeout(() => setCopiedCodeSnippet(false), 2000);
  };
  const handleCopyFullSnippet = async () => {
    await navigator.clipboard.writeText(CURL_COMMAND);
    setCopiedFullSnippet(true);
    setTimeout(() => setCopiedFullSnippet(false), 2000);
  };

  // Live sandbox fetch
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
      setSandboxResponse(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSandboxError(message);
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleCopySandboxResponse = async () => {
    if (!sandboxResponse) return;
    await navigator.clipboard.writeText(JSON.stringify(sandboxResponse, null, 2));
    setCopiedSandboxResponse(true);
    setTimeout(() => setCopiedSandboxResponse(false), 2000);
  };

  const trackSlackClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slack_invite_click', { event_category: 'engagement' });
    }
  };

  // `once: true` — animations fire once on entry, do not reset on scroll-up.
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.2, once: true });
  const { ref: ecosystemRef, inView: ecosystemInView } = useInView({ threshold: 0.2, once: true });
  const { ref: capabilitiesRef, inView: capabilitiesInView } = useInView({ threshold: 0.2, once: true });
  const { ref: demosRef, inView: demosInView } = useInView({ threshold: 0.2, once: true });
  const { ref: reposRef, inView: reposInView } = useInView({ threshold: 0.2, once: true });
  const { ref: footerRef, inView: footerInView } = useInView({ threshold: 0.1, once: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className={`container mx-auto px-4 py-20 text-center transition-opacity duration-1000 ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Stop guessing.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Govern every AI decision.
            </span>
          </h1>
          <GitHubStars />
        </div>

        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          ARF is an{' '}
          <strong>access‑controlled governance layer</strong> that makes AI decisions
          deterministic, auditable, and mechanically enforced — built for production environments
          where explainability and compliance are non‑negotiable.
        </p>

        {/* Factual pilot availability — not artificial scarcity */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-8 max-w-md mx-auto">
          <p className="text-blue-300 text-sm">
            🔐 Pilot access is invitation‑based. Applications are reviewed by the founder and
            matched to qualified use cases.
          </p>
        </div>

        {/* CTA hierarchy: pilot access primary, spec secondary */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-lg"
          >
            Request Pilot Access <ArrowRight size={18} />
          </Link>
          <a
            href="https://arf-foundation.github.io/arf-spec/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            View Technical Spec <ArrowRight size={18} />
          </a>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          ⚡ Sandbox returns mock advisory responses (status: &quot;success&quot;). Real enforcement and
          audit trails require a pilot agreement.
        </p>
      </section>

      {/* ── Community ───────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <a
              href="https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg"
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
            <Github size={18} /> GitHub
          </a>
        </div>
      </div>

      {/* ── Problem / Solution / Outcome ────────────────────────────────────── */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-red-400 font-bold text-xl mb-2">⚠️ Problem</div>
              <p className="text-gray-300">
                AI agents fail silently in production, creating untraceable, unauditable decisions
                that expose the organisation to operational risk and compliance gaps.
              </p>
            </div>
            <div>
              <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
              <p className="text-gray-300">
                ARF wraps AI outputs in a deterministic governance layer that evaluates,
                constrains, and logs every decision using structured risk assessment and
                flexible rule configuration.
              </p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
              <p className="text-gray-300">
                Auditable AI operations with mechanical enforcement, calibrated confidence
                levels, and decision trails that hold up under regulatory and post‑incident
                scrutiny.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── How ARF Works ──────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">How ARF Works</h2>
          <figure>
            <Mermaid chart={DIAGRAM} className="overflow-x-auto flex justify-center" />
            <figcaption className="sr-only">
              Infrastructure signals and telemetry enter an evaluation layer that assesses risk.
              A policy layer determines the appropriate action, resulting in a controlled
              execution, an alert with audit log, or human review.
            </figcaption>
          </figure>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Signals → Structured Evaluation → Policy‑Enforced Decision
          </p>
        </div>
      </div>

      {/* ── Key Capabilities ───────────────────────────────────────────────── */}
      <section
        ref={capabilitiesRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          capabilitiesInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Key Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Calibrated Risk Assessment"
            description="Continuously adapts to observed outcomes, blending immediate feedback with long‑term patterns."
            icon={<Brain className="w-8 h-8 text-blue-400" />}
            details="The system maintains a dynamic view of operational risk, combining real‑time learning with deeper historical analysis. The result is a single, calibrated confidence indicator that evolves with your environment."
          />
          <FeatureCard
            title="Operational Context Recall"
            description="Instantly surfaces relevant past incidents to inform current decisions."
            icon={<Network className="w-8 h-8 text-green-400" />}
            details="A living record of previous events and their resolutions allows the system to identify comparable situations and recommend actions based on what worked in similar contexts."
          />
          <FeatureCard
            title="Optimized Decision Logic"
            description="Selects the safest effective action by weighing trade‑offs, not by fixed thresholds."
            icon={<Scale className="w-8 h-8 text-yellow-400" />}
            details="Every possible action—approve, deny, or escalate—is evaluated through a structured cost‑benefit model that considers operational impact, recovery speed, and current confidence. The chosen action comes with a full, auditable justification."
          />
          <FeatureCard
            title="Coordinated System Analysis"
            description="Detects anomalies, traces root causes, and forecasts future reliability — all within a unified governance loop."
            icon={<Cpu className="w-8 h-8 text-purple-400" />}
            details="Multiple analysis modules work in concert to scan for early warnings, diagnose underlying issues, and project future health. Their outputs are consolidated to produce consistent, policy‑aligned recommendations."
          />
        </div>
      </section>

      {/* ── Why Enterprise ──────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Built for enterprise governance requirements
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <FileText className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Tamper‑proof audit trail</h3>
            <p className="text-gray-400">
              Every decision is recorded, timestamped, and attributed. The resulting logs are
              designed for regulatory review, post‑incident forensics, and compliance preparation.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Lock className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Deterministic enforcement</h3>
            <p className="text-gray-400">
              Policy gates cannot be bypassed or silently degraded. Any override is logged,
              ensuring that enforcement is mechanical, not advisory.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Brain className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Transparent reasoning</h3>
            <p className="text-gray-400">
              Every risk score is explainable through auditable, transparent reasoning — not a
              black‑box prediction. Suitable for executive reporting, advisor repackaging, and
              regulator briefings.
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
      </section>

      {/* ── Access Models ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-1 text-center">Access models</h3>
          <p className="text-sm text-gray-400 text-center mb-6">
            All pricing is outcome‑based. Pilot access is time‑limited and free for qualified
            organisations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Sandbox</div>
              <div className="text-gray-400 text-sm mt-1">Advisory only</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ 1,000 advisory evaluations/month</li>
                <li>✓ Mock responses — not the production engine</li>
                <li>✓ Community support</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Pilot</div>
              <div className="text-gray-400 text-sm mt-1">Time‑limited · Free</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Protected core engine access</li>
                <li>✓ Outcome‑based pricing post‑pilot</li>
                <li>✓ Founder‑led onboarding</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Enterprise</div>
              <div className="text-gray-400 text-sm mt-1">Commercial · Custom</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Full enforcement + audit trails</li>
                <li>✓ SSO, multi‑tenancy, SLA</li>
                <li>✓ Contact sales for pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Try the Advisory API ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-1">Try the Advisory API</h2>
          <p className="text-sm text-amber-400 mb-4">
            ⚠️ This endpoint returns mock responses. The protected core engine is not publicly
            accessible. All responses contain{' '}
            <code className="font-mono bg-gray-900 px-1 rounded">status: &quot;success&quot;</code> and are
            labelled as simulated in the justification.
          </p>

          <div className="flex flex-col gap-4">
            {/* Curl command with copy */}
            <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
              <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">
                {CURL_COMMAND}
              </pre>
              <button
                onClick={handleCopyFullSnippet}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex-shrink-0"
                aria-label="Copy full curl command"
              >
                {copiedFullSnippet ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>

            {/* Live Try-It button */}
            <button
              onClick={fetchSandboxResponse}
              disabled={sandboxLoading}
              className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {sandboxLoading ? (
                <>
                  <span className="animate-spin">⏳</span> Evaluating...
                </>
              ) : (
                <>
                  <Rocket size={16} /> Try it live
                </>
              )}
            </button>

            {/* Response display */}
            {sandboxResponse && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-gray-400">
                    Live sandbox response (mock)
                  </span>
                  <button
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

            {sandboxError && (
              <p className="text-sm text-red-400">
                Failed to reach sandbox: {sandboxError}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-4">
            The response includes a recommendation, a mock risk indicator, and a justification that
            clearly states the evaluation is simulated. Mechanical enforcement requires a pilot
            agreement and access to the protected control plane.
          </p>
        </div>
      </div>

      {/* ── Ecosystem Overview ──────────────────────────────────────────────── */}
      <section
        ref={ecosystemRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          ecosystemInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Ecosystem Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <EcoCard
            icon={<Rocket className="w-6 h-6 text-blue-400" />}
            title="Research"
            description="Foundational work in reliability engineering"
            details="Ongoing investigation into methods for validating AI‑generated outputs and quantifying uncertainty. This research anchors the framework’s approach to calibration and risk estimation."
          />
          <EcoCard
            icon={<Code className="w-6 h-6 text-green-400" />}
            title="Public Specification"
            description="Open standards for transparency"
            details="The arf‑spec repository defines the canonical data models, API contracts, and decision rules. Licensed under Apache 2.0, it provides full transparency without exposing proprietary implementation details."
          />
          <EcoCard
            icon={<Users className="w-6 h-6 text-yellow-400" />}
            title="Control Layer"
            description="Access‑controlled governance API"
            details="The protected control layer exposes governed endpoints for evaluation, audit queries, and quota management. The public sandbox returns only advisory mock responses."
          />
          <EcoCard
            icon={<BookOpen className="w-6 h-6 text-purple-400" />}
            title="Management Interface"
            description="Visual dashboards for governance insights"
            details="An interactive interface built with modern web technologies. Public demos show only mock data; connected instances provide real‑time visibility into decisions and system health."
          />
          <EcoCard
            icon={<Shield className="w-6 h-6 text-orange-400" />}
            title="Enterprise Extension"
            description="Enforcement, audit, and commercial support"
            details="Adds mechanical enforcement with real‑world integrations, tamper‑proof logs, multi‑tenancy, and outcome‑based commercial terms. Available under a commercial license to qualified organizations."
          />
        </div>
      </section>

      {/* ── Live Demos ──────────────────────────────────────────────────────── */}
      <section
        ref={demosRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          demosInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Live Demos</h2>
        <p className="text-gray-400 text-center text-sm mb-10">
          All demos use mock or advisory data. The protected core engine is not publicly accessible.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          <DemoCard
            title="Risk Dashboard"
            description="Interactive risk visualisation (mock data)"
            link="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            buttonText="Launch"
            icon={<Rocket size={16} />}
            external
          />
          <DemoCard
            title="Advisory API"
            description={
              <div className="flex items-center gap-2">
                <pre className="bg-gray-900 p-2 rounded text-sm font-mono text-green-300 whitespace-pre-wrap break-all flex-1">
                  curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/v1/incidents/evaluate
                </pre>
                <button
                  onClick={handleCopyCodeSnippet}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition group flex-shrink-0"
                  aria-label="Copy API snippet"
                >
                  {copiedCodeSnippet ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  )}
                </button>
              </div>
            }
            link="https://a-r-f-agentic-reliability-framework-api.hf.space/docs"
            buttonText="Try API"
            icon={<Code size={16} />}
            external
          />
          <DemoCard
            title="Governance Dashboard"
            description="Advisory visualisation connected to the public sandbox"
            link="/dashboard"
            buttonText="Go"
            icon={<Gauge size={16} />}
          />
          <DemoCard
            title="Reliable AI Systems Stack"
            description="Curated tools for AI reliability"
            link="https://huggingface.co/collections/petter2025/reliable-ai-systems-stack"
            buttonText="Explore"
            icon={<Star size={16} />}
            external
          />
        </div>
      </section>

      {/* ── Open Specs & Protected Core ──────────────────────────────────────── */}
      <section
        ref={reposRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          reposInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Open Specs &amp; Protected Core
        </h2>
        <p className="text-gray-400 text-center text-sm max-w-2xl mx-auto mb-10">
          The specification and demo UI are open source (Apache‑2.0). The core
          engine and API control plane are access‑controlled — available only to
          qualified pilots. This boundary preserves audit‑grade integrity while
          providing full transparency into APIs and decision rules.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RepoCard
            name="agentic_reliability_framework"
            desc="Protected core engine — calibrated risk assessment, operational context, governance loop."
            url="https://github.com/arf-foundation/agentic_reliability_framework"
            isPrivate
          />
          <RepoCard
            name="arf-api"
            desc="API control plane — governs access, enforces quotas, and logs every decision."
            url="https://github.com/arf-foundation/arf-api"
            isPrivate
          />
          <RepoCard
            name="enterprise"
            desc="Enterprise layer — tamper‑proof audit trails, SSO, and commercial SLAs."
            url="https://github.com/arf-foundation/enterprise"
            isPrivate
          />
          <RepoCard
            name="arf-spec"
            desc="Canonical specification — data models, API contracts, decision rules (Apache‑2.0)."
            url="https://github.com/arf-foundation/arf-spec"
          />
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
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
                  onClick={handleCopyEmail}
                  className="p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  )}
                </button>
              </div>
              <ContactLink
                href="https://www.linkedin.com/in/petterjuan/"
                icon={<Linkedin className="w-5 h-5" />}
                text="Juan Petter"
                emoji="🔗"
              />
              <ContactLink
                href="https://calendly.com/petter2025us/30min"
                icon={<Calendar className="w-5 h-5" />}
                text="Book a Call"
                emoji="📅"
              />
              <ContactLink
                href="https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg"
                icon={<MessageSquare className="w-5 h-5" />}
                text="Join Slack"
                emoji="💬"
                onClick={trackSlackClick}
              />
            </div>
          </div>

          {/* Pilot access CTA — replaces non-functional newsletter form */}
          <div className="mb-8 max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-white mb-2">Request Pilot Access</h4>
            <p className="text-sm text-gray-400 mb-4">
              The core ARF engine is available to qualified pilots under a time‑limited,
              outcome‑based evaluation. Email us with your organisation, use case, and expected
              evaluation volume.
            </p>
            <a
              href="mailto:juan@arf-ai.com?subject=ARF%20Pilot%20Access%20Request"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Mail className="w-4 h-4" /> Apply for Pilot Access
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/pricing" className="hover:text-white transition">
              Access Models
            </Link>
            <Link href="/signup" className="hover:text-white transition">
              Request Access
            </Link>
            <a
              href="https://github.com/arf-foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Github size={18} /> GitHub
            </a>
            <a
              href="https://huggingface.co/A-R-F"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              🤗 Hugging Face
            </a>
            <a
              href="https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackSlackClick}
              className="hover:text-white transition flex items-center gap-1"
            >
              <MessageSquare size={18} /> Slack
            </a>
          </div>

          {/* Corrected copyright: specifies which assets are Apache 2.0 */}
          <p className="text-sm">
            © 2026 ARF Foundation. Public repositories (arf‑spec, arf‑frontend) are licensed
            under{' '}
            <a
              href="https://github.com/arf-foundation/arf-spec/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              Apache 2.0
            </a>
            . The core engine is proprietary and access‑controlled.
          </p>
        </div>
      </footer>

      {/* ── Toast Notifications ───────────────────────────────────────────── */}
      {copiedEmail && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Email copied! ✉️
        </div>
      )}
      {copiedCodeSnippet && (
        <div className="fixed bottom-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Code copied! 📋
        </div>
      )}
      {copiedFullSnippet && (
        <div className="fixed bottom-36 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Command copied! 🚀
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EcoCard({
  icon,
  title,
  description,
  details,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition group relative">
      <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto transition"
      >
        {expanded ? 'Show less' : 'Details'}
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-xs text-gray-300 border-t border-gray-700 pt-2">{details}</p>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  details,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition relative group">
      <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center mb-2">{description}</p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto transition"
      >
        {expanded ? 'Show less' : 'Details'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-300 border-t border-gray-700 pt-4">{details}</p>
      </div>
    </div>
  );
}

function DemoCard({
  title,
  description,
  link,
  buttonText,
  icon = <ArrowRight size={16} />,
  external = false,
}: {
  title: string;
  description: React.ReactNode;
  link: string;
  buttonText: string;
  icon?: React.ReactNode;
  external?: boolean;
}) {
  const content = (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-400 mb-4 flex-1">{description}</div>
      <span className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-auto">
        {buttonText} {icon}
      </span>
    </div>
  );
  if (external) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }
  return (
    <Link href={link} className="block h-full">
      {content}
    </Link>
  );
}

function RepoCard({
  name,
  desc,
  url,
  isPrivate = false,
}: {
  name: string;
  desc: string;
  url: string;
  isPrivate?: boolean;
}) {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const repoName = url.split('/').pop();

  useEffect(() => {
    // Skip GitHub API fetch for private repos — they won't return public data.
    if (isPrivate || !repoName) return;

    const fetchRepoData = async () => {
      try {
        const cacheKey = `github-${repoName}`;
        let cached: string | null = null;
        let cachedTime: string | null = null;
        const now = Date.now();

        // localStorage may be unavailable in private browsing or some embed contexts.
        try {
          cached = localStorage.getItem(cacheKey);
          cachedTime = localStorage.getItem(`${cacheKey}-time`);
        } catch {
          // localStorage unavailable — proceed without cache.
        }

        if (cached && cachedTime && now - parseInt(cachedTime) < 3_600_000) {
          setRepoData(JSON.parse(cached));
          return;
        }

        const response = await fetch(
          `https://api.github.com/repos/arf-foundation/${repoName}`
        );
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        const data = await response.json();

        if (data.stargazers_count !== undefined) {
          const newData: RepoData = {
            stargazers_count: data.stargazers_count,
            language: data.language ?? null,
          };
          setRepoData(newData);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(newData));
            localStorage.setItem(`${cacheKey}-time`, String(now));
          } catch {
            // localStorage write failed — safe to ignore.
          }
        }
      } catch (err) {
        console.error(`Failed to fetch GitHub data for ${repoName}:`, err);
      }
    };

    fetchRepoData();
  }, [repoName, isPrivate]);

  // Private repos render without a link — navigating to a private GitHub repo
  // produces a confusing 404 wall for non-members.
  const cardContent = (
    <div
      className={`bg-gray-800 p-4 rounded-lg border transition ${
        isPrivate
          ? 'border-gray-700 opacity-70 cursor-default'
          : 'border-gray-700 hover:border-blue-500 group'
      }`}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 text-xs flex-shrink-0 ml-2">
          {isPrivate ? (
            <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-400 flex items-center gap-1">
              <Shield size={10} /> Access‑controlled
            </span>
          ) : repoData ? (
            <>
              {repoData.language && (
                <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                  {repoData.language}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-yellow-400">
                <Star size={12} className="fill-yellow-400" />
                {repoData.stargazers_count.toLocaleString()}
              </span>
            </>
          ) : null}
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

  if (isPrivate) return cardContent;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      {cardContent}
    </a>
  );
}

function ContactLink({
  href,
  icon,
  text,
  emoji,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  emoji: string;
  onClick?: () => void;
}) {
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
