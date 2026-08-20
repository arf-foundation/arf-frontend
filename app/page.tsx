"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  Building2,
  Compass,
  Cpu,
  Factory,
  FileText,
  Globe,
  HeartPulse,
  Landmark,
  Lock,
  Network,
  Server,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useInView } from "./hooks/useInView";
import ArchitecturePipeline from "../components/ArchitecturePipeline";
import {
  CapabilityCard,
  TierBody,
  SandboxCard,
  ConsoleCard,
  SpecsCard,
} from "@arf/ui";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/* ============================================================================
   DESIGN NOTES (full write-up in design_handoff_arf_enterprise_refresh/DESIGN_RATIONALE.md)

   Spacing rhythm — deliberately uneven, replacing the old uniform py-20:
     hero 88/104 → trust strip 46 (tight, scannable) → logo row 64/88 →
     problem 112 → why 96 → why-now 112 → industries 120 → capabilities 120 →
     governance 104 on its own surface → quote band 104 → pricing 112 →
     explore 104 → footer 72.
   The eye accelerates through the scannable bands and slows on the two proof
   sections (governance, quote), which is where enterprise buyers stop.

   Card weights — three, not one:
     .arf-card-substantial  capabilities + governance (soft shadow, hover lift)
     .arf-card-light        explore/demo cards (lighter, exploratory)
     .arf-card-anchored     dark trust strip, quote band
   ========================================================================= */

