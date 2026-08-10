import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Calendar, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing use of the ARF AI public sandbox API, demo dashboard, and pilot signup process.',
};

export default function TermsPage() {
  const effectiveDate = "August 10, 2026";

  return (
    <div className="arf-page-root min-h-screen">
      <div className="arf-shell py-10 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-12">
            <div className="mb-4 inline-flex items-center justify-center rounded-full border border-arf-blue/25 bg-arf-blue/15 p-3">
              <Shield className="h-8 w-8 text-arf-blue" />
            </div>
            <h1 className="arf-gradient-text mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-[color:var(--text-muted)] sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          <div className="arf-card p-5 sm:p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the ARF website or the public sandbox API, you agree to these Terms. The <strong>core ARF engine is proprietary and access‑controlled</strong> – it is not publicly available. Access to the real engine requires a separate written Pilot or Enterprise Agreement.
              </p>

              <h2>2. Description of the Service</h2>
              <p>
                The public Service consists of:
              </p>
              <ul>
                <li><strong>Sandbox API</strong> – returns <strong>mock data only</strong>, rate‑limited, for demonstration purposes.</li>
                <li><strong>Demo dashboard</strong> – visualises mock data.</li>
                <li><strong>AI agent chat</strong> – a Claude‑backed assistant (available site‑wide and at /agent) that classifies incident text you submit. Rate‑limited; responses are AI‑generated and may be inaccurate.</li>
                <li><strong>Public specification</strong> – shared under written terms, not open source.</li>
              </ul>
              <p>
                Production‑grade inference, deterministic enforcement, and audit trails are available only under a written Pilot or Enterprise Agreement with outcome‑based pricing.
              </p>

              <h2>3. User Accounts and API Keys</h2>
              <p>
                You may sign up for a sandbox API key. You are responsible for keeping it confidential. We may revoke keys at any time if we suspect abuse.
              </p>

              <h2>4. Payment Terms</h2>
              <p>
                The public sandbox is free. Paid pilot or enterprise tiers are governed by separate written agreements and are not available through this website.
              </p>

              <h2>5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Abuse, overload, or disrupt the Service.</li>
                <li>Reverse engineer or attempt to extract source code.</li>
                <li>Use the Service for unlawful purposes.</li>
              </ul>

              <h2>6. Data Processing</h2>
              <p>
                We process data as described in our <Link href="/privacy" className="text-arf-blue hover:underline">Privacy Policy</Link>.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                All rights in the ARF website and sandbox API belong to ARF. The core engine is proprietary – no public license is granted.
              </p>

              <h2>8. Disclaimer of Warranties</h2>
              <p>
                The sandbox API is provided “as is” with mock data. We disclaim all warranties. It is not suitable for production. The AI agent chat produces AI‑generated output that may be inaccurate or incomplete; it does not constitute governance advice and should not be relied on for real operational decisions.
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, ARF shall not be liable for any damages arising from use of the public sandbox.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Delaware, USA.
              </p>

              <h2>11. Contact</h2>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:juan@arf-ai.com">juan@arf-ai.com</a>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-[color:var(--text-muted)]">
            Last updated: {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
}
