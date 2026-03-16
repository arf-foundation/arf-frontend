// app/types.ts

export interface RiskData {
  system_risk: number;
  status: string;
  confidence_interval?: [number, number];
}

export interface MemoryStats {
  incident_nodes: number;
  outcome_nodes: number;
  edges: number;
  cache_hit_rate: number;
  is_operational: boolean;
}

export interface Decision {
  decision_id: string;
  outcome: string; // e.g., 'success', 'failure', 'escalate'
  timestamp: string;
  risk_score?: number;
}

export interface SimilarEvent {
  incident_id: string;
  component: string;
  severity: string;
  timestamp: string;
  metrics: Record<string, number>;
  agent_analysis: Record<string, unknown>; // Flexible for future extensions
  similarity_score: number;
}

export interface EvaluateResponse {
  risk_score: number;
  base_risk: number;
  memory_risk: number | null;
  weight: number;
  similar_events: SimilarEvent[];
  confidence: number;
}

export interface HistoryDataPoint {
  timestamp: string;
  risk: number;
}
