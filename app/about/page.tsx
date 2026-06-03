import Link from 'next/link';
import { Shield, ArrowRight, Mail, Linkedin, Calendar } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Hero */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About ARF
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              The governance layer that gives enterprises control, confidence, and compliance over every
              AI‑assisted infrastructure decision.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
              <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-full mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                ARF exists to make AI usable in serious settings without weakening accountability.
                We give enterprises a deterministic, auditable layer that evaluates every
                AI‑assisted action before it touches production — so teams can move fast
                while leadership stays in control.
              </p>
            </div>
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
              <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-full mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                A world where every autonomous decision in critical infrastructure is
                traceable, explainable, and kept under human governance. ARF is building
                the control plane that makes AI‑driven operations not just possible, but
                responsible.
              </p>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Founded & Led by Engineers
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
                  JP
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Juan Petter</h3>
                <p className="text-gray-400 text-sm mb-3">Founder & CEO</p>
                <p className="text-gray-300 leading-relaxed">
                  Previously at NetApp, where I saw Fortune 500 clients lose up to a quarter
                  million dollars per silent AI incident. I founded ARF to solve the missing
                  piece in agentic AI: a governance layer that gives organisations true
                  control without slowing them down. I work directly with every pilot —
                  no salespeople, no hand‑offs, just engineers solving real problems.
                </p>
                <div className="flex gap-4 mt-4">
                  <a
                    href="mailto:juan@arf-ai.com"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    <Mail size={16} /> juan@arf-ai.com
                  </a>
                  <a
                    href="https://www.linkedin.com/in/petterjuan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>
                  <a
                    href="https://calendly.com/petter2025us/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    <Calendar size={16} /> Book a 30‑min call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* How ARF Works – condensed */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">How ARF Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 text-center">
                <div className="text-2xl mb-2">🗂️</div>
                <h3 className="font-semibold text-blue-400">1. Check Memory</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Similar destructive actions flagged from past incidents.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 text-center">
                <div className="text-2xl mb-2">📈</div>
                <h3 className="font-semibold text-blue-400">2. Risk Score</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Bayesian engine calculates failure probability.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <h3 className="font-semibold text-blue-400">3. Expected Loss</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Catastrophic impact triggers ESCALATE.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 text-center">
                <div className="text-2xl mb-2">📜</div>
                <h3 className="font-semibold text-blue-400">4. Audit Trail</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Every decision is signed, timestamped, and immutable.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">What We Believe</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-1">Determinism</h3>
                <p className="text-gray-400 text-sm">
                  Same inputs → same decision. Every time. No randomness, no
                  unreproducible behaviour.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-1">Transparency</h3>
                <p className="text-gray-400 text-sm">
                  Every risk score is explainable. Every decision comes with a
                  human‑readable justification.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-1">Human‑in‑the‑Loop</h3>
                <p className="text-gray-400 text-sm">
                  ARF escalates when uncertain. Humans stay in control, always.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-1">Security‑First</h3>
                <p className="text-gray-400 text-sm">
                  Built for regulated environments. Runs on‑prem or VPC. No data
                  leaves your control.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-1">Outcome‑Aligned</h3>
                <p className="text-gray-400 text-sm">
                  Hybrid pricing: fixed deployment + outcome‑based or retainer. We
                  succeed when you reduce risk.
                </p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-1">Founder‑Led</h3>
                <p className="text-gray-400 text-sm">
                  No salespeople. I personally onboard every pilot. Engineering
                  problems deserve engineering solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Traction / Trust */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Where We Are Today</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-gray-800/70 px-6 py-3 rounded-full border border-gray-700">
                <span className="text-blue-400 font-bold">v4</span> <span className="text-gray-300">Core Engine</span>
              </div>
              <div className="bg-gray-800/70 px-6 py-3 rounded-full border border-gray-700">
                <span className="text-green-400 font-bold">3</span> <span className="text-gray-300">Active Pilots</span>
              </div>
              <div className="bg-gray-800/70 px-6 py-3 rounded-full border border-gray-700">
                <span className="text-purple-400 font-bold">54/54</span> <span className="text-gray-300">Pressure Tests Passed</span>
              </div>
              <div className="bg-gray-800/70 px-6 py-3 rounded-full border border-gray-700">
                <span className="text-yellow-400 font-bold">SOC2‑Ready</span> <span className="text-gray-300">Design</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to take control of AI‑assisted decisions?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We offer time‑limited, free pilot access for qualified teams.
              Founder‑led onboarding, no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                Request Pilot Access <ArrowRight size={18} />
              </Link>
              <Link
                href="/pricing"
                className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition inline-flex items-center gap-2"
              >
                View Access Models <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
