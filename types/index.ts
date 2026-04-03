export interface MemoryStats {
  incident_nodes: number;
  outcome_nodes: number;
  edges: number;
  cache_hit_rate: number;
  is_operational: boolean;
}
