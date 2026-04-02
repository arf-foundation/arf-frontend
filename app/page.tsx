'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { z } from 'zod';

// Schema for risk API response
const RiskDataSchema = z.object({
  system_risk: z.number().min(0).max(1),
  status: z.enum(['critical', 'warning', 'safe']).catch('warning'),
});

type RiskData = z.infer<typeof RiskDataSchema>;

export default function Home() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

    Services --> Signals[Observability Signals]
    Metrics --> Signals

    Signals --> Interpreter[ARF Reliability Interpreter]
    
    subgraph Engine["⚙️ ARF Core Engine"]
        Interpreter --> Risk[Bayesian Risk Engine]
        Risk --> Intent[Healing Intent Engine]
    end
    
    Intent --> Recovery[Recovery Actions]
    
    style Interpreter fill:#e1f5fe,stroke:#01579b
    style Risk fill:#fff3e0,stroke:#e65100
    style Intent fill:#e8f5e8,stroke:#1b5e20`;

const CURL_COMMAND = `curl -X POST https://a-r-f-agentic-reliability-framework-api.hf.space/api/v1/incidents/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

// Declare gtag for analytics (if used)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function LandingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copiedFullSnippet, setCopiedFullSnippet] = useState(false);

  const handleCopyEmail = async () => {
    try {
<<<<<<< HEAD
      await navigator.clipboard.writeText('petter2025us@outlook.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
=======
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_risk`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Provide a meaningful message based on HTTP status
        if (response.status === 401) throw new Error('Unauthorized – check API credentials');
        if (response.status === 404) throw new Error('Risk endpoint not found');
        if (response.status >= 500) throw new Error('Server error – please try later');
        throw new Error(`HTTP error ${response.status}`);
      }

      const rawData = await response.json();
      
      // Validate response schema
      const validatedData = RiskDataSchema.parse(rawData);

      if (isMounted.current) {
        setRisk(validatedData);
        setFetchedAt(new Date());
        setError(null);
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out – please check your connection');
        } else if (err instanceof z.ZodError) {
          setError('Unable to parse risk data – invalid format from server');
        } else if (err instanceof Error) {
          setError(err.message || 'Failed to load risk data');
        } else {
          setError('Failed to load risk data');
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
>>>>>>> df58612 (Harden fetch flows, add validation, and enforce tests)
    }
  };

  const handleCopyCodeSnippet = async () => {
    try {
      await navigator.clipboard.writeText('curl -X POST /api/v1/incidents/evaluate');
      setCopiedCodeSnippet(true);
      setTimeout(() => setCopiedCodeSnippet(false), 2000);
    } catch (err) {
      console.error('Failed to copy code snippet:', err);
    }
  };

  const handleCopyFullSnippet = async () => {
    try {
      await navigator.clipboard.writeText(CURL_COMMAND);
      setCopiedFullSnippet(true);
      setTimeout(() => setCopiedFullSnippet(false), 2000);
    } catch (err) {
      console.error('Failed to copy full snippet:', err);
    }
  };

