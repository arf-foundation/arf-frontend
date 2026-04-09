import { Lock, Calendar, Mail, Eye, Database, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  const effectiveDate = "April 9, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 md:p-8 shadow-xl">
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-gray-300 prose-strong:text-white prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-li:text-gray-300">
              <h2>1. Overview</h2>
              <p>
                This Privacy Policy explains how ARF (“we”, “us”, “our”) collects, uses, and protects personal data in connection with the ARF Service. <strong>We do not sell your personal data.</strong>
              </p>

              <h2>2. Data We Collect</h2>
              <h3>Account Information</h3>
              <ul><li>Email address</li><li>Account credentials</li></ul>
              <h3>API and Usage Data</h3>
              <ul><li>API keys</li><li>Evaluation requests and responses</li><li>Timestamps and endpoints used</li><li>Error logs</li></ul>
              <h3>Technical Data</h3>
              <ul><li>IP address</li><li>Browser and device information</li><li>Log files</li></ul>
              <h3>Payment Data</h3>
              <ul><li>Billing information handled by Stripe (we do not store full card details)</li></ul>

              <h2>3. How We Collect Data</h2>
              <p>We collect data through:</p>
              <ul>
                <li>Signup forms</li>
                <li>API usage (automatically)</li>
                <li>Cookies and analytics tools (see Section 10)</li>
                <li>Payment processing via Stripe</li>
              </ul>

              <h2>4. Purpose of Processing</h2>
              <p>We use data to:</p>
              <ul>
                <li>Provide and operate the Service</li>
                <li>Enforce usage limits and quotas</li>
                <li>Maintain audit logs</li>
                <li>Improve performance and reliability</li>
                <li>Communicate updates and service notices</li>
                <li>Detect and prevent abuse</li>
              </ul>

              <h2>5. Legal Basis (GDPR)</h2>
              <p>We process personal data under:</p>
              <ul>
                <li><strong>Contractual necessity</strong> – to provide the Service</li>
                <li><strong>Legitimate interests</strong> – improving and securing the Service</li>
                <li><strong>Consent</strong> – for optional communications (e.g., newsletters)</li>
              </ul>

              <h2>6. Data Sharing</h2>
              <p>We share data with:</p>
              <ul>
                <li><strong>Stripe</strong> – payment processing</li>
                <li><strong>Vercel</strong> – frontend hosting</li>
                <li><strong>Hugging Face</strong> – demo hosting</li>
                <li><strong>GitHub</strong> – repository integrations</li>
                <li><strong>Slack</strong> – community communication</li>
              </ul>
              <p>These providers process data under their own privacy policies.</p>

              <h2>7. Data Retention</h2>
              <ul>
                <li><strong>Usage logs</strong>: Up to 12 months</li>
                <li><strong>Account data</strong>: Retained while account is active</li>
                <li><strong>API keys</strong>: Retained until deleted or account closure</li>
              </ul>
              <p>We may retain data longer where legally required (e.g., tax, fraud prevention).</p>

              <h2>8. User Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> – obtain a copy of your data</li>
                <li><strong>Correction</strong> – rectify inaccurate data</li>
                <li><strong>Deletion</strong> – request erasure (subject to legal obligations)</li>
                <li><strong>Portability</strong> – receive your data in a structured format</li>
                <li><strong>Object</strong> – object to processing based on legitimate interests</li>
              </ul>
              <p>
                To exercise rights, contact us at <a href="mailto:petter2025us@outlook.com">petter2025us@outlook.com</a>. We will respond within 30 days.
              </p>
              <p>
                <strong>For California residents (CCPA):</strong> You also have the right to opt out of the “sale” of personal data (we do not sell data) and to non‑discrimination for exercising your rights.
              </p>

              <h2>9. Security Measures</h2>
              <p>We implement:</p>
              <ul>
                <li>Encryption in transit (HTTPS)</li>
                <li>Access controls and authentication</li>
                <li>Logging and monitoring</li>
              </ul>
              <p>No system is completely secure; use the Service at your own risk.</p>

              <h2>10. Cookies</h2>
              <p>
                We use essential cookies for authentication and analytics (e.g., Vercel Analytics). You may disable cookies in your browser, but some features may not work correctly. We do not use tracking cookies for advertising.
              </p>

              <h2>11. International Data Transfers</h2>
              <p>
                Data may be processed in the United States or other jurisdictions. We take appropriate safeguards (e.g., Standard Contractual Clauses) to ensure lawful transfers.
              </p>

              <h2>12. Children’s Privacy</h2>
              <p>
                The Service is not intended for individuals under 16. We do not knowingly collect data from children.
              </p>

              <h2>13. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy. Continued use of the Service after the effective date constitutes acceptance of the updates.
              </p>

              <h2>14. Contact</h2>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:petter2025us@outlook.com">petter2025us@outlook.com</a>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-gray-500 text-xs mt-8">
            Last updated: {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
}
