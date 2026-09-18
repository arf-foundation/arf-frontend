import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { AuditLogEntry, PolicyViolation } from '../../../lib/governanceMockData';

// react-pdf's default hyphenation engine inserts a literal hyphen when a
// word doesn't fit its line ("GOVERNANCE DECI-SIONS") -- fine for justified
// body copy, wrong for short uppercase tile labels. Disabling it globally:
// wrapping still happens at word boundaries, just never mid-word.
Font.registerHyphenationCallback((word) => [word]);

// Literal hex values -- react-pdf has no CSS custom property support, so
// these are copied from app/globals.css's @theme block (--color-arf-blue
// etc.) rather than referenced. Keep in sync if the brand palette changes.
const COLOR = {
  blue: '#3358e8',
  purple: '#7a4be0',
  ink: '#191816',
  ink3: '#56534d',
  muted: '#605c54',
  canvas: '#faf9f7',
  raised: '#f5f4f1',
  line: '#e4e1db',
  high: '#b3392a',
  medium: '#a66a1e',
  low: '#3f7a5c',
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: COLOR.ink, fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: { width: 14, height: 14, borderRadius: 4, backgroundColor: COLOR.blue },
  brandName: { fontSize: 12, fontWeight: 700 },
  sandboxBadge: {
    fontSize: 8,
    fontWeight: 700,
    color: COLOR.blue,
    borderWidth: 1,
    borderColor: COLOR.blue,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  title: { fontSize: 20, fontWeight: 700, marginTop: 14, marginBottom: 2 },
  meta: { fontSize: 9, color: COLOR.muted, marginBottom: 18 },
  divider: { borderBottomWidth: 1, borderBottomColor: COLOR.line, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', gap: 14, marginBottom: 22 },
  summaryTile: { flex: 1, backgroundColor: COLOR.raised, borderRadius: 8, padding: 10 },
  summaryValue: { fontSize: 18, fontWeight: 700, marginBottom: 2 },
  summaryLabel: { fontSize: 8, color: COLOR.muted, textTransform: 'uppercase', letterSpacing: 0.3, lineHeight: 1.3 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 8, marginTop: 4 },
  table: { marginBottom: 20 },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.ink,
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: COLOR.line, paddingVertical: 5 },
  th: { fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: COLOR.muted, letterSpacing: 0.4 },
  td: { fontSize: 9, color: COLOR.ink3 },
  colTime: { width: '20%' },
  colComponent: { width: '18%' },
  colAction: { width: '20%' },
  colRisk: { width: '12%', textAlign: 'right' },
  colDecision: { width: '15%', textAlign: 'right' },
  colUser: { width: '15%', textAlign: 'right' },
  colPolicy: { width: '30%' },
  colOn: { width: '30%' },
  colSeverity: { width: '20%', textAlign: 'right' },
  colViolationTime: { width: '20%', textAlign: 'right' },
  badge: {
    fontSize: 7,
    fontWeight: 700,
    color: '#ffffff',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-end',
  },
  emptyState: { fontSize: 9, color: COLOR.muted, fontStyle: 'italic', marginBottom: 20 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: COLOR.line,
    paddingTop: 10,
  },
  footerText: { fontSize: 8, color: COLOR.muted, lineHeight: 1.5 },
});

function decisionColor(decision: string) {
  if (decision === 'ESCALATE') return COLOR.high;
  if (decision === 'DENY') return COLOR.medium;
  return COLOR.low;
}

function severityColor(severity: PolicyViolation['severity']) {
  if (severity === 'high') return COLOR.high;
  if (severity === 'medium') return COLOR.medium;
  return COLOR.blue;
}

export function CompliancePdfDocument({
  auditLogs,
  violations,
  startDate,
  endDate,
  generatedAt,
}: {
  auditLogs: AuditLogEntry[];
  violations: PolicyViolation[];
  startDate: string;
  endDate: string;
  generatedAt: string;
}) {
  const escalations = auditLogs.filter((l) => l.decision === 'ESCALATE').length;
  const highSeverity = violations.filter((v) => v.severity === 'high').length;

  return (
    <Document title={`ARF Governance Compliance Report (${startDate} to ${endDate})`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoMark} />
            <Text style={styles.brandName}>ARF AI</Text>
          </View>
          <Text style={styles.sandboxBadge}>PUBLIC SANDBOX — SIMULATED DATA</Text>
        </View>

        <Text style={styles.title}>Governance Compliance Report</Text>
        <Text style={styles.meta}>
          Range {startDate} to {endDate}  ·  Generated {generatedAt}
        </Text>
        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryValue}>{auditLogs.length}</Text>
            <Text style={styles.summaryLabel}>Governance decisions</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryValue}>{escalations}</Text>
            <Text style={styles.summaryLabel}>Escalated for review</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryValue}>{violations.length}</Text>
            <Text style={styles.summaryLabel}>Policy violations</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.summaryValue}>{highSeverity}</Text>
            <Text style={styles.summaryLabel}>High severity</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Governance Decisions</Text>
        {auditLogs.length === 0 ? (
          <Text style={styles.emptyState}>No governance decisions recorded in this date range.</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, styles.colTime]}>Timestamp</Text>
              <Text style={[styles.th, styles.colComponent]}>Component</Text>
              <Text style={[styles.th, styles.colAction]}>Action</Text>
              <Text style={[styles.th, styles.colRisk]}>Risk</Text>
              <Text style={[styles.th, styles.colDecision]}>Decision</Text>
              <Text style={[styles.th, styles.colUser]}>User</Text>
            </View>
            {auditLogs.map((log) => (
              <View key={log.id} style={styles.tableRow}>
                <Text style={[styles.td, styles.colTime]}>{log.timestamp}</Text>
                <Text style={[styles.td, styles.colComponent]}>{log.component}</Text>
                <Text style={[styles.td, styles.colAction]}>{log.action}</Text>
                <Text style={[styles.td, styles.colRisk]}>{log.riskScore.toFixed(2)}</Text>
                <View style={styles.colDecision}>
                  <Text style={[styles.badge, { backgroundColor: decisionColor(log.decision) }]}>{log.decision}</Text>
                </View>
                <Text style={[styles.td, styles.colUser]}>{log.user}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Policy Violations</Text>
        {violations.length === 0 ? (
          <Text style={styles.emptyState}>No policy violations recorded in this date range.</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, styles.colPolicy]}>Policy</Text>
              <Text style={[styles.th, styles.colOn]}>Component</Text>
              <Text style={[styles.th, styles.colSeverity]}>Severity</Text>
              <Text style={[styles.th, styles.colViolationTime]}>Timestamp</Text>
            </View>
            {violations.map((v) => (
              <View key={v.id} style={styles.tableRow}>
                <Text style={[styles.td, styles.colPolicy]}>{v.policy}</Text>
                <Text style={[styles.td, styles.colOn]}>{v.component}</Text>
                <View style={styles.colSeverity}>
                  <Text style={[styles.badge, { backgroundColor: severityColor(v.severity) }]}>
                    {v.severity.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.td, styles.colViolationTime]}>{v.timestamp}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Sandbox illustration — this report is generated from arf-ai.com&rsquo;s public sandbox, using simulated
            governance data, not a live production evaluation. Production deployments generate compliance reports
            from real, immutable, cryptographically-signable decision records. Request pilot access at arf-ai.com to
            evaluate the real engine.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
