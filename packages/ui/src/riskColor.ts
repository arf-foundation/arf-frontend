// Shared severity color for anything keyed off a 0-1 risk value (the gauge
// arc, the Risk Score number). Semantic status color, intentionally not the
// brand accent -- kept as literal hex, matching StatusBadge's own mapping.
export function riskColor(risk: number): string {
  if (risk < 0.4) return '#3f7a5c';
  if (risk < 0.7) return '#9c611c';
  return '#b3392a';
}
