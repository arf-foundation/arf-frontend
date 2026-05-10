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
import { useInView } from './hooks/useInView';
import Mermaid from '../components/Mermaid';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RepoData {
  stargazers_count: number;
  language: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DIAGRAM = `flowchart TD
    subgraph Input["🔌 Input Sources"]
        Services[Agents / Services]
        Metrics[Metrics / Logs]
    end
    Services --> Signals[Observability Signals]
    Metrics --> Signals
    Signals --> Interpreter[ARF Reliability Interpreter]
    subgraph Engine["⚙️ ARF Core Engine"]
        Interpreter --> Risk[Bayesian Risk Fusion]
        Risk --> Loss[Expected Loss Minimisation]
        Loss --> Decision{Approve / Deny / Escalate}
    end
    Decision -->|Approve| Action[Recovery Actions]
    Decision -->|Deny| Log[Log & Alert]
    Decision -->|Escalate| Human[Human Review]
    style Interpreter fill:#e1f5fe,stroke:#01579b
    style Risk fill:#fff3e0,stroke:#e65100
    style Loss fill:#e8f5e8,stroke:#1b5e20
    style Decision fill:#fce4ec,stroke:#b71c1c`;

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
  const trackSlackClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slack_invite_click', { event_category: 'engagement' });
    }
  };

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
          <strong>access-controlled governance layer</strong> that makes AI decisions
          deterministic, auditable, and mechanically enforced — built for production environments
          where explainability and compliance are non-negotiable.
        </p>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-8 max-w-md mx-auto">
          <p className="text-blue-300 text-sm">
            🔐 Pilot access is invitation-based. Applications are reviewed by the founder and
            matched to qualified use cases.
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
            href="https://arf-foundation.github.io/arf-spec/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            View Technical Spec <ArrowRight size={18} />
          </a>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          ⚡ Sandbox includes 1,000 advisory evaluations/month. Production enforcement requires a
          pilot agreement.
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
                AI agents fail silently in production, producing untraceable, unauditable decisions
                that create operational risk and compliance exposure.
              </p>
            </div>
            <div>
              <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
              <p className="text-gray-300">
                ARF wraps AI outputs in a deterministic governance layer that evaluates, constrains,
                and logs every decision using Bayesian risk modelling and composable policy rules.
              </p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
              <p className="text-gray-300">
                Auditable AI operations with mechanical enforcement, calibrated risk scores, and
                decision trails that hold up under regulatory and post-incident scrutiny.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── How ARF Works ──────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">How ARF Works</h2>
          <Mermaid chart={DIAGRAM} className="overflow-x-auto flex justify-center" />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Bayesian risk fusion → Expected loss minimisation → Approve / Deny / Escalate
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
            title="Bayesian Risk Scoring"
            description="Conjugate priors + hyperpriors + HMC for calibrated uncertainty."
            icon={<Brain className="w-8 h-8 text-blue-400" />}
            details="Uses conjugate Beta priors per action category for fast online updates, optional hierarchical hyperpriors for cross-category strength sharing, and an offline HMC logistic regression model sensitive to time-of-day, user role, and environment. The final risk score is a weighted blend determined by the volume of available historical data."
          />
          <FeatureCard
            title="Semantic Memory"
            description="FAISS‑based retrieval of similar past incidents."
            icon={<Network className="w-8 h-8 text-green-400" />}
            details="Stores incident embeddings in a FAISS index for fast similarity search. When a new incident arrives, ARF retrieves the most similar historical incidents and their resolved outcomes to inform current risk assessment. Enterprise deployments support advanced embedding backends and HNSW/IVF/PQ index types."
          />
          <FeatureCard
            title="Expected Loss Minimisation"
            description="Chooses approve / deny / escalate by minimising expected cost, not by fixed threshold."
            icon={<Scale className="w-8 h-8 text-yellow-400" />}
            details="Combines conjugate prior (online), hyperprior (hierarchical), and HMC (offline) into a weighted risk score. Selects the action that minimises expected loss across false-positive cost, blast radius, recovery speed, and epistemic uncertainty. Strictly more expressive than fixed probability thresholds, with a full audit trail for every decision."
          />
          <FeatureCard
            title="Multi‑Agent Orchestration"
            description="Anomaly detection, root cause analysis, and forecasting."
            icon={<Cpu className="w-8 h-8 text-purple-400" />}
            details="Coordinates specialised agents for anomaly detection, root cause analysis, and reliability forecasting. Each agent operates within the governance loop and produces HealingIntent recommendations subject to the same Bayesian risk evaluation and policy enforcement as all other actions."
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
            <h3 className="text-xl font-semibold mb-2">Tamper-proof audit trail</h3>
            <p className="text-gray-400">
              Cryptographic decision logs designed for regulatory review, post-incident forensics,
              and compliance preparation. Every action is attributed, timestamped, and queryable.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Lock className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Deterministic enforcement</h3>
            <p className="text-gray-400">
              Policy gates that cannot be bypassed or silently degraded. Every override is logged
              and attributed. Enforcement is mechanical, not advisory.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Brain className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">White-box methodology</h3>
            <p className="text-gray-400">
              Every risk score is explainable through Bayesian attribution — not a black-box
              prediction. Suitable for executive reporting, advisor repackaging, and regulator
              briefings.
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
            All pricing is outcome-based. Pilot access is time-limited and free for qualified
            organisations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Sandbox</div>
              <div className="text-gray-400 text-sm mt-1">Advisory only</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ 1,000 advisory evaluations/month</li>
                <li>✓ Mock responses — not production engine</li>
                <li>✓ Community support</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Pilot</div>
              <div className="text-gray-400 text-sm mt-1">Time-limited · Free</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Protected core engine access</li>
                <li>✓ Outcome-based pricing post-pilot</li>
                <li>✓ Founder-led onboarding</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Enterprise</div>
              <div className="text-gray-400 text-sm mt-1">Commercial · Custom</div>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 text-left">
                <li>✓ Full enforcement + audit trails</li>
                <li>✓ SSO, multi-tenancy, SLA</li>
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
            ⚠️ This endpoint returns advisory responses only. The protected core engine is not
            publicly accessible. The{' '}
            <code className="font-mono bg-gray-900 px-1 rounded">status</code> field in every
            response reads{' '}
            <code className="font-mono bg-gray-900 px-1 rounded">oss_advisory_only</code>.
          </p>
          <div className="flex flex-col gap-3">
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
            <p className="text-sm text-gray-400">
              Returns a <span className="font-mono">HealingIntent</span> with Bayesian-fused risk
              factors (conjugate / hyperprior / HMC) and an action recommendation based on expected
              loss minimisation. Mechanical enforcement of the recommended action requires pilot
              access to the protected control plane.
            </p>
          </div>
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
            description="Mathematical foundations of hybrid Bayesian inference"
            details="Published research on Bayesian methods for reliability engineering, including hallucination detection for RAG systems using entropy, evidence lift, and contradiction signals. Provides the formal grounding for ARF's risk scoring and calibration diagnostics."
          />
          <EcoCard
            icon={<Code className="w-6 h-6 text-green-400" />}
            title="Public Spec"
            description="Data models, API contracts, and decision rules"
            details="The arf-spec repository is the canonical public specification for ARF, licensed under Apache 2.0. It documents data models, API contracts, governance rules, and mathematical foundations. The protected core engine implements these contracts; the spec itself does not expose proprietary implementation details."
          />
          <EcoCard
            icon={<Users className="w-6 h-6 text-yellow-400" />}
            title="API Control Plane"
            description="FastAPI service exposing governed operations"
            details="The protected API control plane exposes access-controlled endpoints for governance evaluation, audit log queries, and quota management. The public sandbox returns advisory mock responses only. Production enforcement — with real action execution and audit logging — requires pilot or enterprise access."
          />
          <EcoCard
            icon={<BookOpen className="w-6 h-6 text-purple-400" />}
            title="Frontend UI"
            description="Next.js dashboard for visualising risk"
            details="Interactive dashboard built with Next.js and Tailwind CSS. All data shown in the public demo is mock or advisory. The dashboard connects to the protected control plane for pilot and enterprise customers, enabling real-time governance visualisation and decision inspection."
          />
          <EcoCard
            icon={<Shield className="w-6 h-6 text-orange-400" />}
            title="Enterprise"
            description="Enforcement, audit trails, and commercial SLAs"
            details="The enterprise layer adds mechanical enforcement with real cloud provider integrations, tamper-proof audit logs, multi-tenancy, SSO, and outcome-based commercial support. Available under a commercial license to qualified organisations. Contact us to discuss your use case."
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
            description="Interactive Bayesian risk visualisation (mock data)"
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
            description="Curated tools for AI reliability engineering"
            link="https://huggingface.co/collections/petter2025/reliable-ai-systems-stack"
            buttonText="Explore"
            icon={<Star size={16} />}
            external
          />
        </div>
      </section>

      {/* ── Repository Links ────────────────────────────────────────────────── */}
      <section
        ref={reposRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          reposInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Public Repositories</h2>
        <p className="text-gray-400 text-center text-sm mb-10">
          Private repositories (core engine, API control plane, enterprise) are not listed.
          Access is restricted to pilots and enterprise customers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RepoCard
            name="agentic_reliability_framework"
            desc="Protected core engine — pilot access only"
            url="https://github.com/arf-foundation/agentic_reliability_framework"
            isPrivate
          />
          <RepoCard
            name="arf-api"
            desc="API control plane — pilot access only"
            url="https://github.com/arf-foundation/arf-api"
            isPrivate
          />
          <RepoCard
            name="arf-frontend"
            desc="Public demo UI — Apache 2.0"
            url="https://github.com/arf-foundation/arf-frontend"
          />
          <RepoCard
            name="arf-spec"
            desc="Canonical specification — Apache 2.0"
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

          <div className="mb-8 max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-white mb-2">Request Pilot Access</h4>
            <p className="text-sm text-gray-400 mb-4">
              The core ARF engine is available to qualified pilots under a time-limited,
              outcome-based evaluation. Email us with your organisation, use case, and expected
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

          <p className="text-sm">
            © 2026 ARF Foundation. Public repositories (arf-spec, arf-frontend) are licensed
            under{' '}
            <a
              href="https://github.com/arf-foundation/arf-spec/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              Apache 2.0
            </a>
            . The core engine is proprietary and access-controlled.
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
    if (isPrivate || !repoName) return;

    const fetchRepoData = async () => {
      try {
        const cacheKey = `github-${repoName}`;
        let cached: string | null = null;
        let cachedTime: string | null = null;
        const now = Date.now();

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
              <Lock size={10} /> Pilot only
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
