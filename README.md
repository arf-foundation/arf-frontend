# ARF Frontend – Public Demo Dashboard

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://arf-frontend-sandy.vercel.app)

**Interactive frontend for the Agentic Reliability Framework (ARF)** – a Bayesian‑powered governance system for AI infrastructure. This repository contains a **public, sanitised demo dashboard** that illustrates ARF concepts. The core engine is **access‑controlled** and available only to qualified pilots and enterprise customers.

🔗 **Live demo:** [arf-frontend-sandy.vercel.app](https://arf-frontend-sandy.vercel.app)  
📖 **Specification:** [arf-spec](https://github.com/arf-foundation/arf-spec)

> ⚠️ **Important** – The ARF core engine (`agentic_reliability_framework`, `arf-api`) is **not open source**. It is proprietary, access‑controlled, and offered under outcome‑based pricing. This frontend repo contains only public, demo‑grade code.

---

## Overview

ARF Frontend provides a user‑friendly dashboard to **visualise risk metrics, simulate incident evaluations, and explore governance decisions** – all using **demo data or the public sandbox API**. It showcases ARF capabilities without exposing the protected Bayesian inference engine.

**Key features**:
- 📊 Real‑time system risk monitoring (demo data)
- 🧠 Memory graph statistics (cached demo values)
- 📈 Historical risk chart (synthetic data)
- 🧪 Incident evaluation form – calls the **public sandbox API** (sanitised, rate‑limited) and displays risk scores, recommended actions, and explanations.
- 🔗 Links to pilot access request

---

## Getting Started (for local development)

### Prerequisites
- Node.js 18+ and `yarn` / `npm`

### Installation
```bash
git clone https://github.com/arf-foundation/arf-frontend.git
cd arf-frontend
yarn install
```

### Environment Variables

**No environment variables are required** for the frontend to work. The sandbox API URL is hardcoded via Next.js rewrites (see next.config.ts).If you wish to change the API target, modify the rewrites section in next.config.ts.

### Run the development server

```bash
yarn dev
```

The dashboard will be available at http://localhost:3000.

## Architecture & Data Flow

- **Next.js rewrites** – All `/api/v1/*` requests are proxied to the public sandbox API (`https://A-R-F-ARF-Sandbox-API.hf.space`). No API keys are exposed.
- **Sandbox API** – Returns a sanitised, mock evaluation (rate‑limited, no real Bayesian inference). The frontend transforms the sandbox response into the `EvaluateResponse` format used by the UI.
- **Mock data** – Components like `RecentDecisions`, `MemoryStats`, and `RiskChart` use local mock data because the sandbox does not provide history or memory endpoints.

> The live dashboard **never** calls the protected ARF engine. All data is either from the public sandbox or generated locally.

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
| [`arf-spec`](https://github.com/arf-foundation/arf-spec) | Canonical data models, API contracts | Public (Apache 2.0) |
| [`pitch-deck`](https://github.com/arf-foundation/pitch-deck) | Public overview and vision | Public |
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

For questions about pilot access or enterprise licensing, email **petter2025us@outlook.com**.

## Known Limitations & Troubleshooting

### Sandbox API Limitations
- The public sandbox API is **rate‑limited** and returns **simulated responses only**. It does **not** perform real Bayesian inference or access the protected ARF engine.
- The sandbox does **not** provide history (`/v1/history`) or memory (`/v1/memory/stats`) endpoints. Consequently, components like `RecentDecisions` and `MemoryStats` use local mock data.
- Evaluation responses are transformed from the sandbox’s `recommendation` and `justification` fields into the `EvaluateResponse` shape expected by the frontend. The confidence interval and epistemic uncertainty are derived heuristically.

### Build & Deployment Issues
- **Private repository on Vercel Hobby plan:** Vercel’s free plan does **not** support private repositories owned by an organization. If you encounter deployment failures after making the repo private, either upgrade to Vercel Pro or make the repository public.
- **Missing environment variables:** The frontend does **not** require `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_USE_MOCK_DATA`. These variables are ignored. The API target is hardcoded in `next.config.ts` rewrites.
- **Service worker errors:** If you see `getInstalledRelatedApps` errors in the console, they are suppressed by an inline script in `layout.tsx` and by disabling PWA in `next.config.ts`. This does not affect functionality.

### Development Workflow
- After cloning, run `yarn install` and `yarn dev`. No additional configuration is needed.
- To test the sandbox API integration locally, ensure you have an internet connection – the frontend will call `https://A-R-F-ARF-Sandbox-API.hf.space/v1/evaluate`.
- If you need to point to a different API backend, modify the `rewrites` section in `next.config.ts`.

### Reporting Issues
- For bugs in the public frontend, please open an issue on GitHub.
- For questions about the protected core engine or pilot access, email **petter2025us@outlook.com**.

## License

This repository (`arf-frontend`) is licensed under the **Apache 2.0 License** – see the [LICENSE](LICENSE) file for details.

> **Note:** The Apache 2.0 license applies **only** to the code in this repository. It does **not** cover the ARF core engine, which is proprietary and access‑controlled.

## Community & Contact

- 📬 **Email:** [petter2025us@outlook.com](mailto:petter2025us@outlook.com)
- 💬 **Slack:** [Join workspace](https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg)
- 🔗 **LinkedIn:** [Juan Petter](https://www.linkedin.com/in/petterjuan/)
- 📅 **Book a call:** [Calendly](https://calendly.com/petter2025us/30min)

## Acknowledgements

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Lucide icons](https://lucide.dev/).  
The ARF core engine is developed by the ARF Foundation and stewarded by the founder.
