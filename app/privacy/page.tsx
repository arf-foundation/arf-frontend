import type { Metadata } from 'next';
import { Lock, Calendar, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ARF AI collects, uses, and protects data across the public sandbox API, demo website, and pilot signup process.',
};

export default function PrivacyPage() {
  const effectiveDate = "August 10, 2026";

  return (
    <div className="arf-page-root min-h-screen">
      <div className="arf-shell py-10 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-12">
            <div className="mb-4 inline-flex items-center justify-center rounded-full border border-arf-purple/25 bg-arf-purple/15 p-3">
              <Lock className="h-8 w-8 text-arf-purple" />
            </div>
            <h1 className="arf-gradient-text mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-[color:var(--text-muted)] sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          <div className="arf-card p-5 sm:p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. Overview</h2>
              <p>
                This Privacy Policy applies to the ARF public sandbox API, demo website, and pilot signup process. The core engine is proprietary and access‑controlled – this policy does not apply to data processed under separate written agreements. <strong>We do not sell your personal data.</strong>
              </p>

              <h2>2. Data We Collect</h2>
              <h3>Account Information</h3>
              <ul><li>Email address</li><li>Account credentials</li></ul>
              <h3>API and Usage Data (sandbox)</h3>
              <ul><li>API keys</li><li>Mock evaluation requests and responses</li><li>Timestamps, IP addresses, endpoints</li></ul>
              <h3>AI Agent Chat (ARF Institutional Memory Agent)</h3>
              <ul><li>Message text you submit to the chat widget or the /agent page</li><li>The model&rsquo;s generated response</li></ul>
              <h3>Technical Data</h3>
              <ul><li>Browser and device information</li><li>Log files</li></ul>
              <h3>Payment Data</h3>
              <ul><li>None – paid tiers are handled via separate written agreements, not through this site.</li></ul>

              <h2>3. How We Collect Data</h2>
              <p>Through signup forms, API usage, the AI agent chat widget, cookies, and analytics (Vercel Analytics).</p>

              <h2>4. Purpose of Processing</h2>
              <p>To provide the sandbox, enforce rate limits, generate AI agent chat responses, improve the service, and send critical updates.</p>

              <h2>5. Legal Basis (GDPR)</h2>
              <p>Contractual necessity (sandbox, AI agent chat), legitimate interests (security, improvement), and consent (optional newsletters).</p>

              <h2>6. Data Sharing</h2>
              <p>We share data with:</p>
              <ul>
                <li><strong>Vercel</strong> – hosting and analytics</li>
                <li><strong>Hugging Face</strong> – demo hosting (mock data only)</li>
                <li><strong>Anthropic</strong> – the AI agent chat widget and /agent page send your submitted message text to Anthropic&rsquo;s Claude API for processing. Each request is evaluated independently; the agent does not retain conversation history between messages.</li>
                <li><strong>GitHub</strong> – repository links</li>
                <li><strong>Slack</strong> – community (no data shared unless you click)</li>
              </ul>

              <h2>7. Data Retention</h2>
              <ul>
                <li><strong>Sandbox usage logs</strong>: 30 days</li>
                <li><strong>AI agent chat logs</strong>: retained in server logs for 30 days for abuse monitoring and debugging; not stored in a database or used for model training</li>
                <li><strong>Pilot signup data</strong>: up to 12 months (if you later enter a written agreement)</li>
                <li><strong>Account data</strong>: retained while your account is active</li>
                <li><strong>API keys</strong>: retained until you request deletion</li>
              </ul>

              <h2>8. Your Rights</h2>
              <p>Access, correction, deletion, portability, objection. Contact <a href="mailto:juan@arf-ai.com">juan@arf-ai.com</a>.</p>

              <h2>9. Security Measures</h2>
              <p>HTTPS encryption, access controls, logging.</p>

              <h2>10. Cookies</h2>
              <p>Essential cookies for authentication and analytics. No advertising cookies.</p>

              <h2>11. International Transfers</h2>
              <p>Data may be processed in the US; we rely on Standard Contractual Clauses.</p>

              <h2>12. Children’s Privacy</h2>
              <p>Not intended for under 16.</p>

              <h2>13. Changes to This Policy</h2>
              <p>We may update it; continued use constitutes acceptance.</p>

              <h2>14. Contact</h2>
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
