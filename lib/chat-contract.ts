import { isJsonObject } from './request-json';

export const MAX_CHAT_MESSAGE_LENGTH = 4000;

const textFields = [
  'incident_summary', 'normalized_category', 'probable_root_cause',
  'gating_rule_triggered', 'uncertainty_notes',
] as const;
const listFields = [
  'detected_patterns', 'gating_rule_stack', 'policy_flag_frequency_hint', 'policy_flags',
] as const;

export function isAgentOutput(value: unknown): boolean {
  if (!isJsonObject(value)) return false;
  const intent = value.healing_intent;
  return textFields.every(field => typeof value[field] === 'string') &&
    listFields.every(field => Array.isArray(value[field]) && value[field].every(item => typeof item === 'string')) &&
    [value.similarity_confidence, value.risk_score].every(score =>
      typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 1,
    ) && typeof value.pattern_signal_count === 'number' &&
    Number.isSafeInteger(value.pattern_signal_count) && value.pattern_signal_count >= 0 &&
    isJsonObject(intent) && typeof intent.intent_type === 'string' &&
    isJsonObject(intent.parameters) && typeof intent.rollback_required === 'boolean' &&
    ['Advisory', 'Approval', 'Autonomous'].some(mode => mode === intent.execution_mode_recommended);
}
