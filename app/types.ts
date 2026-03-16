// ... existing RiskData, MemoryStats, etc. ...

// Incident report sent to /v1/incidents/evaluate
export interface IncidentReport {
  service_name: string;
  event_type: string;          // e.g., "latency", "error_rate"
  severity: 'low' | 'medium' | 'high' | 'critical';
  metrics: Record<string, number>; // e.g., { latency_ms: 450, error_rate: 0.02 }
}

// Risk contribution factor
export interface RiskContribution {
  factor: string;              // e.g., "past_similar_incidents", "policy_violation"
  contribution: number;         // 0-1
}

// Similar incident from memory
export interface SimilarIncident {
  incident_id: string;
  component: string;
  severity: string;
  timestamp: string;
  metrics: Record<string, number>;
  similarity_score: number;
  outcome_success?: boolean;    // optional, if outcome recorded
}

// Healing action recommendation
export interface HealingAction {
  action_type: string;          // e.g., "restart_service", "scale_up"
  description: string;
  confidence: number;            // 0-1
  prerequisites?: string[];
}

// The full HealingIntent response
export interface EvaluateResponse {
  risk_score: number;
  epistemic_uncertainty: number; // 0-1 or classification
  confidence_interval: [number, number];
  risk_contributions: RiskContribution[];
  similar_incidents: SimilarIncident[];
  recommended_actions: HealingAction[];
  explanation: string;
  policy_violations?: string[];
  requires_escalation: boolean;
}
