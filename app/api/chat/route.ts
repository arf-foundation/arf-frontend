import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    // Simulate ARF governance output (mock response)
    const mockResponse = {
      incident_summary: `Incident analyzed: ${message.substring(0, 100)}`,
      normalized_category: message.toLowerCase().includes('database') ? 'Database' : 'Configuration',
      detected_patterns: ['Misconfiguration'],
      pattern_signal_count: 2,
      probable_root_cause: message.toLowerCase().includes('chatbot') ? 'Chatbot hallucination' : 'Unclear from description',
      similarity_confidence: 0.75,
      risk_score: message.toLowerCase().includes('delete') ? 0.85 : 0.45,
      gating_rule_triggered: 'risk_threshold_exceeded',
      gating_rule_stack: ['db_network_security', 'risk_threshold_exceeded'],
      policy_flag_frequency_hint: [],
      healing_intent: {
        intent_type: message.toLowerCase().includes('delete') ? 'RollbackDeployment' : 'HumanEscalation',
        parameters: {},
        rollback_required: true,
        execution_mode_recommended: message.toLowerCase().includes('delete') ? 'Approval' : 'Advisory'
      },
      policy_flags: ['missing_observability'],
      uncertainty_notes: 'This is a simulated response for demo purposes.'
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 });
  }
}
