# ARF AI — landing page redesign rationale

Direction shipped: **hybrid of 1b + 1c** (option `2a` in `ARF AI Landing.dc.html`).
Files: `app/page.tsx`, `components/NavBar.tsx`, `app/layout.tsx`, `app/globals.css`.

---

## 1. What the redesign is solving

The previous page read as a research demo that had been re-labelled: dark-only,
one card style repeated fourteen times, uniform `py-20` between every section,
eight nav links, and a hero carrying nine competing elements. None of those are
copy problems — the messaging was already enterprise-positioned. They are
_hierarchy_ problems. Everything below is in service of one goal: a CTO or
compliance officer should know what ARF is, that it is enforced mechanically,
and that it produces evidence, within about three seconds of landing.

---

## 2. Type scale

**Instrument Sans** replaces the Tailwind default stack. It is a refined grotesk
that holds tight tracking at display sizes without the over-familiarity of Inter,
and it is self-hosted via `next/font`, so the strict CSP needs no new font-src.

One ramp, declared once in `@theme`, used everywhere:

| Token            | Size                   | Use                                |
| ---------------- | ---------------------- | ---------------------------------- |
| `text-display`   | 56px / 1.03 / −0.033em | hero H1 only                       |
| `text-h2-lg`     | 42px / 1.06 / −0.03em  | "Enterprise-grade governance" only |
| `text-h2`        | 36px / 1.10 / −0.026em | all other section heads            |
| `text-h3`        | 21px / 1.25 / −0.018em | card titles                        |
| `text-lead`      | 18.5px / 1.6           | hero subheadline                   |
| `text-body`      | 17px / 1.65            | body copy                          |
| `text-small`     | 14.5px / 1.6           | card body, list items              |
| `--text-eyebrow` | 11px mono, 0.14em      | section eyebrows, labels           |

Two supporting families, one job each. **Newsreader italic** appears exactly
once — the pull quote — so the serif reads as a deliberate editorial moment
rather than decoration. **JetBrains Mono** carries eyebrows, state labels and
code; it is what lets an infrastructure product feel technical _without_
reverting to a dark developer dashboard.

Negative tracking scales with size (−0.033em at 56px down to −0.012em at 15px).
Body copy sits at 17px/1.65 — the brief asked for 16–18px comfortable reading,
and 17px is the size at which a 48–56ch measure lands naturally at this width.

---

## 3. Spacing rhythm

The old page applied `px-4 py-20` to everything, so nothing read as more
important than anything else. The new rhythm is deliberately uneven — the eye
should accelerate through scannable bands and decelerate on proof:

```
hero              88 top / 104 bottom     generous, asymmetric
trust strip       46                      tight, dense, scannable
logo row          64 / 88
problem trio      112                     first real breath
who it's for      96                      added 2026-08-20, see §9
why ARF           96
why now           112  (inset gradient panel)
industries        120
capabilities      120                     airy
governance        104 on its own surface  ← most visual weight
quote band        104  dark, full-bleed
access models     112
explore ARF       104
footer            72
```

Two devices carry the hierarchy beyond padding:

1. **Surface changes** mark the two proof sections. "Enterprise-grade
   governance" sits on `--surface-raised` between hairlines; the quote band is
   full-bleed dark. Nothing else on the page changes surface, so both read as
   destinations.
2. **Cards no longer nest inside cards.** The old page wrapped every section in
   `bg-gray-800/90 rounded-2xl border`, then put cards inside it. Sections now
   sit directly on the canvas, separated by whitespace and hairlines. Card
   borders are reserved for things that are genuinely discrete objects.

A single gutter token (`.arf-shell`, max 1180px) means every section aligns
optically down the page.

---

## 4. Colour

Light is primary; dark is equal parity, not an afterthought.

| Role           | Light                     | Dark                    |
| -------------- | ------------------------- | ----------------------- |
| Canvas         | `#faf9f7` warm off-white  | `#0e0d12`               |
| Raised surface | `#ffffff`                 | `#17161d`               |
| Ink            | `#191816` warm near-black | `#faf9f7`               |
| Secondary      | `#56534d` (7.3:1)         | white/72                |
| Muted          | `#6b6862` (4.6:1)         | white/56                |
| Hairline       | `rgba(25,24,22,.09)`      | `rgba(250,249,247,.12)` |
| Accent         | `#3358e8 → #7a4be0`       | identical               |

Never pure black on pure white — warm grays read as considered at scale and stop
large text blocks from vibrating. Every muted tier clears WCAG AA at its
shipping size; the one retained sandbox disclaimer is deliberately _not_ the
faintest text on the page, because it is compliance-relevant copy.

The recognisable blue→purple gradient is **evolved, not discarded**. It survives
in exactly four places per page: the hero wash, the "autonomous AI" words in the
H1, the control-plane node in the architecture diagram, and the Enterprise tier
border. Everything else that used to be gradient or coloured is now neutral.
Semantic colour (red / green / yellow) is retired from decoration and kept only
for state — problem/solution/outcome labels and API response text.

---

## 5. Information architecture

**Navigation.** Eight links plus a CTA became four links plus two buttons:
Product · Docs · Pricing · Console, then Sign In (outlined) and Request Pilot
Access (filled gradient). History, Changelog, FAQ, Spec and the community links
moved to the footer. "Whitepaper (soon)" is gone — advertising a document that
does not exist costs credibility with exactly the buyer we want.

