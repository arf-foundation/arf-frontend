'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Rocket,
  Brain,
  Scale,
  Cpu,
  Shield,
  Lock,
  FileText,
  MessageSquare,
  Mail,
  Calendar,
  Github,
} from 'lucide-react';
import { useInView } from './hooks/useInView';
import Mermaid from '../components/Mermaid';

// ─────────────────────────────────────────────
// ABSTRACTED SYSTEM VIEW (no algorithm leakage)
// ─────────────────────────────────────────────

const SYSTEM_DIAGRAM = `flowchart TD
  A[Inputs: Services, Events, Signals]
  B[Adaptive Evaluation Layer]
  C[Policy Governance Layer]
  D{Controlled Outcome}
  E[Audit + Observability Log]

  A --> B --> C --> D
  D --> E
`;

export default function LandingPage() {
  const [heroRef, heroInView] = useInView({ once: true });
  const [capRef, capInView] = useInView({ once: true });

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ───────── HERO ───────── */}
      <section
        ref={heroRef}
        className={`px-6 py-24 text-center transition-opacity ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-5xl font-bold">
          Stop unpredictable AI systems.
          <span className="block text-blue-400">
            Govern every decision.
          </span>
        </h1>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
          ARF is a governance and control system for AI operations in production environments.
          It introduces structured evaluation, policy enforcement, and full decision traceability
          across autonomous workflows.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-blue-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            Request Access <ArrowRight size={16} />
          </Link>

          <a
            href="#system"
            className="border border-gray-600 px-6 py-3 rounded-lg"
          >
            View System
          </a>
        </div>
      </section>

      {/* ───────── PROBLEM / SOLUTION / OUTCOME ───────── */}
      <section className="px-6 py-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <Card title="Problem" color="red">
          AI systems in production behave unpredictably, producing outcomes that are
          difficult to trace, validate, or govern under operational constraints.
        </Card>

        <Card title="Solution" color="green">
          ARF introduces a structured control layer that evaluates system outputs against
          defined policies before execution or escalation.
        </Card>

        <Card title="Outcome" color="blue">
          Organizations gain controlled AI execution with full observability, auditability,
          and policy-aligned decision enforcement.
        </Card>
      </section>

      {/* ───────── SYSTEM OVERVIEW ───────── */}
      <section id="system" className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          System Overview
        </h2>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <Mermaid chart={SYSTEM_DIAGRAM} />
          <p className="text-xs text-gray-500 mt-3 text-center">
            Input → evaluation → policy enforcement → controlled outcome → audit log
          </p>
        </div>
      </section>

      {/* ───────── CAPABILITIES (ABSTRACTED) ───────── */}
      <section
        ref={capRef}
        className={`px-6 py-20 transition-opacity ${
          capInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Core Capabilities
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Feature
            icon={<Brain />}
            title="Adaptive Evaluation"
            desc="Dynamic scoring of system outputs under context-aware conditions."
          />
          <Feature
            icon={<Scale />}
            title="Policy Governance"
            desc="Execution constraints defined by structured operational rules."
          />
          <Feature
            icon={<Cpu />}
            title="System Coordination"
            desc="Internal coordination layer for structured AI workflows."
          />
          <Feature
            icon={<Shield />}
            title="Operational Control"
            desc="Ensures safe execution boundaries across autonomous systems."
          />
        </div>
      </section>

      {/* ───────── ENTERPRISE VALUE ───────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">
          Built for production governance
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <ValueCard
            icon={<FileText />}
            title="Auditability"
            desc="Every system decision is recorded and traceable."
          />
          <ValueCard
            icon={<Lock />}
            title="Controlled Execution"
            desc="Policies enforce safe system behavior at runtime."
          />
          <ValueCard
            icon={<Brain />}
            title="Explainable Outcomes"
            desc="Structured reasoning for operational visibility."
          />
        </div>
      </section>

      {/* ───────── ACCESS MODEL ───────── */}
      <section className="px-6 py-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Access Model</h3>
        <p className="text-gray-400 max-w-xl mx-auto">
          ARF is available through structured pilot programs for qualified organizations.
          Production access is governed by evaluation and onboarding processes.
        </p>

        <Link
          href="/signup"
          className="inline-block mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          Request Pilot Access
        </Link>
      </section>
    </div>
  );
}

// ───────── UI COMPONENTS ─────────

function Card({ title, children, color }: any) {
  const colors: any = {
    red: 'text-red-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <h3 className={`font-bold mb-2 ${colors[color]}`}>{title}</h3>
      <p className="text-gray-300 text-sm">{children}</p>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 text-center">
      <div className="flex justify-center mb-3 text-blue-400">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

function ValueCard({ icon, title, desc }: any) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <div className="text-blue-400 mb-3 flex justify-center">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 text-center text-gray-400">
      <div className="max-w-4xl mx-auto px-6">

        <h3 className="text-white font-semibold mb-6">
          Connect
        </h3>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a href="mailto:contact@arf.ai" className="flex items-center gap-2">
            <Mail size={16} /> Email
          </a>
          <a href="#" className="flex items-center gap-2">
            <MessageSquare size={16} /> Community
          </a>
          <a href="#" className="flex items-center gap-2">
            <Calendar size={16} /> Book Call
          </a>
          <a href="#" className="flex items-center gap-2">
            <Github size={16} /> GitHub
          </a>
        </div>

        <p className="text-xs text-gray-500">
          © 2026 ARF. Core system is access-controlled. Public materials are
          provided for evaluation purposes only.
        </p>
      </div>
    </footer>
  );
}

// ───────── OPTIONAL ECOSYSTEM SECTION (ABSTRACTED) ─────────

export function Ecosystem() {
  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">
        System Components
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <MiniCard title="Specification Layer"
          desc="Public interface definitions and structural contracts." />

        <MiniCard title="Control Layer"
          desc="Runtime governance and policy enforcement system." />

        <MiniCard title="Enterprise Layer"
          desc="Operational integrations and controlled deployment." />
      </div>
    </section>
  );
}

function MiniCard({ title, desc }: any) {
  return (
    <div className="bg-gray-900 p-5 rounded-lg border border-gray-800">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}