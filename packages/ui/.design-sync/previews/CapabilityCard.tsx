import { FileText, Network, Shield } from 'lucide-react';
import { CapabilityCard } from '@arf/ui';

export function PolicyEnforcement() {
  return (
    <CapabilityCard
      n="01"
      title="Policy Enforcement"
      description="Deterministic policy gates that cannot be bypassed."
      icon={Shield}
      items={['Deterministic execution gates', 'Approval workflows', 'Regional policy controls', 'Cost guardrails']}
    />
  );
}

export function DecisionGovernance() {
  return (
    <CapabilityCard
      n="02"
      title="Decision Governance"
      description="Tamper-evident records with cryptographic signing."
      icon={FileText}
      items={['Full audit trail', 'Cryptographic attestation', 'Attribution & accountability', 'Regulatory-ready logs']}
    />
  );
}

export function OperationalTransparency() {
  return (
    <CapabilityCard
      n="04"
      title="Operational Transparency"
      description="Explainable risk scoring, causal reasoning, and real-time observability."
      icon={Network}
      items={['Explainable risk scores', 'Counterfactual what-if analysis', 'Real-time dashboards', 'Causal attribution']}
    />
  );
}
