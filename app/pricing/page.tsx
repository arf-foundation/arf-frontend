import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ============================================================================
   /pricing — ported to the landing-page design system.

   Same tokens, same three card weights, same rhythm. Two additions this page
   needs and the landing page does not:
     • a comparison table, because the buying question here is "what changes
       between tiers", and the honest answer is a single line: the sandbox
       advises, a pilot enforces.
     • the commercial-model explainer, because hybrid pricing (deployment fee +
       outcome or retainer) is unfamiliar and a three-column card grid answers
       it faster than prose.

   Enterprise is dominant via a 2px gradient border, not a "Recommended" badge.
   Server component — no hooks needed here.

   Commercial claims revised with the founder on 2026-10-02. No SLA, SSO,
   named support engineer, in-perimeter deployment or outcome-based share is
   offered today, so none is listed. The review is $4,500 per agent (Petter
   approved showing it publicly, 2026-10-02); the continuous gate is by
   invitation only.
   ========================================================================= */

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'A free pilot snapshot of five write tools, then a fixed-price review of one agent\'s production write paths. A continuous gate is available by invitation after a review.',
  alternates: { canonical: '/pricing' },
};

const TIERS = [
  {
    name: 'Sandbox',
    meta: 'Simulation only',
    price: 'Free',
    note: 'No agreement required',
    items: [
      '1,000 evaluations / month',
      'Mock responses — not production',
      'Public API + Governance Console',
      'Community support',
    ],
    cta: { label: 'Try the sandbox', href: '/#explore' },
    dominant: false,
  },
  {
    name: 'Pilot snapshot',
    meta: 'Free · 3 founding slots',
    price: 'Free',
    note: 'In exchange for a written reference',
    items: [
      'One agent, five named write tools',
      'Which actions could run unattended, which need approval',
      'A short written summary',
      'Founder-led, from read-only material',
    ],
    cta: { label: 'Request Pilot Access', href: '/signup' },
    dominant: false,
  },
  {
    name: 'Write-access review',
    meta: 'Fixed price · one agent',
    price: '$4,500',
    note: 'One agent, fixed price; delivery date agreed at scoping',
    items: [
      'Every production write your agent can make',
      'Whether each can be undone, from evidence',
      'Unattended vs. approval-required, action by action',
      'Explicit gaps and next steps',
    ],
    cta: { label: 'Talk to us', href: '/signup' },
    dominant: true,
  },
] as const;

const COMPARISON = [
  { label: 'What you get', sandbox: 'Simulated decisions', pilot: 'A five-tool write-access map', enterprise: 'A full map of one agent\'s write paths' },
  { label: 'What we need', sandbox: 'Synthetic or redacted payloads', pilot: 'Tool list + representative traces', enterprise: 'Tool definitions + action history' },
  { label: 'Access to your systems', sandbox: 'None', pilot: 'Read-only material only', enterprise: 'Read-only material only' },
  { label: 'Enforcement', sandbox: 'Simulated only', pilot: 'None — analysis only', enterprise: 'None in the review; a gate is by invitation afterwards' },
  { label: 'Deliverable', sandbox: 'API responses', pilot: 'Short written summary', enterprise: 'Report, recoverability map, gap list' },
  { label: 'Support', sandbox: 'Community', pilot: 'Founder-led', enterprise: 'Founder-led' },
  { label: 'Commercials', sandbox: 'Free', pilot: 'Free, reference agreed in writing', enterprise: '$4,500 fixed, card or invoice' },
] as const;

const MODEL = [
  {
    n: '01',
    title: 'Start with a snapshot',
    body: 'Five named write tools, analysed from your tool list and representative traces. Free for three teams, in exchange for a written reference.',
  },
  {
    n: '02',
    title: 'Then a fixed-price review',
    body: 'One agent\'s production write paths, mapped action by action: which can run unattended, which should wait for a human, and what evidence remains when it acts.',
  },
  {
    n: '03',
    title: 'A continuous gate, by invitation',
    body: 'After a review, ARF can gate your agent\'s write path where that path is modeled — demonstrated today for ONTAP storage operations against a simulated cluster. Scoped and priced per engagement.',
  },
] as const;

