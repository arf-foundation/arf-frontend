"use client";

import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/* Was inline in app/page.tsx and rendered on the homepage only -- every other
   route (including /pricing) had no footer at all, so there was no path to
   Terms of Service / Privacy Policy from anywhere but home. Extracted so
   layout.tsx can render it once, site-wide. */

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Capabilities", href: "/#capabilities" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Console", href: "/dashboard" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Changelog", href: "/changelog" },
      { label: "History", href: "/history" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Request Pilot Access", href: "/signup" },
      { label: "Book a call", href: "https://calendly.com/petter2025us/30min" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/agentic-reliability",
      },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Slack",
        href: "https://join.slack.com/t/arf-vmt3923/shared_invite/zt-3xnjkuas4-LG9pW2bMz94vGzeeKwAclg",
      },
      { label: "GitHub", href: "https://github.com/arf-foundation" },
      { label: "Hugging Face", href: "https://huggingface.co/ARF-AI" },
      {
        label: "Risk demo",
        href: "https://arf-foundation.github.io/arf-risk-demo/",
      },
    ],
  },
] as const;

export default function Footer() {
  const trackSlackClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "slack_invite_click", {
        event_category: "engagement",
      });
    }
  };

  return (
    <footer className="bg-arf-dark px-0 pb-8 pt-[72px] text-white/70">
      <div className="arf-shell">
        <div className="grid gap-11 border-b border-white/12 pb-[52px] lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3">
              {/* See the same fix in NavBar.tsx -- declared size must match
                  the rendered 32px box, not the source file's resolution. */}
              <Image
                src="/arf-icon.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-base font-semibold tracking-[-0.02em] text-white">
                ARF AI
              </span>
            </Link>
            <p className="mb-6 max-w-[34ch] text-sm leading-[1.65] text-white/70">
              The control plane between autonomous AI and enterprise
              infrastructure.
            </p>
            <a
              href="mailto:juan@arf-ai.com"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:border-white/50"
            >
              juan@arf-ai.com
            </a>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.13em] text-white/55">
                {col.title}
              </p>
              <div className="flex flex-col gap-3">
                {col.links.map((link) =>
                  link.href.startsWith("http") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={
                        link.label === "Slack" ? trackSlackClick : undefined
                      }
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-8 pt-7">
          <a
            href="https://github.com/arf-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80"
          >
            <Image
              src="/GitHub_Lockup_White.svg"
              alt="GitHub Enterprise"
              width={416}
              height={95}
              className="h-8 w-auto"
            />
          </a>
          <div className="flex items-center gap-5 font-mono text-[12.5px] text-white/55">
            <Link href="/changelog" className="transition hover:text-white">
              v4.3.2 — Axiom
            </Link>
            <span className="text-white/55">© 2026 ARF Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
