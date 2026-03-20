'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function FAQPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Helper to render code blocks with copy buttons
  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-gray-900 p-3 rounded-lg text-sm text-green-300 overflow-x-auto whitespace-pre-wrap font-mono">
        {code}
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-1 bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition"
        aria-label="Copy code"
      >
        {copied === id ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-300 mb-8">Everything you need to know about ARF.</p>

        {/* General */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">General</h2>
          <div className="space-y-6">
            <FAQItem
              question="What is ARF?"
              answer="Agentic Reliability Framework (ARF) is an open‑source advisory engine that uses Bayesian inference to evaluate cloud infrastructure requests. It returns a recommendation – approve, deny, or escalate – with a calibrated risk score and a full explanation."
            />
            <FAQItem
              question="Is ARF production‑ready?"
              answer="The OSS core is stable and used in internal testing. For production use with actual cloud providers (Azure, AWS, etc.), we recommend the Enterprise edition, which adds enforcement, audit trails, and support."
            />
            <FAQItem
              question="What’s the difference between OSS and Enterprise?"
              answer={
                <>
                  <strong>OSS</strong>: advisory only, returns <code className="bg-gray-800 px-1 rounded">HealingIntent</code> with recommendations but does not execute anything. It uses in‑memory storage and limited FAISS index types.<br />
                  <strong>Enterprise</strong>: adds autonomous execution, persistent storage, approval workflows, audit trails, and support for advanced FAISS indices (IVF, HNSW) and embedding models.
                </>
              }
            />
            <FAQItem
              question="How do I get the Enterprise edition?"
              answer={
                <>
                  Contact us at <a href="mailto:petter2025us@outlook.com" className="text-blue-400 hover:underline">petter2025us@outlook.com</a> or book a call via <a href="https://calendly.com/petter2025us/30min" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Calendly</a>.
                </>
              }
            />
          </div>
        </section>

        {/* Installation & Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Installation & Setup</h2>
          <div className="space-y-6">
            <FAQItem
              question="What are the system requirements?"
              answer="Python 3.10 or later. The OSS core has minimal dependencies; for HMC you need `pymc` and `arviz`, and for optional embedding you need `sentence-transformers` and `torch`."
            />
            <FAQItem
              question="How do I install from source?"
              answer={
                <CodeBlock
                  code="git clone https://github.com/petter2025us/agentic-reliability-framework.git\ncd agentic-reliability-framework\npip install -e ."
                  id="install-source"
                />
              }
            />
            <FAQItem
              question="Why do I get an import error for torch or pymc?"
              answer={
                <>
                  Those are optional dependencies. If you don’t need HMC or advanced embeddings, you can ignore the error. To install them, run:
                  <CodeBlock
                    code="pip install pymc arviz torch sentence-transformers"
                    id="install-optional"
                  />
                </>
              }
            />
          </div>
        </section>

        {/* Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Usage</h2>
          <div className="space-y-6">
            <FAQItem
              question="How do I interpret the risk_factors?"
              answer="`risk_factors` is a dictionary where keys are model components (`conjugate`, `hyperprior`, `hmc`) and values are additive contributions to the total risk score. They sum to the `risk_score` (within floating‑point precision). This allows you to see which part of the model dominated the decision."
            />
            <FAQItem
              question="What is the epistemic uncertainty and how is it computed?"
              answer="Epistemic uncertainty is computed from three sources:\n\n- Hallucination risk from the ECLIPSE probe (if enabled)\n- Forecast uncertainty (1 – average confidence of forecasts)\n- Data sparsity (exponential decay based on history length)\n\nThe final value is `1 - ∏(1 - u_i)`, which can be interpreted as the probability that the model’s knowledge is insufficient. A high value triggers escalation if the epistemic gate is enabled."
            />
            <FAQItem
              question="Can I use my own cost data?"
              answer="Yes. The `CostEstimator` can be subclassed or replaced. The default uses a YAML file (`pricing.yml`) that you can edit. See the example in the README."
            />
            <FAQItem
              question="How do I add custom policies?"
              answer="Policies are evaluated by `PolicyEvaluator`. You can add rules by editing `evaluate_policies` in `core/governance/policy_engine.py` or by implementing your own evaluator and passing it to `GovernanceLoop`."
            />
          </div>
        </section>

        {/* Performance & Limitations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Performance & Limitations</h2>
          <div className="space-y-6">
            <FAQItem
              question="How many intents can ARF process per second?"
              answer="The OSS core is not optimized for high throughput; it is meant for advisory analysis. In benchmarks, it can handle ~10–20 requests per second on a typical CPU. For higher throughput, use the Enterprise edition with caching and parallel processing."
            />
            <FAQItem
              question="What are the memory limits for the RAG graph?"
              answer={
                <>
                  OSS limits:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Max incident nodes: 1000</li>
                    <li>Max outcome nodes: 5000</li>
                    <li>FAISS index type: <code className="bg-gray-800 px-1 rounded">IndexFlatL2</code> only</li>
                  </ul>
                  These are hard‑coded in <code className="bg-gray-800 px-1 rounded">constants.py</code>. If you need larger graphs, consider the Enterprise edition.
                </>
              }
            />
            <FAQItem
              question="Can I train the HMC model on‑the‑fly?"
              answer="Yes, you can call `risk_engine.train_hmc(df)` at any time. The model is serialised to `hmc_model.json` and reloaded automatically."
            />
          </div>
        </section>

        {/* Contributing & Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Contributing & Support</h2>
          <div className="space-y-6">
            <FAQItem
              question="How can I contribute?"
              answer={
                <>
                  See <a href="https://github.com/petter2025us/agentic-reliability-framework/blob/main/docs/development.md" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">development.md</a> for guidelines. We welcome bug reports, documentation improvements, and feature requests.
                </>
              }
            />
            <FAQItem
              question="Where do I report a bug?"
              answer={
                <>
                  Open an issue on <a href="https://github.com/petter2025us/agentic-reliability-framework/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>.
                </>
              }
            />
            <FAQItem
              question="Is there a community Slack?"
              answer="Not yet, but we plan to create one. For now, use GitHub Discussions."
            />
          </div>
        </section>

        {/* Licensing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Licensing</h2>
          <div className="space-y-6">
            <FAQItem
              question="What license does ARF use?"
              answer={
                <>
                  Apache 2.0. See the <a href="https://github.com/petter2025us/agentic-reliability-framework/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LICENSE</a> file.
                </>
              }
            />
            <FAQItem
              question="Can I use ARF in a commercial product?"
              answer="Yes, the OSS edition is free. If you need enterprise features, a commercial license is required."
            />
            <FAQItem
              question="Can I modify the code?"
              answer="Yes, under the terms of Apache 2.0. You must retain the original copyright notices."
            />
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Troubleshooting</h2>
          <div className="space-y-6">
            <FAQItem
              question="I get ValidationError: Execution not allowed in OSS edition"
              answer="This happens if you try to set `execution_allowed=True` or set a status that implies execution. In OSS, all `HealingIntent` are automatically marked `OSS_ADVISORY_ONLY` with `execution_allowed=False`. This is a safety measure."
            />
            <FAQItem
              question="My forecasts are empty / not showing"
              answer="Ensure you have added enough telemetry points (`FORECAST_MIN_DATA_POINTS` = 5 by default). Also check that the metric names match (e.g., `latency` vs `latency_p99`)."
            />
            <FAQItem
              question="The risk score is always 0.5"
              answer="This typically means the risk engine has no data and no HMC model. Add some training data or use the update mechanism to feed outcomes."
            />
            <FAQItem
              question="How do I enable hyperpriors?"
              answer="Hyperpriors require `pyro` and `torch`. Install them, then pass `use_hyperpriors=True` when creating `RiskEngine`. The hyperprior component will contribute to risk when enough data is available."
            />
          </div>
        </section>

        <p className="text-gray-400 text-sm border-t border-gray-700 pt-4 mt-8">
          For more help, search existing <a href="https://github.com/petter2025us/agentic-reliability-framework/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub issues</a> or open a new one.
        </p>
      </div>
    </div>
  );
}

// Collapsible FAQ item component
function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-100 hover:text-blue-400 transition"
      >
        {question}
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && <div className="mt-2 text-gray-300 space-y-2">{answer}</div>}
    </div>
  );
}
