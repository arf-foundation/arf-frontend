# ARF Frontend

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://arf-frontend-sandy.vercel.app)

**Interactive frontend for the Agentic Reliability Framework (ARF)** – a Bayesian‑powered governance system for AI infrastructure. This repository contains a **public, sanitised demo dashboard** that illustrates ARF concepts. The core engine is **access‑controlled** and available only to qualified pilots and enterprise customers.

🔗 **Live demo:** [arf-frontend-sandy.vercel.app](https://arf-frontend-sandy.vercel.app)

> ⚠️ **Important** – The ARF core engine (`agentic_reliability_framework`, `arf-api`) is **not open source**. It is proprietary, access‑controlled, and offered under outcome‑based pricing. This frontend repo contains only public, demo‑grade code.

---

## Overview

ARF Frontend provides a user‑friendly dashboard to **visualise risk metrics, simulate incident evaluations, and explore governance decisions** – all using **demo data or the public sandbox API**. It showcases ARF capabilities without exposing the protected Bayesian inference engine.

**Key features**:
- 📊 Real‑time system risk monitoring (demo data)
- 🧠 Memory graph statistics (cached demo values)
- 📈 Historical risk chart (synthetic data)
- 🧪 Incident evaluation form – calls the **public sandbox API** (sanitised, rate‑limited) and displays risk scores, recommended actions, and explanations.
- 🤖 **Institutional Memory Agent** (`/agent`) - paste an incident description, get a structured governance evaluation (risk score, execution mode, gating rationale) back from a live Claude-backed endpoint. Public and unauthenticated.
- 🔗 Links to pilot access request

---

## Getting Started (for local development)

### Prerequisites
- Node.js **20.9+** and `yarn` / `npm` — this is Next.js's own floor (`next` declares `engines.node: ">=20.9.0"`), and what CI installs (`.github/workflows/test.yml` pins `node-version: 20`). Node 18 will fail the documented install step.

### Installation
```bash
git clone https://github.com/arf-foundation/arf-frontend.git
cd arf-frontend
yarn install
```

### Environment Variables

**No environment variables are required to run the dashboard itself** (`yarn dev`). The sandbox API URL is hardcoded via Next.js rewrites (see next.config.ts). If you wish to change the API target, modify the rewrites section in next.config.ts.

Two API routes need credentials to work in production, and are inert (or error) without them locally:

| Route | Requires | Purpose |
|---|---|---|
| `POST /api/pilot-request` | `NOTION_API_KEY`, `NOTION_DATABASE_ID` | Writes pilot signup submissions to Notion |
| `POST /api/chat` (used by the `/agent` page) | Vercel Connect connector (`VERCEL_OIDC_TOKEN`, injected automatically on Vercel deploys) | Calls Claude for the public Institutional Memory Agent demo |

`POST /api/chat`, `POST /api/pilot-request`, and `POST /api/report` are all
public and unauthenticated, and are rate-limited (see `lib/rate-limit.ts`).
Optionally set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (a
free Upstash Redis database) for a real cap enforced across every
serverless instance; without them, rate limiting falls back to an
in-memory counter scoped to one warm instance — soft, not a hard guarantee,
but not broken either.

### Run the development server

```bash
yarn dev
```

The dashboard will be available at http://localhost:3000.

## Architecture & Data Flow

- **Next.js rewrites** – All `/api/v1/*` requests are proxied to the public sandbox API (`https://arf-ai-arf-sandbox-api.hf.space`). No API keys are exposed.
- **Sandbox API** – Returns a sanitised, mock evaluation (rate‑limited, no real Bayesian inference). The frontend transforms the sandbox response into the `EvaluateResponse` format used by the UI.
- **Mock data** – Components like `RecentDecisions`, `MemoryStats`, and `RiskChart` use local mock data because the sandbox does not provide history or memory endpoints.
- **Institutional Memory Agent** (`/agent`) – `POST /api/chat` calls Claude directly via a Vercel Connect connector, using the deterministic evaluation prompt in `app/api/chat/prompt.txt`. This is a real LLM call, separate from the sandbox API and from the protected ARF engine.

> The live dashboard **never** calls the protected ARF engine. All data is either from the public sandbox, a direct Claude call (`/agent`), or generated locally.

## Public vs. Private – What This Repo Is (and Isn’t)

| ✅ **This repo (public)** | ❌ **Not included / private** |
|---------------------------|-------------------------------|
| Demo UI components | Core Bayesian inference engine |
| Sandbox API integration | Real risk scoring logic |
| Sanitised visualisations | Production control plane |
| Public specification references | Customer‑specific audit trails |
| Pilot request form | Outcome‑based pricing implementation |

## Related Projects (Public Only)

| Project | Description | Access |
|---------|-------------|--------|
| [`arf-risk-demo`](https://github.com/arf-foundation/arf-risk-demo) | Public, client-side risk-scoring demo | Public (Apache 2.0) |
| [`pitch-deck`](https://github.com/arf-foundation/pitch-deck) | Public overview and vision | Public |
| **arf-spec** | Canonical data models, API contracts | **Access‑controlled** – pilot only |
| **Core Engine** | Bayesian risk scoring, semantic memory | **Access‑controlled** – pilot only |
| **API Control Plane** | Production FastAPI service | **Access‑controlled** – pilot only |

📌 **For pilot access, please [request here](https://arf-frontend-sandy.vercel.app/signup).**

## Contributing (to this public repo only)

We accept **limited contributions** to this public frontend repository (bug fixes, documentation, demo improvements).  
**We do not accept pull requests against the private core engine or API.**

1. Open an issue describing your proposed change.
2. Wait for a maintainer to assign the issue.
3. Sign a Contributor License Agreement (CLA) if requested.
4. Submit a pull request referencing the issue.

All changes are reviewed and merged at the founder’s discretion.

For questions about pilot access or enterprise licensing, email **juan@arf-ai.com**.

## Known Limitations & Troubleshooting

### Sandbox API Limitations
- The public sandbox API is **rate‑limited** and returns **simulated responses only**. It does **not** perform real Bayesian inference or access the protected ARF engine.
- The sandbox does **not** provide history (`/v1/history`) or memory (`/v1/memory/stats`) endpoints. Consequently, components like `RecentDecisions` and `MemoryStats` use local mock data.
- Evaluation responses are transformed from the sandbox’s `recommendation` and `justification` fields into the `EvaluateResponse` shape expected by the frontend. The confidence interval and epistemic uncertainty are derived heuristically.

### Build & Deployment Issues
- **Private repository on Vercel Hobby plan:** Vercel’s free plan does **not** support private repositories owned by an organization. If you encounter deployment failures after making the repo private, either upgrade to Vercel Pro or make the repository public.
- **Missing environment variables:** The frontend does **not** require `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_USE_MOCK_DATA`. These variables are ignored. The API target is hardcoded in `next.config.ts` rewrites.
- **Service worker errors:** If you see `getInstalledRelatedApps` errors in the console, they are suppressed by an inline script in `layout.tsx` and by disabling PWA in `next.config.ts`. This does not affect functionality.
- **`yarn build` fails on Windows.** The script is `yarn workspace @arf/ui build && NEXT_TURBOPACK_BUILD=0 next build`, and yarn runs it through `cmd.exe`, which cannot parse the POSIX env-var prefix:

  ```
  'NEXT_TURBOPACK_BUILD' is not recognized as an internal or external command
  ```

  The `@arf/ui` half succeeds first, so it reads as a Next.js problem rather than a shell one. CI and Vercel build on Linux, so this is local-only and not worth changing `package.json` over. Run the two halves by hand in Bash instead:

  ```bash
  yarn workspace @arf/ui build
  NEXT_TURBOPACK_BUILD=0 npx next build
  ```

- **`@arf/ui` changes need that first half.** The app resolves `@arf/ui` through its `main` field (`packages/ui/dist/index.js`), not `src/`, so editing `packages/ui/src/*.tsx` has no effect until `yarn workspace @arf/ui build` runs. `packages/*/dist` is gitignored and regenerated during Vercel's build.

### Development Workflow
- After cloning, run `yarn install` and `yarn dev`. No additional configuration is needed.
- To test the sandbox API integration locally, ensure you have an internet connection – the frontend will call `https://arf-ai-arf-sandbox-api.hf.space/v1/evaluate`.
- If you need to point to a different API backend, modify the `rewrites` section in `next.config.ts`.
- **Verifying a visual or contrast change locally.** Screenshots are not enough for contrast work, and a browser-extension automation may refuse to execute JavaScript on `localhost`. `playwright-core` is already a devDependency and can drive the system Chrome with no browser download:

  ```js
  const { chromium } = require("playwright-core");
  const browser = await chromium.launch({ channel: "chrome" });
  ```

  Read `getComputedStyle` values and compute WCAG ratios from them rather than eyeballing a screenshot. Normalise colours through a 1×1 canvas first — computed styles come back as `rgb()`, `rgba()` **and** `oklab(... / a)`, and an `oklab` value silently breaks a naive `rgb`-only parser. Composite any alpha over the nearest opaque ancestor before computing the ratio.
- **Theme-dependent bugs need both themes.** The theme is `localStorage['arf-theme']`, falling back to `prefers-color-scheme`. A fresh origin (`localhost` vs production) therefore follows the OS, so a bug that only appears in light mode can be invisible locally on a dark-mode machine. Seed it explicitly before load — `addInitScript(() => localStorage.setItem('arf-theme', 'light'))`.

### Reporting Issues
- For bugs in the public frontend, please open an issue on GitHub.
- For questions about the protected core engine or pilot access, email **juan@arf-ai.com**.

## License

This repository (`arf-frontend`) is licensed under the **Apache 2.0 License** – see the [LICENSE](LICENSE) file for details.

> **Note:** The Apache 2.0 license applies **only** to the code in this repository. It does **not** cover the ARF core engine, which is proprietary and access‑controlled.

## Community & Contact

- 📬 **Email:** [juan@arf-ai.com](mailto:juan@arf-ai.com)
- 💬 **Slack:** [Join workspace](https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg)
- 🔗 **LinkedIn:** [Juan Petter](https://www.linkedin.com/in/petterjuan/)
- 📅 **Book a call:** [Calendly](https://calendly.com/petter2025us/30min)

## Acknowledgements

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Lucide icons](https://lucide.dev/).  
The ARF core engine is developed by the ARF Foundation and stewarded by the founder.
