import { TierBody } from '@arf/ui';

// TierBody renders a bare fragment (p/p/p/ul/link) -- the app always wraps
// it in one of two card shells depending on `dominant`. Composing it inside
// those same shells here is the only render that's representative; a bare
// TierBody floating with no card around it isn't what ships.

export function StandardTier() {
  return (
    <div className="arf-card-light p-8" style={{ maxWidth: 320 }}>
      <TierBody
        name="Sandbox"
        meta="Simulation only"
        price="Free"
        items={['1,000 evaluations / month', 'Mock responses — not production', 'Community support']}
        cta={{ label: 'Try the sandbox', href: '#explore' }}
        dominant={false}
      />
    </div>
  );
}

export function DominantTier() {
  return (
    <div
      className="p-0.5"
      style={{
        maxWidth: 320,
        borderRadius: '1rem',
        background: 'linear-gradient(to bottom right, var(--color-arf-blue), var(--color-arf-purple))',
      }}
    >
      <div className="rounded-[14px] p-9" style={{ background: 'var(--surface-raised)' }}>
        <TierBody
          name="Enterprise"
          meta="Commercial · custom"
          price="Custom"
          items={[
            'Custom deployment fee',
            'Outcome-based or retainer maintenance',
            'SSO, multi-tenancy, SLA',
            'Full enforcement + audit trails',
          ]}
          cta={{ label: 'Talk to us', href: '/signup' }}
          dominant
        />
      </div>
    </div>
  );
}
