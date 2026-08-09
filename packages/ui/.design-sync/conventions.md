# @arf/ui conventions

Five presentational components from arf-ai.com's marketing site:
`CapabilityCard`, `TierBody`, `SandboxCard`, `ConsoleCard`, `SpecsCard`. No
provider or context wrapper is required — every component takes all its
data through props, no internal state, no theme provider to mount.

## Links: the `renderLink` prop

`TierBody`, `ConsoleCard`, and `SpecsCard` render a CTA link and accept an
optional `renderLink` prop (a component type, e.g. React Router's `Link`,
or the string `'a'`). **Omit it and you get a plain `<a>`** — that's the
default and it's always correct for a static design. Only pass `renderLink`
if you're wiring the design into a real router and need client-side
navigation.

`TierBody` renders no shell of its own (just name/price/items/CTA) — the
real site always wraps it, in one of two shells depending on `dominant`:

```tsx
// dominant (the "Enterprise"-style highlighted tier)
<div className="p-0.5 rounded-2xl bg-gradient-to-br from-arf-blue to-arf-purple">
  <div className="rounded-[14px] p-9" style={{ background: 'var(--surface-raised)' }}>
    <TierBody name="Enterprise" meta="Commercial · custom" price="Custom"
      items={['SSO, multi-tenancy, SLA', 'Full enforcement + audit trails']}
      cta={{ label: 'Talk to us', href: '/signup' }} dominant />
  </div>
</div>

// non-dominant
<div className="arf-card-light p-8">
  <TierBody name="Sandbox" meta="Simulation only" price="Free"
    items={['1,000 evaluations / month', 'Community support']}
    cta={{ label: 'Try the sandbox', href: '#explore' }} dominant={false} />
</div>
```

`SandboxCard` has no links, but is stateful-by-props: pass `loading`,
`response`, `error`, and `copied` yourself along with `onTryLive`/`onCopy`
callbacks — it renders whichever state you hand it, it doesn't manage its
own.

## Styling idiom: Tailwind + a small `arf-*` class vocabulary

Utility-first Tailwind for layout/spacing/type, plus a fixed set of custom
component classes and CSS custom-property tokens — never invent new
`arf-*` names, use these:

**Card shells** (each component's own root already uses the right one —
only reach for these yourself when composing, e.g. wrapping `TierBody`):
`arf-card` (default), `arf-card-light` (the explore/demo weight —
`ConsoleCard`/`SpecsCard`/`SandboxCard` all use this), `arf-card-substantial`
(hover-lift weight, `CapabilityCard` uses this), `arf-card-anchored` (dark,
high-contrast surface).

**Buttons**: `arf-btn-primary` (filled gradient), `arf-btn-secondary`
(outlined), `arf-btn-ghost` (text-only, outlined on focus).

**Text**: `arf-eyebrow` (uppercase mono label), `arf-gradient-text`
(blue→purple gradient clip).

**Tokens** — CSS custom properties, both themes handled automatically
(`:root` = light, `.dark` = dark — never branch on theme yourself):
`--color-arf-blue`, `--color-arf-purple` (the only two accent hues, used
sparingly), `--surface-canvas`/`--surface-raised`/`--surface-sunken`
(background layers, light→dark), `--text-primary`/`--text-secondary`/
`--text-muted`, `--hairline` (border color). Reference them as
`text-[color:var(--text-secondary)]` or `border-[color:var(--hairline)]`,
matching every component's own source.

## Where the truth lives

`styles.css` (bound copy) carries the full token set and every `arf-*`
class — read it before styling anything these five components don't
already cover. Each component's own `.prompt.md` has its real prop
signature and usage examples ported directly from the live site
(`arf-ai.com`'s capabilities grid, pricing tiers, and Explore ARF section).

## Build snippet

`CapabilityCard`, `SandboxCard`, `ConsoleCard`, and `SpecsCard` each render
their own complete card shell already — don't wrap them in another
`arf-card-*` div. (`TierBody` is the one exception — see above.)

```tsx
<CapabilityCard n="01" title="Policy Enforcement" icon={Shield}
  description="Deterministic policy gates that cannot be bypassed."
  items={['Deterministic execution gates', 'Approval workflows']} />
```
