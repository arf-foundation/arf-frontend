// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Agentic Reliability Framework
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Bayesian governance for agentic systems – approve, deny, or escalate with mathematical rigor.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Launch Dashboard
          </Link>
          <a
            href="https://github.com/arf-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why ARF?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Bayesian Online Learning"
            description="Fast conjugate updates for per‑category risk using beta‑binomial models."
            icon="📈"
          />
          <FeatureCard
            title="HMC Pattern Discovery"
            description="Hamiltonian Monte Carlo captures complex interactions (time, role, environment)."
            icon="🔍"
          />
          <FeatureCard
            title="Composable Policies"
            description="Build fine‑grained rules with AND/OR/NOT combinators."
            icon="⚙️"
          />
          <FeatureCard
            title="Semantic Memory"
            description="FAISS‑based retrieval of similar past incidents for context‑aware decisions."
            icon="🧠"
          />
        </div>
      </section>

      {/* Architecture Diagram (placeholder) */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Architecture</h2>
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          [Architecture diagram will be added here]
        </div>
        <p className="text-center mt-4 text-gray-600">
          See the <a href="https://github.com/arf-foundation/agentic-reliability-framework/blob/main/docs/architecture.mmd" className="text-blue-600 underline">full diagram</a> on GitHub.
        </p>
      </section>

      {/* CTA / Community */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the community</h2>
        <p className="text-lg text-gray-600 mb-8">
          ARF is open source (Apache 2.0). Contributions welcome!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://github.com/arf-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            GitHub
          </a>
          <a
            href="https://huggingface.co/A-R-F"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Hugging Face
          </a>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
