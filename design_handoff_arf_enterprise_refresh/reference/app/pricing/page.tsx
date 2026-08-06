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
   ========================================================================= */

export const metadata: Metadata = {
  title: 'Access models',
  description:
    'A fixed deployment fee, plus either outcome-based pricing or a monthly retainer. Pilot access is time-limited and free for qualified organisations.',
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
    name: 'Pilot',
    meta: 'Time-limited · free',
    price: 'By review',
    note: 'Every application read by the founder',
    items: [
      'Protected core access',
      'Real enforcement, not simulation',
      'Full technical specification',
      'Founder-led onboarding',
      'Outcome-based or retainer after pilot',
    ],
    cta: { label: 'Request pilot access', href: '/signup' },
    dominant: false,
  },
  {
    name: 'Enterprise',
    meta: 'Commercial · custom',
    price: 'Custom',
    note: 'Deployment fee + outcome or retainer',
    items: [
      'Everything in Pilot',
      'Custom deployment fee',
      'SSO, multi-tenancy, SLA',
      'Full enforcement + audit trails',
      'Named support engineer',
    ],
    cta: { label: 'Talk to us', href: '/signup' },
    dominant: true,
  },
] as const;

const COMPARISON = [
  { label: 'Evaluations', sandbox: '1,000 / month', pilot: 'Scoped to use case', enterprise: 'Contracted volume' },
  { label: 'Enforcement', sandbox: 'Simulated only', pilot: 'Real, deterministic', enterprise: 'Real, deterministic' },
  { label: 'Audit trail', sandbox: 'Sample records', pilot: 'Signed, exportable', enterprise: 'Signed + retention policy' },
  { label: 'Governance Console', sandbox: 'Mock data', pilot: 'Your decisions', enterprise: 'Multi-tenant, RBAC' },
  { label: 'Technical specification', sandbox: 'Public overview', pilot: 'Full, under NDA', enterprise: 'Full + integration support' },
  { label: 'SSO', sandbox: '—', pilot: '—', enterprise: 'SAML / OIDC via WorkOS' },
  { label: 'Support', sandbox: 'Community', pilot: 'Founder-led', enterprise: 'Named engineer + SLA' },
  { label: 'Commercials', sandbox: 'Free', pilot: 'Free, time-limited', enterprise: 'Deployment fee + outcome or retainer' },
] as const;

const MODEL = [
  {
    n: '01',
    title: 'Fixed deployment fee',
    body: 'Integration into your infrastructure, policy authoring, and the initial control-plane configuration. One-time, scoped in writing.',
  },
  {
    n: '02',
    title: 'Outcome-based or retainer',
    body: 'Then either a share of measured risk reduction, or a flat monthly retainer. You choose which at the end of the pilot.',
  },
  {
    n: '03',
    title: 'Pilot costs nothing',
    body: 'Time-limited and free for qualified organisations. No commitment, no auto-conversion — the commercial conversation happens after.',
  },
] as const;

const FAQ = [
  {
    q: 'Why is the pilot free?',
    a: 'Governance only proves itself against real decisions. A time-limited pilot lets your risk owners see enforcement and audit evidence on your own traffic before any commercial conversation.',
  },
  {
    q: 'What does outcome-based pricing measure?',
    a: 'Measured risk reduction against a baseline agreed at the start of the pilot — blocked high-risk actions, resolved exceptions, audit findings closed. If the measurement is contested, you take the retainer instead.',
  },
  {
    q: 'Can we run ARF in our own environment?',
    a: 'Yes. Enterprise deployments run inside your perimeter. The control plane never needs to send decision payloads outside your infrastructure.',
  },
  {
    q: 'What happens when the pilot ends?',
    a: 'Nothing automatic. There is no auto-conversion and no billing surprise — the pilot simply stops enforcing unless you sign an Enterprise agreement.',
  },
  {
    q: 'Is the sandbox safe to point at production data?',
    a: 'No. The sandbox returns simulated responses and should be treated as a demonstration surface. Use synthetic or redacted payloads.',
  },
  {
    q: 'How do you handle SSO and provisioning?',
    a: 'Enterprise plans use SAML or OIDC through WorkOS, with directory sync for provisioning. Sandbox and pilot use a single founder-issued credential.',
  },
] as const;

export default function PricingPage() {
  return (
    <div>
      {/* ─── Page header ─────────────────────────────────────────────────── */}
      <section className="arf-hero-wash">
        <div className="arf-shell pb-[72px] pt-[88px] text-center">
          <p className="arf-eyebrow mb-5">Access models</p>
          <h1 className="mx-auto mb-[22px] max-w-[19ch] text-[clamp(2.25rem,4.4vw,3.125rem)] font-bold leading-[1.05] tracking-[-0.031em] text-pretty">
            Priced against <span className="arf-gradient-text">governed outcomes</span>
          </h1>
          <p className="mx-auto max-w-[62ch] text-lg leading-[1.6] text-[color:var(--text-secondary)] text-pretty">
            A fixed deployment fee, plus either outcome-based pricing or a monthly retainer. Pilot access is
            time-limited and free for qualified organisations — no commitment required.
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
          <h2 className="max-w-[14ch] text-h2 font-semibold">What each model includes</h2>
          <p className="max-w-[54ch] self-end text-base leading-[1.65] text-[color:var(--text-secondary)] text-pretty">
            The difference that matters is enforcement: the sandbox advises, a pilot enforces. Everything else follows
            from that line.
          </p>
        </div>

        <div className="arf-card overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Capabilities available in the Sandbox, Pilot and Enterprise access models</caption>
            <thead>
              <tr className="border-b border-[color:var(--hairline)] bg-[color:var(--surface-sunken)]">
                <th scope="col" className="px-6 py-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-[color:var(--text-secondary)]">
                  Capability
                </th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">Sandbox</th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">Pilot</th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold text-arf-blue">Enterprise</th>
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
            How the commercial model works
          </h2>
          <p className="mb-10 max-w-[66ch] text-base leading-[1.65] text-[color:var(--text-primary)]/85 text-pretty">
            ARF is not sold per seat. Governance value scales with the volume and consequence of the decisions being
            governed, so the model has two parts.
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
              Start in the sandbox. Convert when the evidence is there.
            </h2>
            <p className="max-w-[56ch] text-base leading-[1.65] text-white/70 text-pretty">
              Pilot applications include your organisation, use case, and expected evaluation volume. We reply within
              two business days.
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
          className="block rounded-[9px] bg-gradient-to-br from-arf-blue to-arf-purple py-3 text-center text-[14.5px] font-semibold text-white transition hover:brightness-110"
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