// arf-ai-... not a-r-f-...: the HF org renamed A-R-F -> ARF-AI and the old
// domain 404s directly (verified against HF's api/spaces endpoint), even
// though HF still lists it as a "READY" mapping.
const CURL_COMMAND = `curl -X POST https://arf-ai-arf-sandbox-api.hf.space/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

const CAPABILITIES = [
  {
    n: "01",
    title: "Policy Enforcement",
    description: "Deterministic policy gates that cannot be bypassed.",
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
      "Full audit trail",
      "Cryptographic attestation",
      "Attribution & accountability",
      "Regulatory-ready logs",
    ],
  },
  {
    n: "03",
    title: "Continuous Reliability",
    description:
      "Proactive monitoring, predictive foresight, and automated recovery.",
    icon: Cpu,
    items: [
      "Anomaly detection",
      "Predictive health scoring",
      "Control-theoretic stability monitoring",
      "Self-stabilising responses",
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
      "Real-time dashboards",
      "Causal attribution",
    ],
  },
] as const;

const TRUST = [
  {
    icon: Shield,
    title: "Architected for SOC 2 readiness",
    body: "Controls and evidence collection designed against the trust services criteria from day one.",
  },
  {
    icon: Lock,
    title: "Deterministic enforcement",
    body: "Policy gates execute mechanically before an action reaches infrastructure. Not advisory.",
  },
  {
    icon: FileText,
    title: "Cryptographic audit trail",
    body: "Every decision signed, timestamped and attributed — tamper-evident by construction.",
  },
] as const;

const GOVERNANCE = [
  {
    icon: FileText,
    title: "Tamper-evident audit trail",
    body: "Every decision is recorded, timestamped, and attributed. Logs are designed for regulatory review, forensic analysis, and compliance preparation — no exceptions, no gaps.",
  },
  {
    icon: Lock,
    title: "Mechanical enforcement",
    body: "Policy gates that cannot be bypassed or silently overridden. Every override is logged. Enforcement is deterministic — not advisory.",
  },
  {
    icon: Brain,
    title: "Explainable reasoning",
    body: "Every risk score is backed by transparent logic — never a black box. Suitable for executive briefings, regulator inquiries, and third-party audits.",
  },
] as const;

const WHO_FOR = [
  {
    icon: Server,
    title: "Platform & SRE leads",
    body: "You decide what AI-assisted tooling is allowed to do in production, and you need that decision enforced, not just documented.",
  },
  {
    icon: ShieldCheck,
    title: "Security & compliance leaders",
    body: "You need a defensible, tamper-evident record of every AI-assisted operational decision — before an auditor asks, not after.",
  },
  {
    icon: Compass,
    title: "Teams adopting AI-driven operations",
    body: "You want the speed of autonomous AI without losing the ability to explain, in writing, what happened and why.",
  },
] as const;

const INDUSTRIES = [
  { name: "Financial Services", icon: Building2 },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Government & Defence", icon: Landmark },
  { name: "Critical Infrastructure", icon: Factory },
  { name: "Enterprise AI Platforms", icon: Globe },
] as const;

const SPECS = [
  "Core Governance Engine",
  "API Control Plane",
  "Enterprise Layer",
  "Enterprise Specification",
] as const;

const TIERS = [
  {
    name: "Sandbox",
    meta: "Simulation only",
    price: "Free",
    items: [
      "1,000 evaluations / month",
      "Mock responses — not production",
      "Community support",
    ],
    cta: { label: "Try the sandbox", href: "#explore" },
    dominant: false,
  },
  {
    name: "Pilot",
    meta: "Time-limited · free",
    price: "By review",
    items: [
      "Protected core access",
      "Outcome-based or retainer after pilot",
      "Founder-led onboarding",
    ],
    cta: { label: "Request pilot access", href: "/signup" },
    dominant: false,
  },
  {
    name: "Enterprise",
    meta: "Commercial · custom",
    price: "Custom",
    items: [
      "Custom deployment fee",
      "Outcome-based or retainer maintenance",
      "SSO, multi-tenancy, SLA",
      "Full enforcement + audit trails",
    ],
    cta: { label: "Talk to us", href: "/signup" },
    dominant: true,
  },
] as const;

/* Docs/Specification have no dedicated internal route in this repo (no
   /spec page) — both point at the same external GitHub org the previous
   nav's "Spec" link used, matching NavBar's decision for the same gap. */
const SPEC_LINK = "https://github.com/arf-foundation";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Capabilities", href: "/#capabilities" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Governance Console", href: "/dashboard" },
      { label: "Access Models", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Specification", href: SPEC_LINK },
      { label: "Changelog", href: "/changelog" },
      { label: "History", href: "/history" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Request Pilot Access", href: "/signup" },
      { label: "Book a call", href: "https://calendly.com/petter2025us/30min" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/agentic-reliability",
      },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Slack",
        href: "https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg",
      },
      { label: "GitHub", href: "https://github.com/arf-foundation" },
      { label: "Hugging Face", href: "https://huggingface.co/ARF-AI" },
      {
        label: "Risk demo",
        href: "https://arf-foundation.github.io/arf-risk-demo/",
      },
    ],
  },
] as const;

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
      // Relative path through next.config.ts's rewrite (/api/v1/:path* ->
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

  const trackSlackClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "slack_invite_click", {
        event_category: "engagement",
      });
    }
  };

  const { ref: capsRef, inView: capsInView } = useInView({
    threshold: 0.15,
    once: true,
  });
  const { ref: govRef, inView: govInView } = useInView({
    threshold: 0.15,
    once: true,
  });
  const { ref: pricingRef, inView: pricingInView } = useInView({
    threshold: 0.15,
    once: true,
  });

  return (
    <div className="arf-page-root">
      {/* ─── Hero: badge, headline, ONE subheadline, two CTAs ──────────────────
          No longer paired with a decision-path visual here -- that content
          duplicated the Architecture section's pipeline one scroll down.
          Single canonical version now lives there (components/ArchitecturePipeline). */}
      {/* ─── "What's new" strip — surfaces recent shipped capability to
          first-time visitors (ICPs evaluating trust/maturity) without
          adding a 5th item to NavBar's deliberately-curated 4-link set. */}
      <div className="border-b border-[color:var(--hairline)] bg-[color:var(--surface-raised)] py-2.5 text-center text-sm">
        <Link
          href="/changelog"
          className="inline-flex items-center gap-2 text-[color:var(--text-secondary)] transition hover:text-arf-blue"
        >
          <span className="rounded-full bg-gradient-to-br from-arf-blue to-arf-purple px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-white">
            New
          </span>
          Explainable governance decisions + real PDF compliance export
          <ArrowRight size={13} />
        </Link>
      </div>

      <section className="arf-hero-wash">
        <div className="arf-shell py-[88px] pb-[104px]">
          <div className="mx-auto max-w-[680px] text-center">
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-arf-blue/25 bg-[color:var(--surface-raised)]/75 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-arf-blue">
              <span className="h-1.5 w-1.5 rounded-full bg-arf-blue" />
              Control plane for autonomous AI
            </p>
            <h1 className="mx-auto mb-6 max-w-[20ch] text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.03] tracking-[-0.033em] text-pretty">
              Enterprise infrastructure for{" "}
              <span className="arf-gradient-text">autonomous AI</span>
            </h1>
            <p className="mx-auto mb-9 max-w-[52ch] text-[18.5px] leading-[1.6] text-[color:var(--text-secondary)] text-pretty">
              Safely deploy autonomous AI in production with deterministic
              governance, continuous reliability, and enterprise-grade
              auditability.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="arf-btn-primary">
                Request Pilot Access <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="arf-btn-secondary">
                Open Governance Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust & compliance strip: the 3-second social-proof bar ─────────── */}
      <section className="bg-arf-dark py-[46px]">
        <div className="arf-shell grid gap-10 md:grid-cols-3">
          {TRUST.map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#7fa0ff]"
                strokeWidth={1.5}
              />
              <div>
                <h2 className="mb-1.5 text-[15.5px] font-semibold tracking-[-0.012em] text-white">
                  {item.title}
                </h2>
                <p className="text-[13.5px] leading-[1.55] text-white/70">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Trusted-by row (placeholder marks until real logos land) ────────── */}
      <section className="arf-shell pb-[88px] pt-16 text-center">
        <p className="arf-eyebrow mb-6">Deployed and evaluated with</p>
        <div className="flex flex-wrap items-center justify-center gap-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="h-6 w-[104px] rounded-[3px] bg-[repeating-linear-gradient(135deg,rgba(25,24,22,0.15)_0_2px,transparent_2px_7px)] dark:bg-[repeating-linear-gradient(135deg,rgba(250,249,247,0.18)_0_2px,transparent_2px_7px)]"
            />
          ))}
        </div>
        <p className="mt-3.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-[color:var(--text-muted)]">
          logo placeholders
        </p>
      </section>

      {/* ─── Problem / Solution / Outcome ────────────────────────────────────── */}
      <section className="arf-shell pb-[112px]">
        <div className="arf-card grid md:grid-cols-3">
          {[
            {
              label: "Problem",
              tone: "text-[#b0453a]",
              body: "AI agents make autonomous decisions that are difficult to govern, audit, and control.",
            },
            {
              label: "Solution",
              tone: "text-arf-blue",
              body: "ARF applies deterministic policy enforcement before every autonomous action.",
            },
            {
              label: "Outcome",
              tone: "text-arf-purple",
              body: "Every decision becomes explainable, auditable, and operationally trustworthy.",
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`p-10 ${idx < 2 ? "border-b border-[color:var(--hairline)] md:border-b-0 md:border-r" : ""}`}
            >
              <p
                className={`mb-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] ${item.tone}`}
              >
                {item.label}
              </p>
              <p className="text-[17px] leading-[1.55] text-pretty">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Who ARF is for — audience, not proof; arf-card-light per the card-
          weight system (exploratory/secondary), sitting between the Problem/
          Solution/Outcome trio and Why ARF? so "is this me" resolves before
          "why this approach". See DESIGN_RATIONALE.md §3/§6/§9. ────────────── */}
      <section className="arf-shell pb-24">
        <div className="mb-10 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="arf-eyebrow mb-3.5">Audience</p>
            <h2 className="text-h2 font-semibold">Who ARF is for</h2>
          </div>
          <p className="max-w-[56ch] self-end text-base leading-[1.65] text-[color:var(--text-secondary)] text-pretty">
            Built for the moment AI agents stop recommending and start acting on
            production infrastructure.
          </p>
        </div>
        <div className="grid gap-[22px] md:grid-cols-3">
          {WHO_FOR.map((item) => (
            <div key={item.title} className="arf-card-light p-8">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-arf-blue to-arf-purple">
                <item.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="mb-3 text-[19px] font-semibold tracking-[-0.016em]">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-[color:var(--text-secondary)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[13.5px] text-[color:var(--text-muted)]">
          Not there yet? The sandbox below is exactly for that — ARF is built
          for the step after evaluation, not instead of it.
        </p>
      </section>

      {/* ─── Why ARF? ────────────────────────────────────────────────────────── */}
      <section className="arf-shell grid gap-16 pb-24 lg:grid-cols-[0.9fr_1.1fr]">
        <h2 className="max-w-[12ch] text-h2 font-semibold">Why ARF?</h2>
        <div>
          <p className="mb-5 text-[21px] font-semibold leading-[1.45] tracking-[-0.014em] text-pretty">
            Foundation models are probabilistic. Enterprise operations require
            deterministic control. ARF bridges that gap.
          </p>
          <p className="text-body text-[color:var(--text-secondary)] text-pretty">
            Autonomous AI promises unprecedented speed and scale, but without
            governance it introduces unacceptable operational risk. ARF provides
            the missing control plane — translating probabilistic model outputs
            into verifiable, auditable actions that align with your business
            policies.
          </p>
        </div>
      </section>

      {/* ─── Why Now? ────────────────────────────────────────────────────────── */}
      <section className="arf-shell pb-[112px]">
        <div className="grid gap-16 rounded-[18px] border border-arf-blue/15 bg-gradient-to-br from-arf-blue/10 to-arf-purple/10 px-14 py-[60px] lg:grid-cols-[0.9fr_1.1fr]">
          <h2 className="max-w-[12ch] text-h2 font-semibold">Why now?</h2>
          <div>
            <p className="mb-4.5 text-body text-[color:var(--text-primary)]/85 text-pretty">
              Autonomous AI is moving from copilots to autonomous workflows. As
              AI gains the ability to act — not just recommend — organisations
              need infrastructure that governs execution, manages operational
              risk, and provides auditability by design.
            </p>
            <p className="text-body text-[color:var(--text-secondary)] text-pretty">
              ARF AI delivers that control plane. Built for the era where AI
              doesn&rsquo;t just answer questions — it deploys code, modifies
              infrastructure, and makes decisions that affect business outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Industries ──────────────────────────────────────────────────────── */}
      <section className="arf-shell pb-[120px]">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="text-[27px] font-semibold tracking-[-0.022em]">
            Built for regulated enterprises
          </h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            Compliance, safety, and accountability are non-negotiable.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.name}
              className="flex items-center gap-3 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-raised)] px-5 py-3 shadow-[0_10px_24px_-22px_rgba(25,24,22,0.5)]"
            >
              <ind.icon className="h-4 w-4 text-arf-blue" strokeWidth={1.75} />
              <span className="text-sm font-semibold tracking-[-0.01em]">
                {ind.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Architecture — one animated pipeline, no restated copies ─────────── */}
      <section id="architecture" className="arf-shell pb-[120px]">
        <p className="arf-eyebrow mb-3.5">Architecture</p>
        <h2 className="mb-11 text-h2 font-semibold">How ARF works</h2>
        <div className="arf-card p-5 sm:p-8 lg:p-11">
          <ArchitecturePipeline />
        </div>
      </section>

      {/* ─── Enterprise capabilities ─────────────────────────────────────────── */}
      <section
        id="capabilities"
        ref={capsRef}
        className={`arf-shell pb-[120px] arf-reveal ${capsInView ? "arf-reveal-in" : ""}`}
      >
        <div className="mb-10 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="arf-eyebrow mb-3.5">Product</p>
            <h2 className="text-h2 font-semibold">Enterprise capabilities</h2>
          </div>
          <p className="max-w-[56ch] self-end text-base leading-[1.65] text-[color:var(--text-secondary)] text-pretty">
            Four subsystems, one control plane. Every capability is observable
            from the Governance Console and enforceable from the API.
          </p>
        </div>
        <div className="grid gap-[22px] md:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <CapabilityCard key={cap.n} {...cap} />
          ))}
        </div>
      </section>

      {/* ─── Enterprise-grade governance — the proof section, most visual weight ─ */}
      <section
        ref={govRef}
        className={`border-y border-[color:var(--hairline)] bg-[color:var(--surface-raised)] py-[104px] arf-reveal ${
          govInView ? "arf-reveal-in" : ""
        }`}
      >
        <div className="arf-shell">
          <div className="mb-11 grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <h2 className="max-w-[14ch] text-h2-lg font-semibold">
              Enterprise-grade governance
            </h2>
            <p className="max-w-[52ch] self-end text-body text-[color:var(--text-secondary)] text-pretty">
              The three properties a compliance officer will ask about in the
              first meeting. Each one is a mechanism, not a policy document.
            </p>
          </div>
          <div className="grid gap-[22px] md:grid-cols-3">
            {GOVERNANCE.map((item) => (
              <div
                key={item.title}
                className="arf-card-substantial bg-[color:var(--surface-canvas)] p-9"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-arf-blue to-arf-purple">
                  <item.icon
                    className="h-5 w-5 text-white"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mb-3 text-[19px] font-semibold tracking-[-0.016em]">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-[color:var(--text-secondary)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Case study / testimonial band ───────────────────────────────────── */}
      <section className="arf-dark-wash bg-arf-dark py-[104px]">
        <div className="arf-shell grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
              Pilot feedback · placeholder quote
            </p>
            <blockquote className="mb-7 font-serif text-[clamp(1.75rem,3vw,2.125rem)] font-light italic leading-[1.35] tracking-[-0.01em] text-white text-pretty">
              &ldquo;We could not put agents anywhere near production until
              every action had a gate in front of it and a record behind it. ARF
              gave our risk committee something they could actually read.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3.5">
              <div
                aria-hidden
                className="h-[38px] w-[38px] rounded-full bg-[repeating-linear-gradient(135deg,rgba(250,249,247,0.22)_0_2px,transparent_2px_7px)]"
              />
              <div>
                <p className="text-[14.5px] font-semibold text-white">
                  Head of AI Platform
                </p>
                <p className="text-[13.5px] text-white/65">
                  Tier-1 financial services · pilot organisation
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-8">
            <p className="mb-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-white/60">
              Pilot outcome · illustrative
            </p>
            <dl className="flex flex-col gap-5">
              {[
                {
                  value: "100%",
                  label: "of autonomous actions gated and recorded",
                },
                { value: "42ms", label: "median policy evaluation overhead" },
                {
                  value: "0",
                  label: "silent overrides — every exception is signed",
                },
              ].map((stat, idx) => (
                <div
                  key={stat.value}
                  className={idx > 0 ? "border-t border-white/15 pt-5" : ""}
                >
                  <dt className="mb-1 text-[32px] font-semibold leading-none tracking-[-0.028em] text-white">
                    {stat.value}
                  </dt>
                  <dd className="text-[13.5px] leading-[1.5] text-white/70">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── Access models ───────────────────────────────────────────────────── */}
      <section
        id="pricing"
        ref={pricingRef}
        className={`arf-shell py-[112px] arf-reveal ${pricingInView ? "arf-reveal-in" : ""}`}
      >
        <div className="mb-11 grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <h2 className="max-w-[12ch] text-h2 font-semibold">Access models</h2>
          <p className="max-w-[56ch] self-end text-base leading-[1.65] text-[color:var(--text-secondary)] text-pretty">
            A fixed deployment fee, plus either outcome-based pricing or a
            monthly retainer. Pilot access is time-limited and free for
            qualified organisations — no commitment required.
          </p>
        </div>
        <div className="grid items-start gap-[22px] md:grid-cols-3">
          {TIERS.map((tier) =>
            tier.dominant ? (
              <div
                key={tier.name}
                className="rounded-2xl bg-gradient-to-br from-arf-blue to-arf-purple p-0.5 shadow-[0_30px_60px_-30px_rgba(51,88,232,0.6)]"
              >
                <div className="rounded-[14px] bg-[color:var(--surface-raised)] p-9">
                  <TierBody {...tier} renderLink={Link} />
                </div>
              </div>
            ) : (
              <div key={tier.name} className="arf-card-light p-8">
                <TierBody {...tier} renderLink={Link} />
              </div>
            ),
          )}
        </div>
      </section>

      {/* ─── Explore ARF — API / Console / Specs, one sandbox notice ─────────── */}
      <section id="explore" className="arf-shell pb-[104px]">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-8">
          <h2 className="text-h2 font-semibold">Explore ARF</h2>
          <p className="max-w-[50ch] text-[13.5px] leading-[1.6] text-[color:var(--text-secondary)] lg:text-right">
            The public sandbox returns simulated responses only. Real
            enforcement and confidence guarantees require a pilot agreement.
          </p>
        </div>
        <div className="grid gap-[22px] lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          {/* API */}
          <SandboxCard
            curlCommand={CURL_COMMAND}
            loading={sandboxLoading}
            response={sandboxResponse}
            error={sandboxError}
            copied={copied}
            onTryLive={fetchSandboxResponse}
            onCopy={handleCopy}
          />

          {/* Console */}
          <ConsoleCard href="/dashboard" renderLink={Link} />

          {/* Specs */}
          <SpecsCard specs={SPECS} href="/signup" renderLink={Link} />
        </div>
      </section>

      {/* ─── Footer — dense but organised; community + version badge live here ── */}
      <footer className="bg-arf-dark px-0 pb-8 pt-[72px] text-white/70">
        <div className="arf-shell">
          <div className="grid gap-11 border-b border-white/12 pb-[52px] lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <Link href="/" className="mb-4 flex items-center gap-3">
                <Image
                  src="/ARF - Transparent Primary Logo.png"
                  alt="ARF AI"
                  width={140}
                  height={50}
                  className="h-9 w-auto"
                />
              </Link>
              <p className="mb-6 max-w-[34ch] text-sm leading-[1.65]">
                The control plane between autonomous AI and enterprise
                infrastructure.
              </p>
              <a
                href="mailto:juan@arf-ai.com"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:border-white/50"
              >
                juan@arf-ai.com
              </a>
            </div>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-white/55">
                  {col.title}
                </p>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) =>
                    link.href.startsWith("http") ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={
                          link.label === "Slack" ? trackSlackClick : undefined
                        }
                        className="text-sm text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-sm text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-8 pt-7">
            <a
              href="https://github.com/arf-foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80"
            >
              <Image
                src="/GitHub_Lockup_White.svg"
                alt="GitHub Enterprise"
                width={120}
                height={34}
                className="h-8 w-auto"
              />
            </a>
            <div className="flex items-center gap-5 font-mono text-[12.5px] text-white/55">
              <Link href="/changelog" className="transition hover:text-white">
                v4.3.2 — Axiom
              </Link>
              <span>© 2026 ARF Foundation</span>
            </div>
          </div>
        </div>
      </footer>

      {copyError && (
        <div className="animate-slide-up fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-[#b0453a] px-4 py-2 text-sm text-white shadow-lg">
          {copyError}
        </div>
      )}
    </div>
  );
}

/* ============================ Sub-components ============================== */
