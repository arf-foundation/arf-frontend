import { Shield, Calendar, Mail } from 'lucide-react';

export default function TermsPage() {
  const effectiveDate = "May 16, 2026";

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 sm:p-6 md:p-8 shadow-xl">
            <div className="prose prose-invert max-w-none">
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
                <li><strong>Public specification</strong> – shared under written terms, not open source.</li>
              </ul>
              <p>
                Production‑grade inference, deterministic enforcement, and audit trails are available only under a written Pilot or Enterprise Agreement with hybrid pricing (fixed deployment fee plus outcome‑based or retainer).
              </p>

              <h2>3. User Accounts and API Keys</h2>
              <p>
                You may sign up for a sandbox API key. You are responsible for keeping it confidential. We may revoke keys at any time if we suspect abuse.
              </p>

              <h2>4. Payment Terms</h2>
              <p>
                The public sandbox is free. Paid pilot or enterprise tiers are governed by separate written agreements, with a hybrid pricing model (fixed deployment fee plus outcome‑based or retainer), and are not available through this website.
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
                We process data as described in our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                All rights in the ARF website and sandbox API belong to ARF. The core engine is proprietary – no public license is granted.
              </p>

              <h2>8. Disclaimer of Warranties</h2>
              <p>
                The sandbox API is provided “as is” with mock data. We disclaim all warranties. It is not suitable for production.
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
                <a href="/contact">contact</a>
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
