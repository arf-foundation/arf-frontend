import { Lock, Calendar, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const effectiveDate = "May 16, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 sm:p-6 md:p-8 shadow-xl">
            <div className="prose prose-invert max-w-none">
              <h2>1. Overview</h2>
              <p>
                This Privacy Policy applies to the ARF public sandbox API, demo website, and pilot signup process. The core engine is proprietary and access‑controlled – this policy does not apply to data processed under separate written agreements. <strong>We do not sell your personal data.</strong>
              </p>

              <h2>2. Data We Collect</h2>
              <h3>Account Information</h3>
              <ul><li>Email address</li><li>Account credentials</li></ul>
              <h3>API and Usage Data (sandbox)</h3>
              <ul><li>API keys</li><li>Mock evaluation requests and responses</li><li>Timestamps, IP addresses, endpoints</li></ul>
              <h3>Technical Data</h3>
              <ul><li>Browser and device information</li><li>Log files</li></ul>
              <h3>Payment Data</h3>
              <ul><li>None – paid tiers are handled via separate written agreements, not through this site.</li></ul>

              <h2>3. How We Collect Data</h2>
              <p>Through signup forms, API usage, cookies, and analytics (Vercel Analytics).</p>

              <h2>4. Purpose of Processing</h2>
              <p>To provide the sandbox, enforce rate limits, improve the service, and send critical updates.</p>

              <h2>5. Legal Basis (GDPR)</h2>
              <p>Contractual necessity (sandbox), legitimate interests (security, improvement), and consent (optional newsletters).</p>

              <h2>6. Data Sharing</h2>
              <p>We share data with:</p>
              <ul>
                <li><strong>Vercel</strong> – hosting and analytics</li>
                <li><strong>Hugging Face</strong> – demo hosting (mock data only)</li>
                <li><strong>GitHub</strong> – repository links</li>
                <li><strong>Slack</strong> – community (no data shared unless you click)</li>
              </ul>

              <h2>7. Data Retention</h2>
              <ul>
                <li><strong>Sandbox usage logs</strong>: 30 days</li>
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

          <p className="text-center text-gray-500 text-xs mt-8">
            Last updated: {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
}
