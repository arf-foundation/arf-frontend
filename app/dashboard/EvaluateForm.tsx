'use client';

import { useState } from 'react';
import { EvaluateResponse, IncidentReport } from '../types';

type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

const EXAMPLES = {
  latency: {
    service_name: 'api-gateway',
    event_type: 'latency',
    severity: 'high' as SeverityLevel,
    metrics: { latency_ms: 450, error_rate: 0.02 }
  },
  error: {
    service_name: 'auth-service',
    event_type: 'error_rate',
    severity: 'critical' as SeverityLevel,
    metrics: { error_rate: 0.15, throughput: 120 }
  },
  cpu: {
    service_name: 'compute-node',
    event_type: 'cpu',
    severity: 'medium' as SeverityLevel,
    metrics: { cpu_util: 92, memory_util: 78 }
  }
};

export default function EvaluateForm() {
  const [service, setService] = useState('');
  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('low');
  const [metrics, setMetrics] = useState('{}');
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const validateJSON = (str: string): boolean => {
    try {
      JSON.parse(str);
      setJsonError(null);
      return true;
    } catch {
      setJsonError('Invalid JSON format');
      return false;
    }
  };

  const handleMetricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMetrics(value);
    validateJSON(value);
  };

  const loadExample = (key: keyof typeof EXAMPLES) => {
    const ex = EXAMPLES[key];
    setService(ex.service_name);
    setEventType(ex.event_type);
    setSeverity(ex.severity);
    setMetrics(JSON.stringify(ex.metrics, null, 2));
    setJsonError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateJSON(metrics)) return;

    setLoading(true);
    setError(null);
    try {
      const parsedMetrics = JSON.parse(metrics);
      const payload: IncidentReport = {
        service_name: service,
        event_type: eventType,
        severity,
        metrics: parsedMetrics,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/incidents/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Evaluation failed');
      const data: EvaluateResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Test an Incident</h2>

      {/* Example buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400 mr-2">Load example:</span>
        <button
          type="button"
          onClick={() => loadExample('latency')}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition"
        >
          Latency spike
        </button>
        <button
          type="button"
          onClick={() => loadExample('error')}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition"
        >
          Error burst
        </button>
        <button
          type="button"
          onClick={() => loadExample('cpu')}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition"
        >
          High CPU
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Event Type</label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Severity</label>
          <select
            value={severity}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSeverity(e.target.value as SeverityLevel)
            }
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded focus:border-blue-500 focus:outline-none text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Metrics (JSON)</label>
          <textarea
            value={metrics}
            onChange={handleMetricsChange}
            className={`w-full p-2 bg-gray-900 border rounded font-mono text-sm ${
              jsonError ? 'border-red-500' : 'border-gray-700'
            } focus:border-blue-500 focus:outline-none text-white placeholder-gray-500`}
            rows={4}
            placeholder='{"latency_ms": 450, "error_rate": 0.02}'
          />
          {jsonError && <p className="text-red-400 text-sm mt-1">{jsonError}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !!jsonError}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-800/50 transition w-full md:w-auto"
        >
          {loading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          {/* Risk Score & Confidence */}
          <div className="bg-gray-900/50 rounded border border-gray-700 p-4">
            <h3 className="font-semibold mb-3 text-gray-200">Risk Assessment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-400">Risk Score</div>
                <div className="text-2xl font-bold text-blue-400">{result.risk_score.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Epistemic Uncertainty</div>
                <div className="text-2xl font-bold text-gray-200">
                  {result.epistemic_uncertainty !== undefined
                    ? (result.epistemic_uncertainty * 100).toFixed(1) + '%'
                    : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Confidence Interval</div>
                <div className="text-xl font-mono text-gray-300">
                  {result.confidence_interval ? (
                    <>
                      [{result.confidence_interval[0].toFixed(3)},{' '}
                      {result.confidence_interval[1].toFixed(3)}]
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Requires Escalation</div>
                <div className="text-xl font-bold text-gray-200">
                  {result.requires_escalation !== undefined
                    ? result.requires_escalation
                      ? 'Yes'
                      : 'No'
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div className="bg-gray-900/50 rounded border border-gray-700 p-4">
              <h3 className="font-semibold mb-2 text-gray-200">Explanation</h3>
              <p className="text-sm text-gray-300">{result.explanation}</p>
            </div>
          )}

          {/* Recommended Action */}
          {result.recommended_actions && result.recommended_actions.length > 0 && (
            <div className="bg-gray-900/50 rounded border border-gray-700 p-4">
              <h3 className="font-semibold mb-2 text-gray-200">Recommended Action</h3>
              <div className="space-y-2">
                {result.recommended_actions.map((action, idx) => (
                  <div key={idx} className="border-b border-gray-700 pb-2 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-300">{action.action_type}</span>
                      <span className="text-sm text-gray-400">
                        Confidence: {(action.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{action.description}</p>
                    {action.prerequisites && action.prerequisites.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        Prerequisites: {action.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Contributions */}
          {result.risk_contributions && result.risk_contributions.length > 0 && (
            <div className="bg-gray-900/50 rounded border border-gray-700 p-4">
              <h3 className="font-semibold mb-3 text-gray-200">Risk Contributions</h3>
              <div className="space-y-2">
                {result.risk_contributions.map((rc, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="text-sm w-48 text-gray-300">{rc.factor}:</span>
                    <div className="flex-1 h-4 bg-gray-700 rounded">
                      <div
                        className="h-4 bg-blue-600 rounded"
                        style={{ width: `${rc.contribution * 100}%` }}
                      />
                    </div>
                    <span className="text-sm ml-2 text-gray-300">
                      {(rc.contribution * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Incidents */}
          {result.similar_incidents && result.similar_incidents.length > 0 && (
            <div className="bg-gray-900/50 rounded border border-gray-700 p-4">
              <h3 className="font-semibold mb-3 text-gray-200">Similar Incidents</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {result.similar_incidents.map((inc) => (
                  <div key={inc.incident_id} className="border border-gray-700 rounded p-3 bg-gray-800/50">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-400">Component:</span>{' '}
                        <span className="text-gray-300">{inc.component}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Severity:</span>{' '}
                        <span className="text-gray-300">{inc.severity}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Similarity:</span>{' '}
                        <span className="text-gray-300">{inc.similarity_score.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Time:</span>{' '}
                        <span className="text-gray-300">{new Date(inc.timestamp).toLocaleString()}</span>
                      </div>
                      {inc.outcome_success !== undefined && (
                        <div>
                          <span className="font-medium text-gray-400">Outcome:</span>{' '}
                          <span className={inc.outcome_success ? 'text-green-400' : 'text-red-400'}>
                            {inc.outcome_success ? 'Success' : 'Failure'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Metrics: {JSON.stringify(inc.metrics)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policy Violations */}
          {result.policy_violations && result.policy_violations.length > 0 && (
            <div className="bg-red-900/20 border border-red-700 rounded p-4">
              <h3 className="font-semibold mb-2 text-red-300">Policy Violations</h3>
              <ul className="list-disc list-inside text-sm text-red-200">
                {result.policy_violations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
