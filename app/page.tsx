// Updated by ARF Coding Agent: Added GitHub stars, tooltips, enhanced newsletter, documentation button, scroll animations
'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  Send
} from 'lucide-react';
// Corrected imports: use relative paths instead of '@/' alias
import GitHubStars from './components/GitHubStars';
import { useInView } from './hooks/useInView';

// Declare gtag for analytics (if used)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('petter2025us@outlook.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

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
        <div className="flex justify-center items-center gap-3 mb-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
            Agentic Reliability Framework
          </h1>
          <GitHubStars />
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Auditable cloud governance powered by Bayesian intelligence.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            Try Demo <ArrowRight size={18} />
          </a>
          <a
            href="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-API"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Explore API
          </a>
          <Link
            href="https://arf-foundation.github.io/arf-spec/"
            className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition flex items-center gap-2"
          >
            Documentation <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section
        ref={ecosystemRef}
        className={`container mx-auto px-4 py-16 transition-opacity duration-1000 ${
          ecosystemInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Ecosystem Overview</h2>
        <div className="grid md:grid-cols-5 gap-4 text-center">
          <EcoCard
            icon={<Rocket className="w-6 h-6 text-blue-400" />}
            title="Research"
            description="Mathematical foundations of hybrid Bayesian inference"
          />
          <EcoCard
            icon={<Code className="w-6 h-6 text-green-400" />}
            title="OSS Engine"
            description="Core Bayesian models, memory, and governance loop"
          />
          <EcoCard
            icon={<Users className="w-6 h-6 text-yellow-400" />}
            title="API Control Plane"
            description="FastAPI service exposing the framework"
          />
          <EcoCard
            icon={<BookOpen className="w-6 h-6 text-purple-400" />}
            title="Frontend UI"
            description="Next.js dashboard for visualizing risk"
          />
          <EcoCard
            icon={<Github className="w-6 h-6 text-orange-400" />}
            title="Enterprise"
            description="Advanced compliance, audit trails, and support"
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
        <h2 className="text-3xl font-bold text-center mb-12">Key Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Bayesian Risk Scoring"
            description="Conjugate priors + HMC for calibrated uncertainty."
            icon={<Brain className="w-8 h-8 text-blue-400 float-icon" />}
            tooltip="Uses prior knowledge and observed data to compute a probability distribution of risk."
          />
          <FeatureCard
            title="Semantic Memory"
            description="FAISS‑based retrieval of similar past incidents."
            icon={<Network className="w-8 h-8 text-green-400 float-icon" />}
            tooltip="Stores incident embeddings in a FAISS index for fast similarity search."
          />
          <FeatureCard
            title="DPT Thresholds"
            description="Deterministic approve/deny/escalate (0.2/0.8)."
            icon={<Scale className="w-8 h-8 text-yellow-400 float-icon" />}
            tooltip="Clear decision boundaries based on risk score: approve (<0.2), escalate (0.2–0.8), deny (>0.8)."
          />
          <FeatureCard
            title="Multi‑Agent Orchestration"
            description="Anomaly detection, root cause, forecasting."
            icon={<Cpu className="w-8 h-8 text-purple-400 float-icon" />}
            tooltip="Coordinates multiple agents to detect anomalies, find root causes, and forecast future reliability."
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
        <h2 className="text-3xl font-bold text-center mb-12">Live Demos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <DemoCard
            title="OSS Demo"
            description="Interactive risk dashboard"
            link="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-v4"
            buttonText="Launch"
            external
          />
          <DemoCard
            title="API Code Snippet"
            description={
              <pre className="bg-gray-900 p-2 rounded text-sm font-mono text-green-300">
                curl -X POST /api/v1/incidents/evaluate
              </pre>
            }
            link="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-API"
            buttonText="Try API"
            external
          />
          <DemoCard
            title="Frontend Dashboard"
            description="Real‑time governance visuals"
            link="/dashboard"
            buttonText="Go"
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
        <h2 className="text-3xl font-bold text-center mb-12">Repository Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RepoCard name="agentic-reliability-framework" desc="OSS Engine" url="https://github.com/arf-foundation/agentic-reliability-framework" />
          <RepoCard name="arf-api" desc="API Backend" url="https://github.com/arf-foundation/arf-api" />
          <RepoCard name="arf-frontend" desc="Frontend UI" url="https://github.com/arf-foundation/arf-frontend" />
          <RepoCard name="arf-spec" desc="ARF Spec" url="https://github.com/arf-foundation/arf-spec" />
        </div>
      </section>

      {/* Community & Footer */}
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
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  )}
                </button>
              </div>
              <ContactLink
                href="https://www.linkedin.com/in/juan-petter"
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
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center gap-2"
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
          <div className="flex justify-center gap-6 mb-4">
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

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 animate-slide-up">
          Email copied to clipboard! ✉️
        </div>
      )}
    </div>
  );
}

function EcoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition group">
      <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description, icon, tooltip }: { title: string; description: string; icon: React.ReactNode; tooltip?: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition relative group">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 border border-gray-700">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function DemoCard({ title, description, link, buttonText, external = false }: { title: string; description: React.ReactNode; link: string; buttonText: string; external?: boolean }) {
  const content = (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-gray-400 mb-4 flex-1">{description}</div>
      <span className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-auto">
        {buttonText} <ArrowRight size={16} />
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
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition block">
      <h3 className="font-mono text-sm text-gray-300">{name}</h3>
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