const FAQ = [
  {
    q: 'What does the review deliver?',
    a: 'A report on one agent: every production write it can make, whether each can be undone, which should run unattended and which should wait for a human, and the gaps between your current controls and that map. Findings cite your agent\'s own tools and history.',
  },
  {
    q: 'Do you need write access to our systems?',
    a: 'Not for a snapshot or a review. Both use read-only material: tool definitions, representative traces or action history, and any existing policy. A continuous gate, if you choose one later, does sit in your agent\'s write path, and is scoped separately.',
  },
  {
    q: 'Which agents is this for?',
    a: 'Teams whose agents are moving from read-only recommendations to production changes — infrastructure and storage operations first. Agents that make other consequential changes, such as customer-facing commitments, can be scoped on a call.',
  },
  {
    q: 'What happens after the review?',
    a: 'Nothing automatic. No subscription starts and nothing else is billed. If you want the decisions enforced rather than recommended, a continuous gate is scoped separately.',
  },
  {
    q: 'Is the sandbox safe to point at production data?',
    a: 'No. The sandbox returns simulated responses and should be treated as a demonstration surface. Use synthetic or redacted payloads.',
  },
  {
    q: 'How do we pay?',
    a: 'Card or a simple invoice. The review is $4,500 for one agent, fixed before work starts; a larger scope is quoted after we see the tool list.',
  },
] as const;

