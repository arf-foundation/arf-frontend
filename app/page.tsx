'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
  Send,
  ChevronDown,
  ChevronUp,
  Gauge,
  Star,
  Zap,
  Shield,
  BarChart
} from 'lucide-react';
import GitHubStars from '../components/GitHubStars';
import { useInView } from '../hooks/useInView';

// Lazy-load Mermaid with no SSR to reduce initial bundle size
const Mermaid = dynamic(() => import('../components/Mermaid'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-700 rounded-lg" />
});

// --- Types ---
interface RepoData {
  stargazers_count: number;
  language: string | null;
}

// Conceptual diagram – does not expose proprietary internals
const DIAGRAM = `flowchart TD
    subgraph Input["🔌 Input Sources"]
        Services[Agents / Services]
        Metrics[Metrics / Logs]
    end
    Services --> Signals[Observability Signals]
    Metrics --> Signals
    Signals --> Interpreter[ARF Reliability Interpreter]
    subgraph Engine["⚙️ ARF Core Engine (Access‑Controlled)"]
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

// Sandbox endpoint – not the real engine
const SANDBOX_CURL = `curl -X POST https://sandbox.arf.dev/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function LandingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSandboxSnippet, setCopiedSandboxSnippet] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // ✅ Fixed: useInView doesn't accept a generic, so cast the ref
  const { ref: diagramRefRaw, inView: isDiagramVisible } = useInView({ threshold: 0.1 });
  const diagramRef = diagramRefRaw as React.RefObject<HTMLDivElement>;

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('petter2025us@outlook.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopySandboxSnippet = async () => {
    await navigator.clipboard.writeText(SANDBOX_CURL);
    setCopiedSandboxSnippet(true);
    setTimeout(() => setCopiedSandboxSnippet(false), 2000);
  };

  const trackSlackClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slack_invite_click', { event_category: 'engagement' });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Newsletter subscription for:', email);
    setNewsletterStatus('success');
    setEmail('');
    setTimeout(() => setNewsletterStatus('idle'), 3000);
  };

  // Scroll animation hooks for other sections
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.2 });
  const { ref: ecosystemRef, inView: ecosystemInView } = useInView({ threshold: 0.2 });
  const { ref: capabilitiesRef, inView: capabilitiesInView } = useInView({ threshold: 0.2 });
  const { ref: demosRef, inView: demosInView } = useInView({ threshold: 0.2 });
  const { ref: reposRef, inView: reposInView } = useInView({ threshold: 0.2 });
  const { ref: footerRef, inView: footerInView } = useInView({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section ref={heroRef} className={`container mx-auto px-4 py-20 text-center transition-opacity duration-1000 ${heroInView ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Stop guessing. <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Audit every AI decision.</span>
          </h1>
          <GitHubStars />
        </div>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          ARF is a governance layer that turns probabilistic AI into <strong>deterministic, auditable action</strong> – reducing MTTR by up to 85%<span className="text-xs align-super">*</span> and ensuring compliance in regulated environments.
        </p>

        {/* Pilot scarcity banner */}
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-8 max-w-md mx-auto">
          <p className="text-yellow-300 text-sm">✈️ Pilot program – limited spots for 2026. Outcome‑based pricing.</p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-lg">
            Request Pilot Access →
          </Link>
          <a
            href="https://www.youtube.com/watch?v=KEL-a-qwZFg"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            Watch Demo Video <ArrowRight size={18} />
          </a>
        </div>
        <p className="text-gray-400 text-sm mt-4">🔐 Core engine is access‑controlled. Free trials available for qualified pilots only.</p>
      </section>

      {/* Social Proof – Trust & Authority */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="text-yellow-400 flex items-center gap-1">★★★★★ <span className="text-gray-400 ml-1">(Rated 5/5 by early pilots)</span></div>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <a href="https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
              Join our Slack
            </a>
          </div>
          <img src="/logos/placeholder.svg" alt="Trusted by companies" className="h-6 opacity-70" />
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">* MTTR reduction based on internal benchmarks with simulated incidents. Not a guarantee.</p>
      </div>

      {/* LinkedIn Embed – Social Proof (lazy-loaded) */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7436928497408880640?collapsed=1"
              height="877"
              width="504"
              frameBorder="0"
              allowFullScreen
              title="LinkedIn post – ARF access control agent"
              className="mx-auto w-full"
              style={{ maxWidth: '100%', height: 'auto', minHeight: '400px' }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Problem-Solution-Outcome Block */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-red-400 font-bold text-xl mb-2">⚠️ Problem</div>
              <p className="text-gray-300">AI systems fail silently, costing $10k+ per hour of downtime.*</p>
            </div>
            <div>
              <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
              <p className="text-gray-300">ARF turns probabilistic AI into deterministic, auditable action.</p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
              <p className="text-gray-300">Reduce MTTR by up to 85% – save millions in incident costs.*</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">* Estimates based on industry studies and ARF internal testing. Actual results may vary.</p>
        </div>
      </div>

      {/* How ARF Works (conceptual diagram) - lazy load when visible */}
      <div ref={diagramRef} className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">How ARF Works</h2>
          {isDiagramVisible && <Mermaid chart={DIAGRAM} className="overflow-x-auto flex justify-center" />}
          {!isDiagramVisible && <div className="h-64 animate-pulse bg-gray-700 rounded-lg" />}
          <p className="text-xs text-gray-500 mt-2 text-center">Bayesian risk fusion → Expected loss minimisation → Approve/Deny/Escalate</p>
        </div>
      </div>

      {/* Key Capabilities */}
      <section ref={capabilitiesRef} className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${capabilitiesInView ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Key Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Bayesian Risk Scoring"
            description="Conjugate priors + hyperpriors + HMC for calibrated uncertainty."
            icon={<Brain className="w-8 h-8 text-blue-400" />}
            details="Uses conjugate Beta priors per action category for fast online updates, optional hierarchical hyperpriors to share strength across categories, and an offline HMC logistic regression model that learns complex patterns (time of day, user role, environment). The final risk is a weighted average."
          />
          <FeatureCard
            title="Semantic Memory"
            description="FAISS‑based retrieval of similar past incidents."
            icon={<Network className="w-8 h-8 text-green-400" />}
            details="Stores incident embeddings in a FAISS index for fast similarity search. When a new incident occurs, ARF retrieves the most similar past incidents and their outcomes to inform the current risk assessment."
          />
          <FeatureCard
            title="Expected Loss Minimisation"
            description="Bayesian fusion + CVaR for approve/deny/escalate."
            icon={<Scale className="w-8 h-8 text-yellow-400" />}
            details="Combines conjugate priors (online), hyperpriors (hierarchical), and HMC (offline) into a weighted risk score. Chooses the action that minimises expected loss, optionally using Conditional Value at Risk (CVaR) to account for tail risk."
          />
          <FeatureCard
            title="Multi‑Agent Orchestration"
            description="Anomaly detection, root cause, forecasting."
            icon={<Cpu className="w-8 h-8 text-purple-400" />}
            details="Coordinates multiple agents to detect anomalies, find root causes, and forecast future reliability. Each agent specialises in a different aspect of the infrastructure, and they collaborate to form a comprehensive picture."
          />
        </div>
      </section>

      {/* Why Pilots Choose ARF Enterprise */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Why Pilots Choose ARF Enterprise</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Audit‑ready logs</h3>
            <p className="text-gray-400">Every decision recorded for compliance (SOC2, ISO).</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">99.9% uptime SLA</h3>
            <p className="text-gray-400">Guaranteed by our control plane.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <BarChart className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">24/7 priority support</h3>
            <p className="text-gray-400">With &lt; 15 min response time.</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/pricing" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition inline-flex items-center gap-2">
            View Access Models → <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Access Models */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-center">Access Models</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">Sandbox</div>
              <div className="text-gray-400">Free demo</div>
              <ul className="text-sm text-gray-300 mt-2">
                <li>✓ 100 evaluations/month</li>
                <li>✓ Sanitized API endpoint</li>
                <li>✓ No access to core engine</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">Pilot</div>
              <div className="text-gray-400">Time‑limited trial</div>
              <ul className="text-sm text-gray-300 mt-2">
                <li>✓ Full engine access</li>
                <li>✓ Audit logs & support</li>
                <li>✓ Subject to qualification</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">Enterprise</div>
              <div className="text-gray-400">Outcome‑based pricing</div>
              <ul className="text-sm text-gray-300 mt-2">
                <li>✓ Unlimited + SLA</li>
                <li>✓ Pay per risk reduction</li>
                <li>✓ Contact for quote</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            The core ARF engine is not open source. Pilot access requires a mutual agreement.
          </p>
        </div>
      </div>

      {/* Try the Sandbox API */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Try the Sandbox API</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
              <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">{SANDBOX_CURL}</pre>
              <button
                onClick={handleCopySandboxSnippet}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                aria-label="Copy sandbox command"
              >
                {copiedSandboxSnippet ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
              </button>
            </div>
            <p className="text-sm text-yellow-300">
              ⚠️ This is a <strong>sanitized demo endpoint</strong>. It does <strong>not</strong> use the protected Bayesian engine. For pilot access, <Link href="/signup" className="underline">request here</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Ecosystem Overview */}
      <section ref={ecosystemRef} className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${ecosystemInView ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Ecosystem Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <EcoCard
            icon={<Rocket className="w-6 h-6 text-blue-400" />}
            title="Research"
            description="Mathematical foundations of hybrid Bayesian inference"
            details="Published papers and collaborations with academic institutions on Bayesian methods for reliability engineering. Our research focuses on scalable inference for cloud infrastructure."
          />
          <EcoCard
            icon={<Code className="w-6 h-6 text-green-400" />}
            title="Protected Core Engine"
            description="Bayesian models, memory, governance loop"
            details="The heart of ARF – implements conjugate priors, HMC sampling, and semantic memory. **Access‑controlled** – available only to qualified pilots and enterprise customers."
          />
          <EcoCard
            icon={<Users className="w-6 h-6 text-yellow-400" />}
            title="API Control Plane"
            description="FastAPI service exposing the framework"
            details="Production‑ready REST API with automatic docs, rate limiting, and CORS. Serves as the bridge between the core engine and frontend applications. Access gated."
          />
          <EcoCard
            icon={<BookOpen className="w-6 h-6 text-purple-400" />}
            title="Frontend UI"
            description="Next.js dashboard for visualizing risk"
            details="Interactive dashboard built with Next.js and Tailwind CSS. Features real‑time risk charts, memory statistics, and the incident evaluation form you're using now. Publicly available as a demo."
          />
          <EcoCard
            icon={<Github className="w-6 h-6 text-orange-400" />}
            title="Enterprise"
            description="Advanced compliance, audit trails, and support"
            details="For organizations requiring SLAs, SSO, and advanced audit capabilities. Includes priority support and custom integrations. Access by contract only."
          />
        </div>
      </section>

      {/* Live Demos */}
      <section ref={demosRef} className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${demosInView ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Live Demos</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <DemoCard
            title="UI Concept Demo"
            description="Interactive risk dashboard (conceptual only)"
            link="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            buttonText="Launch"
            icon={<Rocket size={16} />}
            external
            disclaimer="Not connected to the actual engine"
          />
          <DemoCard
            title="Sandbox API"
            description="Try a sanitized endpoint"
            link="https://sandbox.arf.dev/docs"
            buttonText="Try API"
            icon={<Code size={16} />}
            external
            disclaimer="Rate‑limited, no real Bayesian inference"
          />
          <DemoCard
            title="Frontend Dashboard"
            description="Real‑time governance visuals (demo data)"
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
        <p className="text-center text-xs text-gray-500 mt-4">All demos use simulated or sanitized data and do not expose the protected core engine.</p>
      </section>

      {/* Repository Links */}
      <section ref={reposRef} className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${reposInView ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Public Repository Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <RepoCard name="arf-frontend" desc="Public dashboard UI (this site)" url="https://github.com/arf-foundation/arf-frontend" />
          <RepoCard name="arf-spec" desc="Canonical specification – data models, API contracts" url="https://github.com/arf-foundation/arf-spec" />
          <RepoCard name="pitch-deck" desc="Public overview and vision" url="https://github.com/arf-foundation/pitch-deck" />
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">The core engine and API control plane are private and access‑controlled. They are not listed here.</p>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className={`border-t border-gray-700 py-12 text-center text-gray-400 transition-opacity duration-1000 ${footerInView ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          {/* Contact Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Connect with Us</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <ContactLink
                  href="mailto:petter2025us@outlook.com"
                  icon={<Mail className="w-5 h-5" />}
                  text="petter2025us@outlook.com"
                  emoji="📬"
                />
                <button
                  onClick={handleCopyEmail}
                  className="p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />}
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

          {/* Newsletter Signup */}
          <div className="mb-8 max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get monthly updates, best practices, and early access to new features.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center gap-2 justify-center"
                aria-label="Subscribe to newsletter"
              >
                {newsletterStatus === 'loading' ? 'Sending...' : <>Subscribe <Send size={16} /></>}
              </button>
            </form>
            {newsletterStatus === 'success' && (
              <p className="text-sm text-green-400 mt-2" role="status">✓ Thanks! Please check your inbox to confirm your subscription.</p>
            )}
            {newsletterStatus === 'error' && (
              <p className="text-sm text-red-400 mt-2" role="alert">✗ Something went wrong. Please try again.</p>
            )}
          </div>

          {/* Social / Community Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/pricing" className="hover:text-white transition">Access Models</Link>
            <Link href="/signup" className="hover:text-white transition">Request Pilot Access</Link>
            <a href="https://github.com/arf-foundation" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              <Github size={18} /> GitHub (Public)
            </a>
            <a href="https://huggingface.co/A-R-F" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
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
            © 2026 ARF Foundation – Stewarded by the founder. The core engine is proprietary and access‑controlled. 
            Public components (spec, frontend UI, pitch deck) are licensed under Apache 2.0.
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <div aria-live="polite" className="sr-only">
        {copiedEmail && 'Email address copied'}
        {copiedSandboxSnippet && 'Sandbox command copied'}
      </div>
      {copiedEmail && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Email copied! ✉️
        </div>
      )}
      {copiedSandboxSnippet && (
        <div className="fixed bottom-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Sandbox command copied! 🧪
        </div>
      )}
    </div>
  );
}

// Helper components (unchanged)
function EcoCard({ icon, title, description, details }: { icon: React.ReactNode; title: string; description: string; details: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition group relative">
      <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto transition"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Show less' : 'Details'} about ${title}`}
      >
        {expanded ? 'Show less' : 'Details'} 
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-xs text-gray-300 border-t border-gray-700 pt-2">{details}</p>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon, details }: { title: string; description: string; icon: React.ReactNode; details: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition relative group">
      <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center mb-2">{description}</p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto transition"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Show less' : 'Details'} about ${title}`}
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

function DemoCard({ title, description, link, buttonText, icon = <ArrowRight size={16} />, external = false, disclaimer = '' }: { 
  title: string; 
  description: React.ReactNode; 
  link: string; 
  buttonText: string; 
  icon?: React.ReactNode; 
  external?: boolean;
  disclaimer?: string;
}) {
  const content = (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-400 mb-2 flex-1">{description}</div>
      {disclaimer && <p className="text-xs text-yellow-500 mb-3">{disclaimer}</p>}
      <span className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-auto">
        {buttonText} {icon}
      </span>
    </div>
  );
  if (external) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>;
  }
  return <Link href={link} className="block h-full">{content}</Link>;
}

function RepoCard({ name, desc, url }: { name: string; desc: string; url: string }) {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const repoName = url.split('/').pop();
  useEffect(() => {
    const fetchRepoData = async () => {
      const cached = localStorage.getItem(`github-${repoName}`);
      const cachedTime = localStorage.getItem(`github-${repoName}-time`);
      const now = Date.now();
      if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
        setRepoData(JSON.parse(cached));
        return;
      }
      try {
        const response = await fetch(`https://api.github.com/repos/arf-foundation/${repoName}`);
        const data = await response.json();
        if (data.stargazers_count !== undefined) {
          const newData = { stargazers_count: data.stargazers_count, language: data.language };
          setRepoData(newData);
          localStorage.setItem(`github-${repoName}`, JSON.stringify(newData));
          localStorage.setItem(`github-${repoName}-time`, now.toString());
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${repoName}:`, error);
      }
    };
    if (repoName) fetchRepoData();
  }, [repoName]);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition block group">
      <div className="flex items-start justify-between">
        <h3 className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">{name}</h3>
        {repoData && (
          <div className="flex items-center gap-2 text-xs">
            {repoData.language && <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">{repoData.language}</span>}
            <span className="flex items-center gap-0.5 text-yellow-400">
              <Star size={12} className="fill-yellow-400" />
              {repoData.stargazers_count.toLocaleString()}
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mt-1">{desc}</p>
    </a>
  );
}

function ContactLink({ href, icon, text, emoji, onClick }: { href: string; icon: React.ReactNode; text: string; emoji: string; onClick?: () => void }) {
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
