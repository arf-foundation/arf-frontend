// Mirrors the mock data in app/dashboard/page.tsx (MOCK_AUDIT_LOGS,
// MOCK_POLICY_VIOLATIONS) -- duplicated rather than imported so this module
// stays server-safe (no 'use client' pull-through) and independent of that
// file. Keep values in sync if the dashboard's mock data changes.

export interface AuditLogEntry {
  id: string;
  action: string;
  component: string;
  riskScore: number;
  decision: string;
  timestamp: string;
  user: string;
}

export interface PolicyViolation {
  id: string;
  policy: string;
  component: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'a1', action: 'ProvisionResource', component: 'payment-api', riskScore: 0.82, decision: 'ESCALATE', timestamp: '2026-05-14 10:23:45', user: 'system' },
  { id: 'a2', action: 'GrantAccess', component: 'auth-service', riskScore: 0.45, decision: 'APPROVE', timestamp: '2026-05-14 09:15:22', user: 'admin@example.com' },
  { id: 'a3', action: 'DeployConfig', component: 'database', riskScore: 0.71, decision: 'ESCALATE', timestamp: '2026-05-13 22:10:05', user: 'devops@example.com' },
  { id: 'a4', action: 'ScaleOut', component: 'cache', riskScore: 0.38, decision: 'APPROVE', timestamp: '2026-05-13 18:30:19', user: 'system' },
  { id: 'a5', action: 'Rollback', component: 'message-queue', riskScore: 0.63, decision: 'DENY', timestamp: '2026-05-13 14:45:03', user: 'sre@example.com' },
];

export const MOCK_POLICY_VIOLATIONS: PolicyViolation[] = [
  { id: 'v1', policy: 'RegionAllowedPolicy', component: 'payment-api', severity: 'high', timestamp: '2026-05-14 11:02:33' },
  { id: 'v2', policy: 'CostThresholdPolicy', component: 'database', severity: 'medium', timestamp: '2026-05-14 10:15:22' },
  { id: 'v3', policy: 'MaxPermissionLevelPolicy', component: 'auth-service', severity: 'low', timestamp: '2026-05-13 23:45:01' },
];

// Inclusive date range in the report's timestamp format ("YYYY-MM-DD HH:MM:SS").
export function withinRange(timestamp: string, startDate: string, endDate: string): boolean {
  const t = new Date(timestamp.replace(' ', 'T')).getTime();
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T23:59:59`).getTime();
  return t >= start && t <= end;
}
