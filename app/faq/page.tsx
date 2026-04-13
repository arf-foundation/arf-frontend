'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

// Helper component for code blocks with copy buttons – touch‑friendly on mobile
const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 p-3 rounded-lg text-xs sm:text-sm text-green-300 overflow-x-auto whitespace-pre-wrap font-mono">
        {code}
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 sm:p-1 bg-gray-700 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition focus:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
      </button>
    </div>
  );
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-300 text-sm sm:text-base mb-8">Everything you need to know about ARF.</p>

        {/* General */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">General</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="What is ARF?"
              answer="Agentic Reliability Framework (ARF) is a governance layer that uses Bayesian inference to evaluate infrastructure requests. It returns a recommendation – approve, deny, or escalate – with a calibrated risk score and a full explanation. The core engine is access‑controlled and available only to qualified pilots."
            />
            <FAQItem
              question="Is ARF open source?"
              answer="Only the public specification, demo UI, and pitch deck are open source (Apache 2.0). The core Bayesian engine, API control plane, and enterprise features are proprietary and access‑controlled."
            />
            <FAQItem
              question="What’s the difference between the public demo and the real engine?"
              answer="The public demo UI and sandbox API use mock data only. They illustrate concepts but do not invoke the real Bayesian engine. The real engine requires pilot access and is offered under outcome‑based pricing."
            />
            <FAQItem
              question="How do I get access to the real engine?"
              answer={
                <>
                  Fill out the <a href="/signup" className="text-blue-400 hover:underline">pilot request form</a> or contact us at <a href="mailto:petter2025us@outlook.com" className="text-blue-400 hover:underline">petter2025us@outlook.com</a>.
                </>
              }
            />
          </div>
        </section>

        {/* Usage */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Usage</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="How do I interpret the risk score?"
              answer="The risk score is a probability between 0 and 1. Higher values indicate higher estimated risk. The decision (approve/deny/escalate) is based on expected loss minimisation, not a fixed threshold."
            />
            <FAQItem
              question="Can I use the sandbox API for production?"
              answer="No. The sandbox API returns only mock data and is rate‑limited. It is intended for demonstration and testing only. For production use, you need pilot access to the real engine."
            />
            <FAQItem
              question="What is expected loss minimisation?"
              answer="Expected loss minimisation calculates the cost of each possible action (approve, deny, escalate) based on configurable cost constants and the current risk distribution, then selects the action with the lowest expected loss."
            />
          </div>
        </section>

        {/* Performance & Limitations */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Performance & Limitations</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="How many requests per second can the real engine handle?"
              answer="Performance depends on deployment scale. For pilot customers, we provide guidance based on your expected volume. Enterprise customers receive SLAs and dedicated capacity."
            />
            <FAQItem
              question="What data is stored?"
              answer="The engine stores audit logs (decisions, risk scores, justifications) for compliance. No raw customer data is retained beyond what is required for the audit trail. Contact us for detailed retention policies."
            />
          </div>
        </section>

        {/* Contributing & Support */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Contributing & Support</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="How can I contribute to public repositories?"
              answer={
                <>
                  See the <a href="https://github.com/arf-foundation/arf-frontend" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">README</a> for guidelines. We accept limited contributions to public repos (arf-spec, arf-frontend, pitch-deck) – bug fixes, documentation, demo improvements.
                </>
              }
            />
            <FAQItem
              question="Where do I report a bug in the public demo?"
              answer={
                <>
                  Open an issue on <a href="https://github.com/arf-foundation/arf-frontend/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>.
                </>
              }
            />
            <FAQItem
              question="Is there a community Slack?"
              answer="Yes, we have a Slack workspace for pilot customers and community discussions. <a href='https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>Join here</a>."
            />
          </div>
        </section>

        {/* Licensing */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Licensing</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="What license does the public specification use?"
              answer="Apache 2.0. See the <a href='https://github.com/arf-foundation/arf-spec/blob/main/LICENSE' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>LICENSE</a> file."
            />
            <FAQItem
              question="Can I use the real engine in a commercial product?"
              answer="Yes, under a pilot or enterprise agreement. Outcome‑based pricing applies. Contact us for details."
            />
          </div>
        </section>

        <p className="text-gray-400 text-xs sm:text-sm border-t border-gray-700 pt-4 mt-8">
          For more help, see the <a href="https://github.com/arf-foundation/arf-spec" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">public specification</a> or <a href="/signup" className="text-blue-400 hover:underline">request pilot access</a>.
        </p>
      </div>
    </div>
  );
}

// Collapsible FAQ item component (responsive)
function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left text-base sm:text-lg font-medium text-gray-100 hover:text-blue-400 transition py-1"
      >
        {question}
        {open ? <ChevronUp size={20} className="shrink-0" /> : <ChevronDown size={20} className="shrink-0" />}
      </button>
      {open && <div className="mt-2 text-gray-300 space-y-2 text-sm sm:text-base">{answer}</div>}
    </div>
  );
}
