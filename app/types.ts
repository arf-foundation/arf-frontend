// Risk data for the main dashboard
export interface RiskData {
  system_risk: number;
  status: string;
  confidence_interval?: [number, number];
}

// Memory statistics from the backend
export interface MemoryStats {
  incident_nodes: number;
  outcome_nodes: number;
  edges: number;
  cache_hit_rate: number;
  is_operational: boolean;
}

// Decision history item
export interface Decision {
  decision_id: string;
  outcome: string; // e.g., 'success', 'failure', 'escalate'
  timestamp: string;
  risk_score?: number;
  action?: 'approve' | 'deny' | 'escalate'; // derived from risk_score
}

// Similar incident from memory
export interface SimilarIncident {
  incident_id: string;
  component: string;
  severity: string;
  timestamp: string;
  metrics: Record<string, number>;
  similarity_score: number;
  outcome_success?: boolean; // optional, if outcome recorded
}

// Risk contribution factor (additive contributions from Bayesian components)
export interface RiskFactor {
  [key: string]: number; // e.g., "conjugate", "hyperprior", "hmc"
}

// Healing action recommendation
export interface HealingAction {
  action_type: string;          // e.g., "restart_service", "scale_up"
  description: string;
  confidence: number;            // 0-1
  prerequisites?: string[];
}

// The full HealingIntent response from /v1/incidents/evaluate
export interface EvaluateResponse {
  risk_score: number;
  epistemic_uncertainty: number; // 0-1 or classification
  confidence_interval: [number, number];
  risk_contributions?: RiskContribution[]; // legacy, kept for compatibility
  risk_factors?: RiskFactor;               // new additive factors (preferred)
  similar_incidents: SimilarIncident[];
  recommended_actions: HealingAction[];
  explanation: string;
  policy_violations?: string[];
  requires_escalation: boolean;
}

// Risk contribution factor (legacy)
export interface RiskContribution {
  factor: string;              // e.g., "past_similar_incidents", "policy_violation"
  contribution: number;         // 0-1
}

// Incident report sent to /v1/incidents/evaluate
export interface IncidentReport {
  service_name: string;
  event_type: string;          // e.g., "latency", "error_rate"
  severity: 'low' | 'medium' | 'high' | 'critical';
  metrics: Record<string, number>; // e.g., { latency_ms: 450, error_rate: 0.02 }
}

// Historical data point for charts
export interface HistoryDataPoint {
  timestamp: string;
  risk: number;
}
