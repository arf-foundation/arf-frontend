"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Cpu, FileText, Network, Shield } from "lucide-react";
import { CapabilityCard, SandboxCard, ConsoleCard, SpecsCard } from "@arf/ui";
import ArchitecturePipeline from "../components/ArchitecturePipeline";
import ReviewProof from "../components/ReviewProof";
import { REVIEW_EXAMPLE_PATH, REVIEW_REQUEST_PATH, SNAPSHOT_REQUEST_PATH } from "../lib/engagement-offers";

const CURL_COMMAND = `curl -X POST https://arf-ai-arf-sandbox-api.hf.space/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

const CAPABILITIES = [
  {
    n: "01",
    title: "Policy Enforcement",
    description: "Deterministic policy gates on every governed write.",
    icon: Shield,
    items: [
      "Deterministic execution gates",
      "Approval workflows",
      "Regional policy controls",
      "Cost guardrails",
    ],
  },
  {
    n: "02",
    title: "Decision Governance",
    description: "Tamper-evident records with cryptographic signing.",
    icon: FileText,
    items: [
      "Audit trail of every governed decision",
      "Cryptographic attestation",
      "Attribution & accountability",
      "PDF audit report export",
    ],
  },
  {
    n: "03",
    title: "Continuous Reliability",
    description:
      "Proactive monitoring, predictive foresight, and governed recovery actions.",
    icon: Cpu,
    items: [
      "Anomaly detection",
      "Predictive health scoring",
      "Control-theoretic stability monitoring",
      "Lyapunov-guided stabilising actions",
    ],
  },
  {
    n: "04",
    title: "Operational Transparency",
    description:
      "Explainable risk scoring, causal reasoning, and real-time observability.",
    icon: Network,
    items: [
      "Explainable risk scores",
      "Counterfactual what-if analysis",
      "Live Prometheus metrics",
      "Causal attribution",
    ],
  },
] as const;

const SPECS = [
  "Core Governance Engine",
  "API Control Plane",
  "Enterprise Layer",
  "Enterprise Specification",
] as const;

/* Each fact is pinned by a test of the ONTAP gate and shown in its demo.
   No customer numbers until they are real. */
export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    isMounted.current = true;
    const pending = timers.current;
    return () => {
      isMounted.current = false;
      pending.forEach(clearTimeout);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CURL_COMMAND);
      setCopied(true);
      timers.current.push(
        setTimeout(() => isMounted.current && setCopied(false), 2000),
      );
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
      setCopyError("Could not copy the curl command");
      timers.current.push(
        setTimeout(() => isMounted.current && setCopyError(null), 2000),
      );
    }
  };

  const fetchSandboxResponse = async () => {
    setSandboxLoading(true);
    setSandboxError(null);
    try {
      // Relative path through next.config.ts's rewrite (/api/v1/evaluate ->
      // the sandbox API), not the absolute URL: the CSP's connect-src does
      // not allowlist the sandbox's own domain, so a direct browser fetch
      // to it is silently blocked. The displayed CURL_COMMAND above keeps
      // the real external URL -- that's accurate for someone running curl
      // from their own machine, unaffected by this page's CSP.
      const res = await fetch("/api/v1/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_name: "api",
          event_type: "latency",
          severity: "high",
          metrics: { latency_ms: 450 },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Record<string, unknown>;
      if (isMounted.current) setSandboxResponse(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (isMounted.current) setSandboxError(message);
    } finally {
      if (isMounted.current) setSandboxLoading(false);
    }
  };


  return (
    <div className="arf-page-root">
      <section className="arf-hero-wash arf-landing-hero">
        <div className="arf-shell pb-10 pt-16 sm:pb-14 sm:pt-24">
          <h1 className="max-w-[20ch] text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">
            What would you need to verify before <span className="arf-gradient-text">your storage agent writes?</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-[color:var(--text-secondary)] text-pretty">
            The $4,500 read-only review shows who should approve each write, what recovery evidence exists,
            and which writes should stay on hold.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={REVIEW_REQUEST_PATH} className="arf-btn-primary max-w-full justify-center">
              Request the $4,500 review <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="#proof" className="arf-btn-secondary max-w-full justify-center">
              Watch the evidence
            </Link>
          </div>
          <p className="mt-4 text-sm text-[color:var(--text-secondary)]">
            Early access · unaudited · no certification claimed
          </p>
        </div>
      </section>

      <ReviewProof />

      <section id="pricing" className="arf-shell scroll-mt-24 py-10 sm:py-14">
        <div className="grid items-start gap-6 border-y border-[color:var(--hairline)] py-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div>
            <p className="arf-eyebrow mb-3">$4,500 · Read-only review</p>
            <h2 className="text-h2 font-semibold">Turn a blocked write into a decision</h2>
          </div>
          <div className="max-w-[64ch]">
            <p className="leading-relaxed text-[color:var(--text-secondary)]">
              Bring one agent in one environment or provider, up to ten named writes and 200 records.
              Leave with a write inventory, recoverability map and an evidence-backed decision memo.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/pricing" className="rounded-sm font-semibold text-arf-blue underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
                See the scope and price
              </Link>
              <Link href={SNAPSHOT_REQUEST_PATH} className="rounded-sm font-medium text-[color:var(--text-secondary)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
                Request a free five-tool snapshot
              </Link>
            </div>
            <figure className="mt-6 rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] p-4 sm:p-5">
              <figcaption className="mb-3 text-sm font-semibold">From the sample decision memo</figcaption>
              <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
                <dt className="font-semibold">Proposed write</dt>
                <dd className="text-[color:var(--text-secondary)]">Delete the source volume.</dd>
                <dt className="font-semibold">Evidence reviewed</dt>
                <dd className="text-[color:var(--text-secondary)]">Healthy mirror report. New file absent on the replica.</dd>
                <dt className="font-semibold">Open question</dt>
                <dd className="text-[color:var(--text-secondary)]">Can the storage owner recover the current data?</dd>
              </dl>
              <Link href={REVIEW_EXAMPLE_PATH} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-arf-blue underline underline-offset-4">
                Read the full sample <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </figure>
          </div>
        </div>
      </section>

      <section className="arf-shell space-y-3 pb-12 sm:pb-18" aria-label="Technical details">
        <details id="architecture" className="group scroll-mt-24 rounded-xl border border-[color:var(--hairline)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arf-blue">
            How ARF works
            <ChevronDown size={18} className="shrink-0 group-open:rotate-180 motion-safe:transition-transform" aria-hidden="true" />
          </summary>
          <div className="min-w-0 border-t border-[color:var(--hairline)] p-4 sm:p-6">
            <ArchitecturePipeline />
          </div>
        </details>
        <details id="capabilities" className="group scroll-mt-24 rounded-xl border border-[color:var(--hairline)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arf-blue">
            Technical capabilities
            <ChevronDown size={18} className="shrink-0 group-open:rotate-180 motion-safe:transition-transform" aria-hidden="true" />
          </summary>
          <div className="min-w-0 border-t border-[color:var(--hairline)] p-4 sm:p-6">
            <p className="mb-4 max-w-[64ch] text-[color:var(--text-secondary)]">
              Explore these views on simulated data. Enforcement runs on a separately scoped write path.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {CAPABILITIES.map((capability) => <CapabilityCard key={capability.n} {...capability} />)}
            </div>
          </div>
        </details>
      </section>

      <section id="explore" className="arf-shell scroll-mt-24 pb-12 sm:pb-18">
        <h2 className="text-h2 font-semibold">Explore the sandbox</h2>
        <p className="mb-5 mt-2 text-sm text-[color:var(--text-secondary)]">
          The public API and console use simulated data.
        </p>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <SandboxCard
            curlCommand={CURL_COMMAND}
            loading={sandboxLoading}
            response={sandboxResponse}
            error={sandboxError}
            copied={copied}
            onTryLive={fetchSandboxResponse}
            onCopy={handleCopy}
          />
          <ConsoleCard href="/dashboard" renderLink={Link} />
          <SpecsCard specs={SPECS} href="/signup" renderLink={Link} />
        </div>
      </section>

      {copyError && (
        <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-[#b0453a] px-4 py-2 text-sm text-white shadow-lg">
          {copyError}
        </div>
      )}
    </div>
  );
}