<<<<<<< HEAD
  const trackSlackClick = () => {
    console.log('Slack invite clicked at:', new Date().toISOString());
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slack_invite_click', {
        event_category: 'engagement',
        event_label: 'footer_slack_link'
      });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Newsletter subscription for:', email);
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  // Scroll animation hooks
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.2 });
  const { ref: ecosystemRef, inView: ecosystemInView } = useInView({ threshold: 0.2 });
  const { ref: capabilitiesRef, inView: capabilitiesInView } = useInView({ threshold: 0.2 });
  const { ref: demosRef, inView: demosInView } = useInView({ threshold: 0.2 });
  const { ref: reposRef, inView: reposInView } = useInView({ threshold: 0.2 });
  const { ref: footerRef, inView: footerInView } = useInView({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`container mx-auto px-4 py-20 text-center transition-opacity duration-1000 ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
            Agentic Reliability Framework (ARF) – AI Reliability & Self‑Healing Control Plane
          </h1>
          <GitHubStars />
        </div>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Turn probabilistic AI into deterministic, auditable action. Reduce MTTR by up to 85% with self‑healing systems.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Try Demo <ArrowRight size={18} />
          </a>
          <a
            href="https://a-r-f-agentic-reliability-framework-api.hf.space/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Explore API <ArrowRight size={18} />
          </a>
          <Link
            href="https://arf-foundation.github.io/arf-spec/"
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Documentation <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Problem-Solution-Outcome Block */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-red-400 font-bold text-xl mb-2">⚠️ Problem</div>
              <p className="text-gray-300">Most AI systems fail silently in production.</p>
            </div>
            <div>
              <div className="text-green-400 font-bold text-xl mb-2">🔧 Solution</div>
              <p className="text-gray-300">ARF turns probabilistic AI into deterministic, auditable action.</p>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-xl mb-2">📈 Outcome</div>
              <p className="text-gray-300">Reduce MTTR by up to 85% with self‑healing systems.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Row (additional) */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://a-r-f-agentic-reliability-framework-api.hf.space/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            API Docs <ArrowRight size={16} />
          </a>
          <a
            href="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
          >
            Live Demo <Rocket size={16} />
          </a>
          <a
            href="https://github.com/arf-foundation/agentic-reliability-framework"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition flex items-center gap-2"
          >
            GitHub <Github size={16} />
          </a>
          <a
            href="https://calendly.com/petter2025us/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 text-gray-300 px-5 py-2 rounded-lg font-medium hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            Book a Call <Calendar size={16} />
          </a>
        </div>
      </div>

      {/* Architecture Diagram - now uses Mermaid */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">How ARF Works</h2>
          <Mermaid chart={DIAGRAM} className="overflow-x-auto flex justify-center" />
          <p className="text-xs text-gray-500 mt-2 text-center">
            (Mermaid diagram – interactive)
          </p>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Try It Now</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
              <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">{CURL_COMMAND}</pre>
              <button
                onClick={handleCopyFullSnippet}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                aria-label="Copy full code"
              >
                {copiedFullSnippet ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Returns a full <span className="font-mono">HealingIntent</span> with risk score, risk factors, and recommended action.
            </p>
          </div>
        </div>
      </div>

      {/* Ecosystem Overview */}
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
            details="Published papers and collaborations with academic institutions on Bayesian methods for reliability engineering. Our research focuses on scalable inference for cloud infrastructure."
          />
          <EcoCard
            icon={<Code className="w-6 h-6 text-green-400" />}
            title="OSS Engine"
            description="Core Bayesian models, memory, and governance loop"
            details="The heart of ARF – implements conjugate priors, HMC sampling, and the semantic memory graph. Fully open‑source under Apache 2.0."
          />
          <EcoCard
            icon={<Users className="w-6 h-6 text-yellow-400" />}
            title="API Control Plane"
            description="FastAPI service exposing the framework"
            details="Production‑ready REST API with automatic docs, rate limiting, and CORS. Serves as the bridge between the core engine and frontend applications."
          />
          <EcoCard
            icon={<BookOpen className="w-6 h-6 text-purple-400" />}
            title="Frontend UI"
            description="Next.js dashboard for visualizing risk"
            details="Interactive dashboard built with Next.js and Tailwind CSS. Features real‑time risk charts, memory statistics, and the incident evaluation form you're using now."
          />
          <EcoCard
            icon={<Github className="w-6 h-6 text-orange-400" />}
            title="Enterprise"
            description="Advanced compliance, audit trails, and support"
            details="For organizations requiring SLAs, SSO, and advanced audit capabilities. Includes priority support and custom integrations."
          />
        </div>
      </section>

      {/* Key Capabilities */}
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
            description="Conjugate priors + HMC for calibrated uncertainty."
            icon={<Brain className="w-8 h-8 text-blue-400 float-icon" />}
            details="Uses prior knowledge and observed data to compute a full probability distribution of risk. The posterior distribution gives you not just a point estimate, but also uncertainty intervals and the full shape of risk."
          />
          <FeatureCard
            title="Semantic Memory"
            description="FAISS‑based retrieval of similar past incidents."
            icon={<Network className="w-8 h-8 text-green-400 float-icon" />}
            details="Stores incident embeddings in a FAISS index for fast similarity search. When a new incident occurs, ARF retrieves the most similar past incidents and their outcomes to inform the current risk assessment."
          />
          <FeatureCard
            title="DPT Thresholds"
            description="Deterministic approve/deny/escalate (0.2/0.8)."
            icon={<Scale className="w-8 h-8 text-yellow-400 float-icon" />}
            details="Clear decision boundaries based on risk score: approve (<0.2), escalate (0.2–0.8), deny (>0.8). These thresholds are configurable and can be adjusted to match your organization's risk appetite."
          />
          <FeatureCard
            title="Multi‑Agent Orchestration"
            description="Anomaly detection, root cause, forecasting."
            icon={<Cpu className="w-8 h-8 text-purple-400 float-icon" />}
            details="Coordinates multiple agents to detect anomalies, find root causes, and forecast future reliability. Each agent specializes in a different aspect of the infrastructure, and they collaborate to form a comprehensive picture."
          />
        </div>
      </section>

      {/* Live Demos */}
      <section
        ref={demosRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          demosInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Live Demos</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <DemoCard
            title="OSS Demo"
            description="Interactive risk dashboard"
            link="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            buttonText="Launch"
            icon={<Rocket size={16} />}
            external
          />
          <DemoCard
            title="API Code Snippet"
            description={
              <div className="flex items-center gap-2">
                <pre className="bg-gray-900 p-2 rounded text-sm font-mono text-green-300 whitespace-pre-wrap break-all flex-1">
                  curl -X POST /api/v1/incidents/evaluate
                </pre>
                <button
                  onClick={handleCopyCodeSnippet}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition group flex-shrink-0"
                  aria-label="Copy code snippet"
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
            title="Frontend Dashboard"
            description="Real‑time governance visuals"
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

      {/* Repository Links */}
      <section
        ref={reposRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          reposInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Repository Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RepoCard name="agentic-reliability-framework" desc="OSS Engine" url="https://github.com/arf-foundation/agentic-reliability-framework" />
          <RepoCard name="arf-api" desc="API Backend" url="https://github.com/arf-foundation/arf-api" />
          <RepoCard name="arf-frontend" desc="Frontend UI" url="https://github.com/arf-foundation/arf-frontend" />
          <RepoCard name="arf-spec" desc="ARF Spec" url="https://github.com/arf-foundation/arf-spec" />
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
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center gap-2 justify-center"
              >
                {newsletterStatus === 'loading' ? (
                  'Sending...'
                ) : (
                  <>
                    Subscribe <Send size={16} />
                  </>
                )}
              </button>
            </form>
            {newsletterStatus === 'success' && (
              <p className="text-sm text-green-400 mt-2">
                ✓ Thanks! Please check your inbox to confirm your subscription.
              </p>
            )}
            {newsletterStatus === 'error' && (
              <p className="text-sm text-red-400 mt-2">
                ✗ Something went wrong. Please try again.
              </p>
            )}
          </div>

          {/* Social / Community Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a href="https://github.com/arf-foundation" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              <Github size={18} /> GitHub
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
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-sm">© 2026 ARF Foundation – Open source (Apache 2.0)</p>
        </div>
      </footer>

      {/* Toast Notifications */}
      {copiedEmail && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Email copied to clipboard! ✉️
        </div>
      )}
      {copiedCodeSnippet && (
        <div className="fixed bottom-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Code snippet copied! 📋
        </div>
      )}
      {copiedFullSnippet && (
        <div className="fixed bottom-36 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Full command copied! 🚀
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
=======
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl" role="status" aria-label="Loading">
          <div className="animate-pulse">Loading risk data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div role="alert" className="text-red-600 mb-6">
            <p className="font-bold mb-2">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchRisk();
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        No risk data available
      </div>
    );
  }

  const statusColor = 
    risk.status === 'critical' ? 'bg-red-600' :
    risk.status === 'warning' ? 'bg-yellow-500' :
    'bg-green-500';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ARF System Risk</h1>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Risk Score</span>
            <span className="font-mono text-2xl font-bold text-gray-900">
              {(risk.system_risk * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className={`h-2 rounded transition-all ${statusColor}`}
              style={{ width: `${risk.system_risk * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-white font-medium text-sm ${statusColor}`}>
            {risk.status.toUpperCase()}
          </span>
        </div>

        {fetchedAt && (
          <p className="text-xs text-gray-500 text-center">
            Last updated: {fetchedAt.toLocaleTimeString()}
          </p>
        )}
>>>>>>> df58612 (Harden fetch flows, add validation, and enforce tests)
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

function DemoCard({ title, description, link, buttonText, icon = <ArrowRight size={16} />, external = false }: { 
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
          const newData = {
            stargazers_count: data.stargazers_count,
            language: data.language
          };
          setRepoData(newData);
          localStorage.setItem(`github-${repoName}`, JSON.stringify(newData));
          localStorage.setItem(`github-${repoName}-time`, now.toString());
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${repoName}:`, error);
      }
    };

    if (repoName) {
      fetchRepoData();
    }
  }, [repoName]);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition block group">
      <div className="flex items-start justify-between">
        <h3 className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">{name}</h3>
        {repoData && (
          <div className="flex items-center gap-2 text-xs">
            {repoData.language && (
              <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                {repoData.language}
              </span>
            )}
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