export default function PricingPage() {
  return (
    <div className="arf-page-root">
      {/* ─── Page header ─────────────────────────────────────────────────── */}
      <section className="arf-hero-wash">
        <div className="arf-shell pb-[72px] pt-[88px] text-center">
          <p className="arf-eyebrow mb-5">Pricing</p>
          <h1 className="mx-auto mb-[22px] max-w-[19ch] text-[clamp(2.25rem,4.4vw,3.125rem)] font-bold leading-[1.05] tracking-[-0.031em] text-pretty">
            Start with evidence about <span className="arf-gradient-text">your own agent</span>
          </h1>
          <p className="mx-auto max-w-[62ch] text-lg leading-[1.6] text-[color:var(--text-secondary)] text-pretty">
            A free snapshot of five write tools, then a fixed-price review of one agent&rsquo;s production write
            paths. A continuous gate is available by invitation after a review.
          </p>
        </div>
      </section>

      {/* ─── Tiers ───────────────────────────────────────────────────────── */}
      <section className="arf-shell pb-24">
        <div className="grid items-start gap-[22px] md:grid-cols-3">
          {TIERS.map((tier) =>
            tier.dominant ? (
              <div
                key={tier.name}
                className="rounded-2xl bg-gradient-to-br from-arf-blue to-arf-purple p-0.5 shadow-[0_30px_60px_-30px_rgba(51,88,232,0.6)]"
              >
                <div className="rounded-[14px] bg-[color:var(--surface-raised)] p-9">
                  <TierBody {...tier} />
                </div>
              </div>
            ) : (
              <div key={tier.name} className="arf-card-light p-8">
                <TierBody {...tier} />
              </div>
            ),
          )}
        </div>
      </section>

      {/* ─── Comparison ──────────────────────────────────────────────────── */}
      <section className="arf-shell pb-[112px]">
        <div className="mb-9 grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className="max-w-[14ch] text-h2 font-semibold">What each step includes</h2>
          <p className="max-w-[54ch] self-end text-base leading-[1.65] text-[color:var(--text-secondary)] text-pretty">
            The difference is depth: the snapshot looks at five tools, the review maps every production write your
            agent can make. Neither needs write access to your systems.
          </p>
        </div>

        <div className="arf-card overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">What the Sandbox, the Pilot snapshot and the Write-access review include</caption>
            <thead>
              <tr className="border-b border-[color:var(--hairline)] bg-[color:var(--surface-sunken)]">
                <th scope="col" className="px-6 py-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-[color:var(--text-secondary)]">
                  Capability
                </th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">Sandbox</th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">Pilot snapshot</th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold text-arf-blue">Write-access review</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-[color:var(--hairline)] last:border-b-0">
                  <th scope="row" className="px-6 py-4 text-left text-[14.5px] font-medium leading-[1.4]">
                    {row.label}
                  </th>
                  <td className="px-5 py-4 text-sm leading-[1.4] text-[color:var(--text-secondary)]">{row.sandbox}</td>
                  <td className="px-5 py-4 text-sm leading-[1.4] text-[color:var(--text-secondary)]">{row.pilot}</td>
                  <td className="px-5 py-4 text-sm leading-[1.4]">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Commercial model ────────────────────────────────────────────── */}
      <section className="arf-shell pb-[112px]">
        <div className="rounded-[18px] border border-arf-blue/15 bg-gradient-to-br from-arf-blue/10 to-arf-purple/10 p-14">
          <h2 className="mb-3 text-[30px] font-semibold leading-[1.14] tracking-[-0.024em]">
            How it works
          </h2>
          <p className="mb-10 max-w-[66ch] text-base leading-[1.65] text-[color:var(--text-primary)]/85 text-pretty">
            ARF is not sold per seat. You start with evidence about your own agent, and pay only for the depth you
            need.
          </p>
          <div className="grid gap-[22px] md:grid-cols-3">
            {MODEL.map((item) => (
              <div
                key={item.n}
                className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-raised)] p-7"
              >
                <p className="mb-4 font-mono text-[11px] font-medium text-arf-blue">{item.n}</p>
                <h3 className="mb-2.5 text-lg font-semibold tracking-[-0.016em]">{item.title}</h3>
                <p className="text-small text-[color:var(--text-secondary)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="arf-shell pb-[112px]">
        <h2 className="mb-9 text-h2 font-semibold">Common questions</h2>
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
          {FAQ.map((item) => (
            <div key={item.q} className="border-t border-[color:var(--hairline)] pt-[22px]">
              <h3 className="mb-2.5 text-[17px] font-semibold leading-[1.35] tracking-[-0.014em]">{item.q}</h3>
              <p className="text-[15px] leading-[1.65] text-[color:var(--text-secondary)] text-pretty">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Closing CTA band ────────────────────────────────────────────── */}
      <section className="arf-dark-wash bg-arf-dark py-[88px]">
        <div className="arf-shell flex flex-wrap items-center justify-between gap-14">
          <div>
            <h2 className="mb-3 max-w-[20ch] text-h2 font-semibold text-white">
              Start in the sandbox. Bring your agent when you are ready.
            </h2>
            <p className="max-w-[56ch] text-base leading-[1.65] text-white/70 text-pretty">
              Tell us which agent, the production writes it makes or wants to make, and who is asking for controls.
              We reply within two business days.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[color:var(--color-arf-canvas)] px-6 py-[15px] text-[15.5px] font-semibold text-arf-ink transition hover:bg-white"
            >
              Request Pilot Access <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/30 px-6 py-[15px] text-[15.5px] font-semibold text-white transition hover:border-white/60"
            >
              Open Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TierBody({
  name,
  meta,
  price,
  note,
  items,
  cta,
  dominant,
}: {
  name: string;
  meta: string;
  price: string;
  note: string;
  items: readonly string[];
  cta: { label: string; href: string };
  dominant: boolean;
}) {
  return (
    <>
      <p className={`mb-1.5 font-semibold tracking-[-0.018em] ${dominant ? 'text-[21px]' : 'text-[19px]'}`}>{name}</p>
      <p className={`mb-5.5 font-mono text-[13px] ${dominant ? 'text-arf-blue' : 'text-[color:var(--text-muted)]'}`}>
        {meta}
      </p>
      <p className={`mb-1.5 font-semibold leading-none tracking-[-0.027em] ${dominant ? 'text-[32px]' : 'text-[30px]'}`}>
        {price}
      </p>
      <p className="mb-6 text-[13.5px] leading-[1.5] text-[color:var(--text-muted)]">{note}</p>
      <ul className="mb-6 flex flex-col gap-2.5 border-t border-[color:var(--hairline)] pt-5.5">
        {items.map((item) => (
          <li key={item} className="text-[14.5px] leading-[1.5] text-[color:var(--text-secondary)]">
            {item}
          </li>
        ))}
      </ul>
      {dominant ? (
        <Link
          href={cta.href}
          className="block rounded-[9px] bg-arf-blue bg-gradient-to-br from-arf-blue to-arf-purple py-3 text-center text-[14.5px] font-semibold text-white transition hover:brightness-110"
        >
          {cta.label}
        </Link>
      ) : (
        <Link
          href={cta.href}
          className="block rounded-[9px] border border-[color:var(--hairline)] py-2.5 text-center text-[14.5px] font-semibold transition hover:border-arf-blue hover:text-arf-blue"
        >
          {cta.label}
        </Link>
      )}
    </>
  );
}
