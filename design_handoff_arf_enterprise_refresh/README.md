# Handoff: ARF AI enterprise refresh (landing + pricing)

**Target repo:** `arf-foundation/arf-frontend` · **Branch to create:** `redesign/enterprise-refresh`
**Deliverable:** a pull request against `main`. Do not push directly — CodeQL and "Test Frontend" run on every push to `main`.

---

## Overview

The ARF AI marketing site was repositioned from a research-era demo to an enterprise
infrastructure product, but the visual layer never followed: dark-only, one card style
repeated everywhere, uniform `py-20` between all sections, eight nav links, and a hero
carrying nine competing elements.

This handoff redesigns **`/` (landing)** and **`/pricing`**, plus the shared **NavBar**,
**layout** and **globals.css**, into a light-primary enterprise system with an equal-parity
dark theme. Messaging is preserved almost verbatim — the changes are hierarchy, rhythm,
theme and information architecture, not copy.

---

## About the design files

`design/ARF AI Landing.dc.html` is a **design reference created in HTML** — a prototype of
the intended look, not production code. Open it in a browser to see three exploratory
directions plus the two shipping designs.

`reference/` contains **Next.js/TypeScript implementations already written against the
target stack** (App Router, Tailwind CSS 4, lucide-react). They are close to drop-in, but
they were written without reading the live repo. **Verify against the real files before
committing** — see "Verify before you commit" below.

The task: land these designs in `arf-frontend` using its established patterns. Prefer
adapting the reference files over rewriting from the HTML.

## Fidelity

**High-fidelity.** Final colours, type scale, spacing rhythm, and interaction states.
Recreate faithfully. Where the repo already has a working pattern (e.g. `Mermaid.tsx`,
`hooks/useInView.ts`), use the repo's version rather than reimplementing.

---

## Verify before you commit

These are assumptions made without repo access. Check each one first:

1. **Tailwind version.** The reference CSS uses Tailwind 4 syntax (`@import "tailwindcss"`,
   `@theme`, `@layer components` with `@apply`). If `package.json` pins Tailwind 3.x,
   port the `@theme` block to `tailwind.config.ts` → `theme.extend` and keep the CSS
   custom properties in `:root` / `.dark` as-is.
2. **`app/globals.css` is currently non-empty** ("Refactor global styles", ~2 months ago).
   The reference file assumes a wholesale replace. Diff first — dashboard components may
   depend on existing utility classes. If they do, append the ARF token layer instead of
   replacing.
3. **`app/layout.tsx` contains an inline script** suppressing `getInstalledRelatedApps`
   service-worker errors. The reference layout drops it and applies the theme class from a
   client effect instead, because the brief says CSP forbids `unsafe-inline`. If inline
   scripts are in fact permitted (nonce or existing allowance), **prefer a blocking theme
   script** — it removes a one-frame light flash for dark-mode users on every load.
4. **Import paths.** The reference uses `./hooks/useInView` (i.e. `app/hooks/useInView.ts`)
   and `../components/Mermaid`, matching the current `app/page.tsx`. Confirm; `tsconfig.json`
   also defines an `@` alias that may be preferred.
5. **`next/font`.** The reference adds Instrument Sans, Newsreader and JetBrains Mono via
   `next/font/google` (self-hosted, so no CSP `font-src` change). Confirm this is acceptable
   before adding three font payloads.
6. **`components/NavBar.tsx` was updated two weeks ago.** The reference rewrites it. Read the
   current file first and preserve anything it does that the reference doesn't (analytics,
   active-route highlighting, etc.).
7. **PWA.** `manifest.json` and `sw.js` must keep working. The reference declares `manifest`
   and `themeColor` through the App Router `metadata` / `viewport` exports — check this does
   not conflict with the existing PWA setup in `next.config.ts`.
8. **`yarn lint && yarn build` must pass.** Non-negotiable.

---

## Screens / views

### 1. Landing — `app/page.tsx`

Section order is unchanged from the current site. Two consolidations and one elevation:
"Interactive Demonstrations" + "Documentation" merged into a single **Explore ARF**
(API / Console / Specs), and the testimonial moved up from `/dashboard` to a full-bleed band.