**Sign In** is outlined, not filled, and carries `data-workos="authkit-signin"`.
It currently routes to `/signup`; swapping in the AuthKit hosted URL is a
one-line change. Outlined-versus-filled is the whole point: it signals "a
product you log into" while keeping pilot access as the single loud CTA.

**Hero.** Nine elements became five: badge, headline, one subheadline, two CTAs,
and the decision-path panel. The version badge, pilot-review box, trust badges
and two of three sandbox disclaimers are gone from the hero. The panel — the
`1c` contribution to this hybrid — makes the abstract claim concrete: you can
see `Policies → Risk Engine → Approval` resolving with real-looking state before
you read a word of the body copy.

**Trust strip** sits immediately below the hero on dark: SOC 2 readiness,
deterministic enforcement, cryptographic audit trail. Dark rather than floating
white cards, because it anchors the fold and gives the page its first clear
horizontal band.

**Section order** (as of 2026-08-20: Problem → **Who it's for** → Why → Why Now
→ Industries → Architecture → Capabilities → Trust → Access Models → Demo →
Docs) with two consolidations: Interactive Demonstrations and Documentation
merged into a single **Explore ARF** section with three columns (API / Console
/ Specs), and the case-study quote elevated from `/dashboard` to a full-bleed
band between Capabilities and Access Models.

**Who it's for** (added 2026-08-20) sits right after the Problem/Solution/
Outcome trio, before Why ARF — "is this me" resolves before "why this
approach." Three `arf-card-light` cards (Platform & SRE leads, Security &
compliance leaders, teams adopting AI-driven operations), the same weight as
Explore ARF: this section sets context, it isn't proof, so it doesn't compete
with Governance/Capabilities for visual weight. Industries (built for
regulated enterprises) already answered "who" by vertical; this answers it by
role — the two are complementary, not redundant.

**Removed or moved:** the standalone Slack/GitHub bar below the hero (now footer
— it signalled open-source project, not enterprise product); two of the three
sandbox disclaimers (one remains, in the Explore ARF header); the `v4.3.2 —
Axiom` badge (now a footer link to `/changelog`).

---

## 6. Card design

Three weights replace the single `bg-gray-800/90 backdrop-blur rounded-2xl`
pattern, each with a job:

- **`.arf-card-substantial`** — capabilities and governance. Soft two-layer
  shadow, 1px hairline, hover lift of 2px with the shadow tinting toward blue.
  These are the "this is the product" cards and they should feel weighty.
- **`.arf-card-light`** — Explore ARF and the non-dominant pricing tiers. Same
  radius, much shallower shadow, no hover transform. Exploratory, secondary.
- **`.arf-card-anchored`** — the hero decision panel, trust strip and quote
  band. Dark, no border, deep shadow. Solid and immovable.

The Enterprise pricing column is dominant via a 2px gradient border and a blue
shadow, not a "Recommended" badge — the visual weight does the work.

---

## 7. Motion

Subtle and cheap: three scroll-revealed sections (capabilities, governance,
pricing) fade in with a 12px rise over 700ms via the existing
`hooks/useInView.ts`. Everything above the fold renders static — an enterprise
page should not make a buyer wait for an animation to read the value prop. All
motion is suppressed under `prefers-reduced-motion`.

---

## 8. Technical notes

- `hooks/useInView.ts` and `components/Mermaid.tsx` are unchanged and still used.
  The architecture section leads with a styled flow (accessible `<ol>`, real
  text) and keeps the Mermaid render inside a `<details>` as the canonical source
  diagram — so the diagram stays functional without being the weak visual.
- The sandbox `fetch` to `arf-ai-arf-sandbox-api.hf.space/v1/evaluate` is
  byte-for-byte the same call, with the same mount-guard and timer cleanup.
- No inline `<script>` for theme switching — the CSP forbids `unsafe-inline`, so
  the theme class is applied by `NavBar`'s client effect and persisted to
  `localStorage` under `arf-theme`. `color-scheme: light dark` on `<html>` keeps
  native controls correct pre-hydration. If you later relax CSP with a nonce, a
  blocking script removes the one-frame flash.
- `next/font` self-hosts all three families — no new `font-src` origin needed.
- All routes (`/dashboard`, `/pricing`, `/signup`, `/terms`, `/privacy`,
  `/changelog`, `/faq`, `/history`) are still linked, most from the footer.
- PWA (`manifest.json`, `sw.js`) untouched; `manifest` and `themeColor` are
  declared through the App Router `metadata` / `viewport` exports.
- Icons remain lucide-react. No new icon library.

---

## 9. Still open

- **Logos.** The trusted-by row is striped placeholders labelled as such. Supply
  real marks or drop the row — it should be monochrome and no more than five.
- **The quote is placeholder copy.** The visual pattern is what signals
  credibility; the words need a real attributable source before launch.
- **Pilot outcome stats** (100% / 42ms / 0) are marked illustrative. Replace with
  measured pilot numbers or remove the panel.
- **Dashboard.** The persistent, non-dismissible "This is a simulation" banner
  for `/dashboard` is specified in the brief but not in this pass — the
  `.arf-card-anchored` dark band with `#c3cfff` mono label is the pattern to use.
- **Pricing page.** `/pricing` should adopt the same three-tier treatment used
  in the Access Models section.
