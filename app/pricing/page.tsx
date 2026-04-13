'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Mail } from 'lucide-react';

// This page now describes access models, not per‑seat pricing.
// Outcome‑based pricing is explained, and the free “tier” is replaced by a sandbox demo.

export default function PricingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('petter2025us@outlook.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Access Models & Pilot Program
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The core ARF engine is protected and access‑controlled. Choose the right path for your organisation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Sandbox – free, sanitised demo */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Sandbox</h2>
            <div className="text-4xl font-bold text-blue-400 mb-2">Free</div>
            <p className="text-gray-400 text-sm mb-4">No commitment, no engine access</p>
            <ul className="space-y-3 flex-1">
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>100 evaluations/month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Sanitized API endpoint</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>UI dashboard with demo data</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-4" />✗ No Bayesian core
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-4" />✗ No audit logs
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="w-full block text-center border border-gray-600 text-gray-300 py-2 rounded-lg hover:border-blue-500 hover:text-white transition"
              >
                Try Sandbox →
              </Link>
            </div>
          </div>

          {/* Pilot – time‑limited trial, qualified access */}
          <div className="bg-gray-800 rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-500/20 p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              Recommended
            </div>
            <h2 className="text-2xl font-bold mb-2">Pilot</h2>
            <div className="text-4xl font-bold text-purple-400 mb-2">Time‑limited</div>
            <p className="text-gray-400 text-sm mb-4">Free trial for qualified organisations</p>
            <ul className="space-y-3 flex-1">
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Full engine access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Audit logs & support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Up to 10,000 evaluations/month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Direct founder support</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-4 border-t border-gray-700 pt-3">
              Subject to mutual qualification agreement. No credit card required.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="w-full block text-center bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Request Pilot Access →
              </Link>
            </div>
          </div>

          {/* Enterprise – outcome‑based pricing */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
            <div className="text-4xl font-bold text-gray-400 mb-2">Outcome‑based</div>
            <p className="text-gray-400 text-sm mb-4">Pay for verified risk reduction</p>
            <ul className="space-y-3 flex-1">
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Unlimited evaluations</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>99.9% uptime SLA</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>SSO, on‑prem deployment</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-green-400" />
                <span>Pricing tied to MTTR reduction</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-4 border-t border-gray-700 pt-3">
              We measure risk reduction via auditable pre/post Bayesian scores – you pay only for verified improvement.
            </p>
            <div className="mt-8">
              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-center gap-2 border border-gray-600 text-gray-300 py-2 rounded-lg hover:border-blue-500 hover:text-white transition"
              >
                <Mail size={16} /> Copy email to enquire
              </button>
              {copiedEmail && (
                <p className="text-xs text-green-400 text-center mt-2">Email copied! ✉️</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-400 text-sm max-w-2xl mx-auto">
          <p className="mb-2">
            <strong>Why outcome‑based pricing?</strong> We believe you should pay for value, not infrastructure.
            ARF’s pricing is directly tied to the amount of operational risk the system removes from your AI workflows.
          </p>
          <p>
            Questions?{' '}
            <Link href="/faq" className="text-blue-400 hover:underline">
              Read our FAQ
            </Link>{' '}
            or{' '}
            <a
              href="https://join.slack.com/t/arf-gnv9451/shared_invite/zt-3t2omlgwg-Zf5_jmy9EIU~b51kMJ8Zdg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              join Slack
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