| # | Section | Vertical padding | Surface | Notes |
|---|---|---|---|---|
| 1 | Hero | 88 top / 104 bottom | canvas + `.arf-hero-wash` | 2-col: copy left (1.05fr), decision panel right (0.95fr), gap 64 |
| 2 | Trust & compliance strip | 46 | `#131218` dark | 3 cols, gap 40, icon + title + one sentence |
| 3 | Trusted-by logo row | 64 / 88 | canvas | 5 striped placeholders, 104×24, gap 48, centred |
| 4 | Problem / Solution / Outcome | 112 bottom | white card | 3 cols split by hairlines, 40px cell padding |
| 5 | Why ARF? | 96 bottom | canvas | 2-col `0.9fr 1.1fr`, gap 64, heading left |
| 6 | Why now? | 112 bottom | gradient-tint panel, radius 18, padding 60/56 | same 2-col split |
| 7 | Industries | 120 bottom | canvas | pill row, wrap, gap 10 |
| 8 | Architecture | 120 bottom | white card, padding 44 | styled flow + Mermaid in `<details>` |
| 9 | Capabilities | 120 bottom | canvas | 2×2 grid, gap 22, `.arf-card-substantial` |
| 10 | **Enterprise-grade governance** | 104 | `--surface-raised` between hairlines | the proof section — most visual weight, 42px heading |
| 11 | Testimonial + metrics | 104 | `#131218` + `.arf-dark-wash` | 2-col `1.15fr 0.85fr`, serif italic quote |
| 12 | Access models | 112 | canvas | 3 tiers, Enterprise dominant |
| 13 | Explore ARF | 104 bottom | canvas | 3 cols `1.2fr 0.9fr 0.9fr`, `.arf-card-light` |
| 14 | Footer | 72 top / 32 bottom | `#131218` | 5 cols `1.4fr repeat(4,1fr)`, gap 44 |

**Hero — distilled from nine elements to five.** Removed: the `v4.3.2 — Axiom` version badge
(now a footer link to `/changelog`), the pilot-access info box, the floating trust badges
(now section 2), and two of the three sandbox disclaimers. Kept:

- Pill badge — "Control plane for autonomous AI", 11px JetBrains Mono, `0.12em`, uppercase,
  `#3358e8`, 6/13 padding, 100px radius, white/75 fill, `1px solid rgba(51,88,232,.22)`,
  leading 5px blue dot.
- H1 — `clamp(2.5rem, 5vw, 3.5rem)`, weight 700, line-height 1.03, tracking `-0.033em`,
  `max-width: 15ch`. Copy: "Enterprise infrastructure for **autonomous AI**", where the last
  two words carry the gradient via `.arf-gradient-text`.
- One subheadline — 18.5px / 1.6, `--text-secondary`, `max-width: 48ch`:
  *"Safely deploy autonomous AI in production with deterministic governance, continuous
  reliability, and enterprise-grade auditability."*
- Two CTAs — `.arf-btn-primary` "Request Pilot Access" (gradient fill, arrow icon) and
  `.arf-btn-secondary` "Open Governance Console" → `/dashboard`.
- **Decision panel** (right) — dark card, radius 16, padding 26,
  `box-shadow: 0 40px 80px -40px rgba(19,18,24,0.75)`, radial blue wash at 80% 0%.
  Header row: "Decision path" / "evaluate · 42ms" in 10.5px mono, white/60 and white/50.
  Then rows `01 Application · client`, `02 LLM / AI Agent · probabilistic`; an inset
  control-plane block (`border: 1px solid rgba(122,75,224,.5)`, blue→purple 25%/20% fill,
  radius 12) holding `Policies · matched`, `Risk Engine · scored 0.31`, `Approval · granted`
  with state values in `#9fe7b8`; then `06 Execution · gated`, `07 Audit Trail · signed`.
  Row style: `rgba(255,255,255,.06)`, radius 10, padding 13/15.

**Trust strip** — dark, full-bleed, three columns: *Architected for SOC 2 readiness* /
*Deterministic enforcement* / *Cryptographic audit trail*. lucide icons at 24px,
`strokeWidth 1.5`, `#7fa0ff`. Title 15.5px/600, body 13.5px/1.55 white/70. Dark rather than
floating white cards because it anchors the fold and gives the page its first hard band.

**Architecture** — leads with a semantic `<ol>` flow (real text, accessible): two input nodes
on `--surface-sunken`, a gradient control-plane node at `flex: 2.2` holding Policies / Risk
Engine / Approval, then two output nodes. The Mermaid render is kept inside
`<details><summary>View source diagram</summary>` so the component stays functional without
being the weak visual. **Do not delete `components/Mermaid.tsx`.**

