import Link from 'next/link';
import { ArrowRight, Github, Rocket, BookOpen, Users, Code, Cpu, Brain, Scale, Network } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 glow-text">
          Agentic Reliability Framework
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Auditable cloud governance powered by Bayesian intelligence.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            Try Demo <ArrowRight size={18} />
          </Link>
          <a
            href="https://huggingface.co/spaces/A-R-F/Agentic-Reliability-Framework-API"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Explore API
          </a>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="container mx-auto px-4 py-16 animate-slide-up">
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
      <section className="container mx-auto px-4 py-16 animate-slide-up">
        <h2 className="text-3xl font-bold text-center mb-12">Key Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Bayesian Risk Scoring"
            description="Conjugate priors + HMC for calibrated uncertainty."
            icon={<Brain className="w-8 h-8 text-blue-400 float-icon" />}
          />
          <FeatureCard
            title="Semantic Memory"
            description="FAISS‑based retrieval of similar past incidents."
            icon={<Network className="w-8 h-8 text-green-400 float-icon" />}
          />
          <FeatureCard
            title="DPT Thresholds"
            description="Deterministic approve/deny/escalate (0.2/0.8)."
            icon={<Scale className="w-8 h-8 text-yellow-400 float-icon" />}
          />
          <FeatureCard
            title="Multi‑Agent Orchestration"
            description="Anomaly detection, root cause, forecasting."
            icon={<Cpu className="w-8 h-8 text-purple-400 float-icon" />}
          />
        </div>
      </section>

      {/* Live Demos */}
      <section className="container mx-auto px-4 py-16 animate-slide-up">
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
      <section className="container mx-auto px-4 py-16 animate-slide-up">
        <h2 className="text-3xl font-bold text-center mb-12">Repository Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RepoCard name="agentic-reliability-framework" desc="OSS Engine" url="https://github.com/arf-foundation/agentic-reliability-framework" />
          <RepoCard name="arf-api" desc="API Backend" url="https://github.com/arf-foundation/arf-api" />
          <RepoCard name="arf-frontend" desc="Frontend UI" url="https://github.com/arf-foundation/arf-frontend" />
          <RepoCard name="arf-spec" desc="ARF Spec" url="https://github.com/arf-foundation/arf-spec" />
        </div>
      </section>

      {/* Community & Footer */}
      <footer className="border-t border-gray-700 py-8 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://github.com/arf-foundation" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
            <a href="https://huggingface.co/A-R-F" target="_blank" rel="noopener noreferrer" className="hover:text-white">Hugging Face</a>
            <a href="#" className="hover:text-white">Join Forum</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p>© 2026 ARF Foundation – Open source (Apache 2.0)</p>
        </div>
      </footer>
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

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
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
