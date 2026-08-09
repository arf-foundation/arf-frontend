import { SandboxCard } from '@arf/ui';

const CURL_COMMAND = `curl -X POST https://arf-ai-arf-sandbox-api.hf.space/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

// Sample shape from a real sandbox response, not invented.
const SAMPLE_RESPONSE = {
  status: 'success',
  recommendation: 'ESCALATE',
  risk_score: 0.6241,
  confidence: 0.8022,
  justification:
    'Simulated evaluation for api: latency severity=high. Risk score 0.62 -> ESCALATE. (Mock response, not real inference.)',
  policy_violations: [],
};

export function WithResponse() {
  return (
    <SandboxCard
      curlCommand={CURL_COMMAND}
      loading={false}
      response={SAMPLE_RESPONSE}
      error={null}
      copied={false}
      onTryLive={() => {}}
      onCopy={() => {}}
    />
  );
}

export function Loading() {
  return (
    <SandboxCard
      curlCommand={CURL_COMMAND}
      loading
      response={null}
      error={null}
      copied={false}
      onTryLive={() => {}}
      onCopy={() => {}}
    />
  );
}

export function ErrorState() {
  return (
    <SandboxCard
      curlCommand={CURL_COMMAND}
      loading={false}
      response={null}
      error="HTTP 503"
      copied={false}
      onTryLive={() => {}}
      onCopy={() => {}}
    />
  );
}