**Capabilities** — four `.arf-card-substantial`, padding 36. Header row: 34×34 icon tile
(radius 10, `border: 1px solid rgba(51,88,232,.25)`, blue/purple 15% gradient fill, lucide
icon 18px `#3358e8`) left, mono index `01`–`04` right. Title 21px/600/`-0.018em`, description
15.5px/1.6, then a 2-col bullet list above a hairline, 13.5px, 4px purple dots.
Icons: `Shield`, `FileText`, `Cpu`, `Network`.

**Governance** — its own surface between hairlines, 42px heading (`--text-h2-lg`), 3 cards on
`--surface-canvas`. 40×40 gradient icon tiles: rounded square, circle, rotated square.
Icons: `FileText`, `Lock`, `Brain`.

**Testimonial band** — dark + `.arf-dark-wash`. Quote in **Newsreader italic 300**,
`clamp(1.75rem, 3vw, 2.125rem)`, line-height 1.35. Attribution: striped 38px circle avatar
placeholder + "Head of AI Platform" / "Tier-1 financial services · pilot organisation".
Right: metrics panel `rgba(255,255,255,.06)` + `1px solid rgba(255,255,255,.15)` —
**100%** / **42ms** / **0** at 32px semibold, separated by white/15 rules.
Eyebrow reads "Pilot feedback · placeholder quote" and "Pilot outcome · illustrative" —
**keep those qualifiers until real numbers are approved.**

**Explore ARF** — one sandbox disclaimer lives here, in the section header, at 13.5px
`--text-secondary` (deliberately *not* the faintest text on the page; it is compliance copy).
Three `.arf-card-light`:
- *API* — curl block on `#131218` with `#9fe7b8` text, 11.5px mono; "Try it live" (gradient)
  and "Copy curl" (outlined) buttons; response JSON and error render below.
- *Console* — a small simulation-strip mock, then "Open console →" `/dashboard`.
- *Specs* — four rows (Core Governance Engine, API Control Plane, Enterprise Layer,
  Enterprise Specification), each tagged `pilot only`, then "Request specifications →".

**Footer** — 5 columns: brand + email button, then Product / Resources / Company / Community.
**Slack and GitHub live here now**, not in a bar under the hero — a standalone community bar
signals open-source project, not enterprise product. Bottom bar carries the GitHub Enterprise
lockup, `v4.3.2 — Axiom` linking to `/changelog`, and the copyright.

### 2. Pricing — `app/pricing/page.tsx`

Server component; no hooks needed.

1. **Header** — `.arf-hero-wash`, 88/72, centred. Eyebrow "Access models"; H1
   `clamp(2.25rem, 4.4vw, 3.125rem)` "Priced against **governed outcomes**" (gradient on the
   last two words); 18px sub, `max-width: 62ch`.
2. **Three tiers** — identical treatment to the landing section. Sandbox / Pilot free-form,
   **Enterprise dominant via a 2px gradient border** (`p-0.5` gradient wrapper + inner
   `rounded-[14px]` surface) and a blue shadow — *not* a "Recommended" badge.
3. **Comparison table** — 8 rows in `.arf-card`, `overflow-x-auto`, `min-width: 720px`.
   Semantic `<table>` with `<caption class="sr-only">`, `<th scope="col">` headers and
   `<th scope="row">` row labels. Header row on `--surface-sunken`; the Enterprise column
   header is `#3358e8`. The section's whole argument is one line, stated in the intro:
   *the sandbox advises, a pilot enforces.*
4. **Commercial model** — gradient-tint panel, radius 18, padding 56; three white cards
   (`01` fixed deployment fee / `02` outcome-based or retainer / `03` pilot costs nothing).
5. **FAQ** — six Q&A in a 2-col grid, `gap: 40px 56px`, each with a hairline top rule.
6. **Closing CTA band** — dark + `.arf-dark-wash`, 88 padding, heading left, two buttons right
   (canvas-fill "Request Pilot Access", outlined "Open Console").

---

## Interactions & behavior

- **Sandbox API.** `POST https://a-r-f-arf-sandbox-api.hf.space/v1/evaluate`, body
  `{service_name:'api', event_type:'latency', severity:'high', metrics:{latency_ms:450}}`.
  Byte-for-byte the current call, with the same `isMounted` guard and timer cleanup.
  Loading → "Evaluating…" + disabled; success → JSON in a dark `<pre>`; failure →
  "Failed to reach sandbox: {message}".
