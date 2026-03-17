# ARF Frontend

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/arf-foundation/arf-frontend?style=social)](https://github.com/arf-foundation/arf-frontend/stargazers)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)](https://arf-frontend-sandy.vercel.app)

Interactive frontend for the **Agentic Reliability Framework (ARF)** – a Bayesian‑powered governance system for cloud infrastructure. Visualize risk scores, simulate incidents, and explore governance decisions in real time.

🔗 **Live demo**: [arf-frontend-sandy.vercel.app](https://arf-frontend-sandy.vercel.app)

## Overview

ARF Frontend provides a user‑friendly dashboard to interact with the ARF API. It displays system‑wide risk metrics, memory statistics, recent decisions, and allows users to test incident evaluations with rich explanations, risk contributions, and recommended healing actions.

## Features

- 📊 Real‑time system risk monitoring
- 🧠 Memory graph statistics (incident nodes, cache hit rates)
- 📈 Historical risk chart
- 🧪 Incident evaluation with full `HealingIntent` response
- 🔗 Links to live demos and documentation
- 💬 Community engagement (Slack, email, LinkedIn)

## Getting Started

### Prerequisites
- Node.js 18+ and yarn/npm
- ARF API backend (local or deployed)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arf-foundation/arf-frontend.git
   cd arf-frontend
   ```
2. **Install dependencies**

```bash
yarn install
# or npm install
```

3. **Set up environment variables**

Create a .env.local file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://your-arf-api-url.com
NEXT_PUBLIC_API_KEY=your-api-key   # if required
```

4. **Run the development server**

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000/) to view the app.

Related Projects
----------------

ARF is composed of several interoperable components:

*   [**ARF API**](https://github.com/arf-foundation/arf-api) – FastAPI backend serving governance decisions.
    
*   [**ARF Core Engine**](https://github.com/arf-foundation/agentic-reliability-framework) – Bayesian inference and memory core.
    
*   [**ARF Specification**](https://github.com/arf-foundation/arf-spec) – Canonical documentation and mathematical foundations.
    

Deployment
----------

The frontend is optimized for deployment on [Vercel](https://vercel.com/). Simply connect your GitHub repository and set the required environment variables.

Contributing
------------

We welcome contributions! Please see our [contributing guidelines](https://contributing.md/) for details.

License
-------

This project is licensed under the Apache 2.0 License – see the [LICENSE](https://license/) file for details.

Community
---------

*   📬 Email: petter2025us@outlook.com
    
*   💬 Slack: [Join our workspace](https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg)
    
*   🔗 LinkedIn: [Juan Petter](https://www.linkedin.com/in/petterjuan/)
    
*   📅 [Book a call](https://calendly.com/petter2025us/30min)
    

Acknowledgements
----------------

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Lucide icons](https://lucide.dev/). Powered by the ARF open‑source community.
