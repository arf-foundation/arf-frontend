import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // ----- Basic signal detection (simulated) -----
    const isDestructive = lower.includes('delete') || lower.includes('drop') || lower.includes('destroy');
    const isCustomerFacing = lower.includes('chatbot') || lower.includes('customer') || lower.includes('claim');
    const isDatabase = lower.includes('database') || lower.includes('db') || lower.includes('sql');

    // ----- Build mock response -----
    const mockResponse = {
      simulated: true,
      note: 'This is a simulated advisory response. The real ARF engine requires pilot access and is not publicly available.',
      incident_summary: `Incident analyzed: ${message.substring(0, 120)}`,
      normalized_category: isDatabase ? 'Database' : 'Configuration',
      detected_patterns: isDestructive ? ['DestructiveAction'] : ['Misconfiguration'],
      pattern_signal_count: isDestructive ? 3 : 2,
      probable_root_cause: isCustomerFacing ? 'Customer‑facing AI output without review' : 'Unclear from description',
      similarity_confidence: isDestructive ? 0.82 : 0.65,
      risk_score: isDestructive ? 0.85 : isCustomerFacing ? 0.62 : 0.45,
      gating_rule_triggered: isDestructive ? 'risk_threshold_exceeded' : 'escalate_customer_facing',
      gating_rule_stack: isDestructive
        ? ['db_network_security', 'risk_threshold_exceeded']
        : ['customer_facing', 'policy_review'],
      policy_flag_frequency_hint: [],
      healing_intent: {
        intent_type: isDestructive ? 'RollbackDeployment' : 'HumanEscalation',
        parameters: {},
        rollback_required: isDestructive,
        execution_mode_recommended: isDestructive ? 'Approval' : 'Advisory',
      },
      policy_flags: isDestructive ? ['missing_observability', 'unauthorized_action'] : ['customer_facing'],
      uncertainty_notes: 'This is a simulated response for demonstration purposes only.',
    };

    // Add rate‑limit header (friendly)
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', '10');
    headers.set('X-RateLimit-Remaining', '9');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return NextResponse.json(mockResponse, { status: 200, headers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