- **Copy curl.** `navigator.clipboard.writeText`, label flips to "Copied" for 2s; on
  rejection a toast reads "Could not copy the curl command" for 2s.
- **Theme toggle** (NavBar). Reads `localStorage['arf-theme']`, falls back to
  `prefers-color-scheme`, toggles `.dark` on `<html>`, persists. Wrapped in try/catch —
  private-mode storage failures must not break the toggle.
- **Scroll reveals.** Three sections only (capabilities, governance, pricing) via the existing
  `hooks/useInView` at `threshold: 0.15, once: true`: `.arf-reveal` → `.arf-reveal-in`,
  opacity 0→1 with a 12px rise over 700ms ease-out. **Nothing above the fold animates** — an
  enterprise buyer should not wait on a transition to read the value prop. All motion is
  suppressed under `prefers-reduced-motion`.
- **Card hover.** `.arf-card-substantial` lifts 2px and its shadow tints toward blue.
  `.arf-card-light` has no transform.
- **Nav.** Sticky, `backdrop-blur-md`, canvas at 85% alpha, hairline bottom border. Below
  `md` the four links collapse into a toggle menu.
- **Responsive.** All multi-column grids collapse to one column at the `md` breakpoint. The
  comparison table scrolls horizontally rather than reflowing.

## State management

Landing (`'use client'`): `copied`, `copyError`, `sandboxLoading`, `sandboxResponse`,
`sandboxError`, plus `isMounted` and a `timers` ref cleared on unmount.
NavBar (`'use client'`): `theme`, `mobileOpen`.
Pricing: none — server component.

---

## Design tokens

**Colour — light (primary)**

| Role | Value | Notes |
|---|---|---|
| Canvas | `#faf9f7` | warm off-white |
| Raised surface | `#ffffff` | |
| Sunken | `#f5f4f1` | |
| Ink | `#191816` | warm near-black, never `#000` |
| Secondary | `#56534d` | 7.3:1 — body, small mono labels |
| Muted | `#6b6862` | 4.6:1 — eyebrows only |
| Hairline | `rgba(25,24,22,.09)` | |
| Dark surface | `#131218` | trust strip, quote band, footer |
| Accent blue | `#3358e8` | |
| Accent blue deep | `#2743c4` | |
| Accent purple | `#7a4be0` | |
| Gradient | `linear-gradient(135deg, #3358e8, #7a4be0)` | 100deg for text clip |
| Error / problem | `#b0453a` | |
| Terminal green | `#9fe7b8` | code blocks only |

**Colour — dark:** canvas `#0e0d12`, raised `#17161d`, sunken `#1d1c25`, ink `#faf9f7`,
secondary `white/72`, muted `white/56`, hairline `rgba(250,249,247,.12)`. **The accent
gradient is identical in both themes.**

> Every muted tier clears WCAG AA at its shipping size. Do not reintroduce the paler greys
> (`#a8a49b`, `#8a867e`, `#c2beb4`) that an earlier pass used — they failed at 2.4–3.5:1.

**Type**

| Token | Size / line-height / tracking | Use |
|---|---|---|
| `--text-display` | 56px / 1.03 / −0.033em | hero H1 only |
| `--text-h2-lg` | 42px / 1.06 / −0.030em | governance heading only |
| `--text-h2` | 36px / 1.10 / −0.026em | all other section heads |
| `--text-h3` | 21px / 1.25 / −0.018em | card titles |
| `--text-lead` | 18.5px / 1.6 | hero subheadline |
| `--text-body` | 17px / 1.65 | body copy |
| `--text-small` | 14.5px / 1.6 | card body, list items |
| eyebrow | 11px mono / 0.14em / uppercase | section labels |

Families: **Instrument Sans** (400/500/600/700) for everything UI; **Newsreader italic**
(300) used *exactly once*, in the pull quote; **JetBrains Mono** (400/500) for eyebrows,
state labels and code. Negative tracking scales with size — −0.033em at 56px down to
−0.012em at 15px.

**Spacing** — section rhythm is deliberately uneven; the eye should accelerate through
scannable bands and decelerate on proof:
`46 · 64 · 72 · 88 · 96 · 104 · 112 · 120` (px). Tokens: `--spacing-section-tight: 72px`,
`--spacing-section: 104px`, `--spacing-section-airy: 120px`.
Page shell `.arf-shell`: `max-width: 1180px`, gutters `24 / 40 / 76px` at `base / sm / lg`.

