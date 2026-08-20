'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="arf-page-root min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <h1 className="arf-gradient-text mb-4 text-3xl font-bold sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mb-8 text-sm text-[color:var(--text-secondary)] sm:text-base">Everything you need to know about ARF.</p>

        {/* General */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 border-b border-[color:var(--hairline)] pb-2 text-xl font-semibold sm:text-2xl">General</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="What is ARF?"
              answer="ARF is a governance layer that evaluates infrastructure decisions through a calibrated risk model. It recommends one of three actions — approve, deny, or escalate — together with a confidence indicator and a full audit trail. The core engine is access‑controlled and available only to qualified pilots."
            />
            <FAQItem
              question="Is ARF publicly available?"
              answer="No. ARF is proprietary and access‑controlled. All repositories are private, and access to code, specifications, and supporting materials is granted only through approved pilot or enterprise arrangements."
            />
            <FAQItem
              question="What’s the difference between the demo and the real engine?"
              answer="The demo is illustrative and uses mock or advisory data. It is designed to explain the workflow, not expose the protected engine. The real system is private and available only through pilot or enterprise access."
            />
            <FAQItem
              question="How do I get access to the real engine?"
              answer={
                <>
                  Submit a <Link href="/signup" className="text-arf-blue underline underline-offset-2">pilot request</Link> or contact us at <a href="mailto:juan@arf-ai.com" className="text-arf-blue underline underline-offset-2">juan@arf-ai.com</a>. Access is reviewed case by case for qualified use cases.
                </>
              }
            />
          </div>
        </section>

        {/* Usage */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 border-b border-[color:var(--hairline)] pb-2 text-xl font-semibold sm:text-2xl">Usage</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="How do I interpret the risk score?"
              answer="The risk indicator is a value between 0 and 1. Higher values indicate higher estimated risk. The recommended action — approve, deny, or escalate — comes from a structured trade‑off model, not a fixed threshold, and includes a full, auditable justification."
            />
            <FAQItem
              question="Can I use the sandbox API for production?"
              answer="No. The sandbox API returns only mock data and is rate‑limited. It is intended for demonstration and testing only. For production use, you need pilot access to the real engine."
            />
            <FAQItem
              question="What is expected loss minimisation?"
              answer="The system evaluates the potential cost of each possible action based on configurable parameters and the current risk assessment. It then selects the action with the lowest expected impact, producing a human‑readable, auditable justification."
            />
          </div>
        </section>

        {/* Performance & Limitations */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 border-b border-[color:var(--hairline)] pb-2 text-xl font-semibold sm:text-2xl">Performance & Limitations</h2>
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

        {/* Engagement & Support */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 border-b border-[color:var(--hairline)] pb-2 text-xl font-semibold sm:text-2xl">Engagement & Support</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="How can I engage with ARF?"
              answer="ARF is not accepting public contributions. Collaboration is handled through private pilot, partner, or enterprise channels. Reach out to discuss possible involvement."
            />
            <FAQItem
              question="Where do I report a bug in the demo?"
              answer="Contact us directly through the support or pilot request channel. We review issues from approved users and pilot participants."
            />
            <FAQItem
              question="Is there a community Slack?"
              answer={
                <>
                  There is an invite‑only Slack workspace for pilot customers and approved collaborators.{" "}
                  <a href="https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg" target="_blank" rel="noopener noreferrer" className="text-arf-blue underline underline-offset-2">
                    Join here
                  </a>
                  .
                </>
              }
            />
          </div>
        </section>

        {/* Licensing */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 border-b border-[color:var(--hairline)] pb-2 text-xl font-semibold sm:text-2xl">Licensing</h2>
          <div className="space-y-5 sm:space-y-6">
            <FAQItem
              question="What license governs ARF materials?"
              answer="ARF materials are proprietary and access‑controlled. Any access to code, specifications, or supporting materials is governed by written agreement and approved use terms."
            />
            <FAQItem
              question="Can I use the real engine in a commercial product?"
              answer="Yes, under a pilot or enterprise agreement. Outcome‑based pricing applies. Contact us for details."
            />
          </div>
        </section>

        <p className="mt-8 border-t border-[color:var(--hairline)] pt-4 text-xs text-[color:var(--text-muted)] sm:text-sm">
          For more help, <Link href="/signup" className="text-arf-blue underline underline-offset-2">request pilot access</Link> or contact us directly.
        </p>
      </div>
    </div>
  );
}

// Collapsible FAQ item component (responsive)
function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="border-b border-[color:var(--hairline)] pb-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-1 text-left text-base font-medium text-[color:var(--text-primary)] transition hover:text-arf-blue sm:text-lg"
      >
        {question}
        {open ? <ChevronUp size={20} className="shrink-0" /> : <ChevronDown size={20} className="shrink-0" />}
      </button>
      {open && <div id={panelId} className="mt-2 space-y-2 text-sm text-[color:var(--text-secondary)] sm:text-base">{answer}</div>}
    </div>
  );
}
