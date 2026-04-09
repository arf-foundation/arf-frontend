import { Shield, Calendar, Mail } from 'lucide-react';

export default function TermsPage() {
  const effectiveDate = "April 9, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 md:p-8 shadow-xl">
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-gray-300 prose-strong:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-li:text-gray-300">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Agentic Reliability Framework (“ARF”) hosted API service (the “Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree, you may not use the Service.
              </p>
              <p>
                These Terms apply only to the hosted SaaS offering. The open-source ARF library is governed separately under the Apache 2.0 License.
              </p>

              <h2>2. Description of the Service</h2>
              <p>
                ARF provides a hosted API for evaluating infrastructure actions using Bayesian risk scoring, expected loss minimisation, and audit logging.
              </p>
              <p>Service tiers are:</p>
              <ul>
                <li><strong>Free</strong>: Up to 1,000 evaluations/month</li>
                <li><strong>Pro</strong>: Up to 10,000 evaluations/month</li>
                <li><strong>Premium</strong>: Up to 50,000 evaluations/month</li>
                <li><strong>Enterprise</strong>: Custom limits and features (contact us)</li>
              </ul>
              <p>
                We may modify features, limits, or pricing with reasonable notice (e.g., 30 days). The free tier is intended for evaluation and non‑production use only.
              </p>

              <h2>3. User Accounts and API Keys</h2>
              <p>To use the Service, you must:</p>
              <ul>
                <li>Register with a valid email address</li>
                <li>Maintain the security of your account credentials</li>
                <li>Keep your API keys confidential</li>
              </ul>
              <p>
                You are solely responsible for all activity conducted using your API keys. You must notify us immediately of any unauthorised use. We may revoke API keys at any time if we suspect abuse.
              </p>

              <h2>4. Payment Terms</h2>
              <p>Paid tiers are billed via Stripe:</p>
              <ul>
                <li>Subscriptions are billed monthly unless otherwise stated.</li>
                <li>You authorise us and Stripe to charge your payment method.</li>
                <li>Fees are non‑refundable except where required by law.</li>
                <li>You may cancel at any time; access continues until the end of the billing period.</li>
              </ul>
              <p>We do not store full payment card details.</p>

              <h2>5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Abuse, overload, or disrupt the Service.</li>
                <li>Reverse engineer, decompile, or attempt to extract source code from the Service.</li>
                <li>Circumvent usage limits or security measures.</li>
                <li>Use the Service for unlawful or harmful purposes.</li>
                <li>Use the Service to process sensitive personal data (e.g., health, financial) without appropriate safeguards.</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts violating this policy.</p>

              <h2>6. Data Processing</h2>
              <p>
                We process data as described in our <a href="/privacy">Privacy Policy</a>. By using the Service, you consent to such processing.
              </p>

              <h2>7. Intellectual Property</h2>
              <ul>
                <li>ARF retains all rights, title, and interest in the Service.</li>
                <li>You retain ownership of any data you submit.</li>
                <li>You grant us a limited license to process your data solely to provide the Service.</li>
              </ul>
              <p>The open-source ARF library remains governed by the Apache 2.0 License.</p>

              <h2>8. Disclaimer of Warranties</h2>
              <p>The Service is provided “as is” and “as available”. We disclaim all warranties, including:</p>
              <ul>
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non‑infringement</li>
              </ul>
              <p>We do not guarantee uninterrupted or error‑free operation.</p>

              <h2>9. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law:</p>
              <ul>
                <li>ARF shall not be liable for indirect, incidental, or consequential damages.</li>
                <li>Total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</li>
              </ul>

              <h2>10. Indemnification</h2>
              <p>You agree to indemnify and hold harmless ARF from any claims, damages, or expenses arising from:</p>
              <ul>
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
              </ul>

              <h2>11. Termination</h2>
              <p>We may suspend or terminate your access:</p>
              <ul>
                <li>For violation of these Terms</li>
                <li>For non‑payment</li>
                <li>At our discretion with reasonable notice (e.g., 30 days)</li>
              </ul>
              <p>You may terminate your account at any time by contacting us.</p>

              <h2>12. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict‑of‑law principles. Disputes shall be resolved in the courts located in Delaware.
              </p>

              <h2>13. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of the Service after the effective date constitutes acceptance of the updated Terms.
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