**Radius** — 8 buttons · 9 tier CTAs · 10–11 small tiles and rows · 14 inner dominant card ·
16 cards and panels · 18 tinted section panels · 100 pills.

**Shadow**
- card: `0 2px 4px rgba(25,24,22,.03), 0 20px 44px -28px rgba(25,24,22,.42)`
- card hover: `0 4px 8px rgba(25,24,22,.05), 0 30px 60px -30px rgba(51,88,232,.5)`
- light card: `0 16px 34px -28px rgba(25,24,22,.4)`
- primary button: `0 16px 34px -16px rgba(51,88,232,.75)`
- dominant tier: `0 30px 60px -30px rgba(51,88,232,.6)`
- decision panel: `0 40px 80px -40px rgba(19,18,24,.75)`

**Three card weights** replace the single `bg-gray-800/90 backdrop-blur rounded-2xl border`
pattern — this is the change that does the most work:

| Class | Where | Feel |
|---|---|---|
| `.arf-card-substantial` | capabilities, governance | weighty; soft two-layer shadow, 2px hover lift |
| `.arf-card-light` | Explore ARF, non-dominant tiers | exploratory; shallow shadow, no hover transform |
| `.arf-card-anchored` | decision panel, trust strip, quote band | solid; dark, borderless, deep shadow |

Sections no longer nest cards inside cards. They sit on the canvas, separated by whitespace
and hairlines; borders are reserved for genuinely discrete objects.

---

## Assets

- `/ARF - Transparent Primary Logo.png` and `/GitHub_Lockup_White.svg` — already in `public/`.
- **Icons: lucide-react only.** No new icon library. Used: `ArrowRight`, `Brain`, `Building2`,
  `Check`, `Copy`, `Cpu`, `Factory`, `FileText`, `Globe`, `HeartPulse`, `Landmark`, `Lock`,
  `Menu`, `Moon`, `Network`, `Rocket`, `Shield`, `Sun`, `X`.
- **Trusted-by logos are striped CSS placeholders labelled "logo placeholders".** Ship real
  monochrome marks or delete the row — do not ship the placeholders to production.

---

## Files in this bundle

```
DESIGN_RATIONALE.md                  why each decision was made — read this second
design/ARF AI Landing.dc.html        HTML design reference (open in a browser)
design/support.js                    runtime for the .dc.html file
reference/app/page.tsx               landing implementation
reference/app/pricing/page.tsx       pricing implementation
reference/app/layout.tsx             fonts, metadata, viewport, skip link
reference/app/globals.css            Tailwind 4 tokens, themes, card weights
reference/components/NavBar.tsx      4 links + outlined Sign In + theme toggle
```

The `.dc.html` also contains three earlier exploratory directions (`1a` editorial calm,
`1b` gradient anchor, `1c` diagram-led). **`2a` is the approved hybrid and the one these
files implement**; `3a` is the pricing page. The others are context only — do not build them.

---

## Open items (flag to the founder, do not invent answers)

- **Testimonial quote is placeholder copy.** The visual pattern signals credibility; the words
  need a real attributable source before launch.
- **Pilot metrics** (100% / 42ms / 0) are marked illustrative. Replace with measured numbers
  or remove the panel.
- **Trusted-by logos** — real marks, or drop the row.
- **WorkOS AuthKit** is not wired. `Sign In` carries `data-workos="authkit-signin"` and points
  at `/signup`; swap in the hosted URL when provisioned.
- **The pricing comparison table and FAQ contain inferred commercial claims** — particularly
  the SSO row (SAML/OIDC via WorkOS, Enterprise only) and the outcome-based measurement
  answer. **Get these confirmed before merging.**
- **Not in this pass:** `/dashboard` still needs its persistent, non-dismissible
  "This is a simulation" banner. Use `.arf-card-anchored` with a `#c3cfff` mono label. Also
  unported: `/signup`, `/faq`, `/changelog`, `/history`, `/terms`, `/privacy`.

## Suggested PR

Branch `redesign/enterprise-refresh`, one PR, files:
`app/page.tsx` · `app/pricing/page.tsx` · `app/layout.tsx` · `app/globals.css` ·
`components/NavBar.tsx`. Confirm `yarn lint` and `yarn build` pass, and check the Vercel
preview in both themes at 375 / 768 / 1440 before requesting review.
