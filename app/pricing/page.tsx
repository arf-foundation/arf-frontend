'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const TIERS = [
  {
    name: 'Free',
    price: 0,
    currency: 'USD',
    description: 'Up to 1,000 evals/mo',
    limits: { evaluations: 1000 },
    support: 'Community',
    savings: 99, // vs Pro
    features: ['Community support'],
  },
  {
    name: 'Pro',
    price: 99,
    currency: 'USD',
    description: 'Up to 10,000 evals/mo',
    limits: { evaluations: 10000 },
    features: ['Email support', 'Audit logs (30 days)'],
    label: 'Most Popular',
  },
  {
    name: 'Premium',
    price: 299,
    currency: 'USD',
    description: 'Up to 50,000 evals/mo',
    limits: { evaluations: 50000 },
    features: ['Priority email support', 'Audit logs (90 days)'],
    label: 'Best Value',
  },
  {
    name: 'Enterprise',
    price: 999,
    currency: 'USD',
    description: 'Unlimited evals, SSO, SLA',
    limits: { evaluations: null },
    features: [
      'Single Sign‑On (SSO)',
      '99.9% uptime SLA',
      'Dedicated support (< 15 min)',
      'On‑premises deployment',
      'Custom audit retention',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start free, scale with confidence. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-gray-800 rounded-2xl border p-6 flex flex-col relative ${
                tier.label === 'Most Popular'
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700'
              }`}
            >
              {tier.label && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {tier.label}
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>

              <div className="mb-4">
                <span className="text-4xl font-bold">
                  {tier.price === 0 ? 'Free' : `$${tier.price}`}
                </span>
                {tier.price > 0 && (
                  <span className="text-gray-400 text-sm">/mo</span>
                )}
                {tier.savings && (
                  <div className="text-green-400 text-sm mt-1">
                    Save ${tier.savings}/mo vs Pro
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-4">{tier.description}</p>

              <ul className="space-y-3 flex-1">
                {tier.features?.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {tier.name === 'Free' && (
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-4" /> No audit logs
                  </li>
                )}
                {tier.limits?.evaluations !== undefined && (
                  <li className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-400" />
                    <span>{tier.limits.evaluations.toLocaleString()} evaluations/month</span>
                  </li>
                )}
                {tier.limits?.evaluations === null && (
                  <li className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-400" />
                    <span>Unlimited evaluations</span>
                  </li>
                )}
              </ul>

              {tier.name === 'Enterprise' && (
                <div className="mt-4 text-center">
                  <span className="text-gray-400 line-through text-sm">$999/mo</span>
                  <div className="text-gray-400 text-xs">Custom pricing – contact sales</div>
                </div>
              )}

              <div className="mt-8">
                {tier.name === 'Free' && (
                  <Link
                    href="/signup"
                    className="w-full block text-center border border-gray-600 text-gray-300 py-2 rounded-lg hover:border-blue-500 hover:text-white transition"
                  >
                    Get started
                  </Link>
                )}
                {tier.name === 'Pro' && (
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                    Subscribe → <span className="text-xs">(Stripe)</span>
                  </button>
                )}
                {tier.name === 'Premium' && (
                  <button className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition">
                    Contact sales
                  </button>
                )}
                {tier.name === 'Enterprise' && (
                  <a
                    href="https://calendly.com/petter2025us/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center border border-gray-600 text-gray-300 py-2 rounded-lg hover:border-blue-500 hover:text-white transition"
                  >
                    Contact Sales →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-400 text-sm">
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
