# ARF Frontend – Public Demo Dashboard

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://arf-frontend-sandy.vercel.app)

**Interactive frontend for the Agentic Reliability Framework (ARF)** – a Bayesian‑powered governance system for AI infrastructure. This repository contains a **public, sanitised demo dashboard** that illustrates ARF concepts. The core engine is **access‑controlled** and available only to qualified pilots and enterprise customers.

🔗 **Live demo:** [arf-frontend-sandy.vercel.app](https://arf-frontend-sandy.vercel.app)  
📖 **Specification:** [arf-spec](https://github.com/arf-foundation/arf-spec)

> ⚠️ **Important** – The ARF core engine (`agentic_reliability_framework`, `arf-api`) is **not open source**. It is proprietary, access‑controlled, and offered under outcome‑based pricing. This frontend repo contains only public, demo‑grade code.

---

## Overview

ARF Frontend provides a user‑friendly dashboard to **visualise risk metrics, simulate incident evaluations, and explore governance decisions** – all using **demo data and a sanitised API endpoint**. It is intended to showcase the capabilities of ARF without exposing the protected Bayesian inference engine.

**Key features** (all using demo/simulated data):
- 📊 Real‑time system risk monitoring (demo)
- 🧠 Memory graph statistics (cached demo values)
- 📈 Historical risk chart (synthetic data)
- 🧪 Incident evaluation form – returns a **mock** `HealingIntent` response
- 🔗 Links to pilot access request

---

## Getting Started (for local development of this dashboard)

### Prerequisites
- Node.js 18+ and `yarn` / `npm`
- No backend required – the demo uses mocked data or a public sandbox endpoint

### Installation
```bash
git clone https://github.com/arf-foundation/arf-frontend.git
cd arf-frontend
yarn install
```

### Environment variables (optional)

Create .env.local:

```text
NEXT_PUBLIC_API_URL=https://a-r-f-arf-sandbox-api.hf.space   # Sanitised demo endpoint
NEXT_PUBLIC_USE_MOCK_DATA=true                # Use local mocks (default)
```

### Run the development server

```bash
yarn dev
```

## Public vs. Private – What This Repo Is (and Isn’t)

| ✅ **This repo (public)** | ❌ **Not included / private** |
|---------------------------|-------------------------------|
| Demo UI components | Core Bayesian inference engine |
| Mock API handlers | Real risk scoring logic |
| Sanitised visualisations | Production control plane |
| Public specification references | Customer‑specific audit trails |
| Pilot request form | Outcome‑based pricing implementation |

> The live dashboard at [arf-frontend-sandy.vercel.app](https://arf-frontend-sandy.vercel.app) uses only **mock data** or a rate‑limited sandbox API. It does **not** call the protected ARF engine.

---

## Related Projects (Public Only)

| Project | Description | Access |
|---------|-------------|--------|
| [`arf-spec`](https://github.com/arf-foundation/arf-spec) | Canonical data models, API contracts | Public (Apache 2.0) |
| [`pitch-deck`](https://github.com/arf-foundation/pitch-deck) | Public overview and vision | Public |
| **Core Engine** | Bayesian risk scoring, semantic memory | **Access‑controlled** – pilot only |
| **API Control Plane** | Production FastAPI service | **Access‑controlled** – pilot only |

📌 **For pilot access, please [request here](https://arf-frontend-sandy.vercel.app/signup).**

---

## Contributing (to this public repo only)

We accept **limited contributions** to this public frontend repository (bug fixes, documentation, demo improvements).  
**We do not accept pull requests against the private core engine or API.**

1. Open an issue describing your proposed change.
2. Wait for a maintainer to assign the issue.
3. Sign a Contributor License Agreement (CLA) if requested.
4. Submit a pull request referencing the issue.

All changes are reviewed and merged at the founder’s discretion.

For questions about pilot access or enterprise licensing, email **petter2025us@outlook.com**.

---

## License

This repository (`arf-frontend`) is licensed under the **Apache 2.0 License** – see the [LICENSE](LICENSE) file for details.

> **Note:** The Apache 2.0 license applies **only** to the code in this repository. It does **not** cover the ARF core engine, which is proprietary and access‑controlled.

---

## Community & Contact

- 📬 **Email:** [petter2025us@outlook.com](mailto:petter2025us@outlook.com)
- 💬 **Slack:** [Join workspace](https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg)
- 🔗 **LinkedIn:** [Juan Petter](https://www.linkedin.com/in/petterjuan/)
- 📅 **Book a call:** [Calendly](https://calendly.com/petter2025us/30min)

---

## Acknowledgements

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Lucide icons](https://lucide.dev/).  
The ARF core engine is developed by the ARF Foundation and stewarded by the founder.
