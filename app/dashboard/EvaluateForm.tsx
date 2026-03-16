'use client';

import { useState } from 'react';
import { EvaluateResponse, IncidentReport } from '../types';

export default function EvaluateForm() {
  const [service, setService] = useState('');
  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [metrics, setMetrics] = useState('{}');
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Test an Incident</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service Name</label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Event Type</label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Metrics (JSON)</label>
          <textarea
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            className="w-full p-2 border rounded font-mono text-sm"
            rows={4}
            placeholder='{"latency_ms": 450, "error_rate": 0.02}'
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          {/* Risk Score & Confidence */}
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-3">Risk Assessment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Risk Score</div>
                <div className="text-2xl font-bold">{result.risk_score.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Epistemic Uncertainty</div>
                <div className="text-2xl font-bold">{(result.epistemic_uncertainty * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Confidence Interval</div>
                <div className="text-xl font-mono">
                  [{result.confidence_interval[0].toFixed(3)}, {result.confidence_interval[1].toFixed(3)}]
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Requires Escalation</div>
                <div className="text-xl font-bold">{result.requires_escalation ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-2">Explanation</h3>
            <p className="text-sm text-gray-700">{result.explanation}</p>
          </div>

          {/* Risk Contributions */}
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-3">Risk Contributions</h3>
            <div className="space-y-2">
              {result.risk_contributions.map((rc, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="text-sm w-48">{rc.factor}:</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded">
                    <div
                      className="h-4 bg-blue-600 rounded"
                      style={{ width: `${rc.contribution * 100}%` }}
                    />
                  </div>
                  <span className="text-sm ml-2">{(rc.contribution * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Incidents */}
          {result.similar_incidents.length > 0 && (
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">Similar Incidents</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {result.similar_incidents.map((inc) => (
                  <div key={inc.incident_id} className="border rounded p-3 bg-white">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div><span className="font-medium">Component:</span> {inc.component}</div>
                      <div><span className="font-medium">Severity:</span> {inc.severity}</div>
                      <div><span className="font-medium">Similarity:</span> {inc.similarity_score.toFixed(3)}</div>
                      <div><span className="font-medium">Time:</span> {new Date(inc.timestamp).toLocaleString()}</div>
                      {inc.outcome_success !== undefined && (
                        <div><span className="font-medium">Outcome:</span> {inc.outcome_success ? 'Success' : 'Failure'}</div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Metrics: {JSON.stringify(inc.metrics)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {result.recommended_actions.length > 0 && (
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">Recommended Actions</h3>
              <div className="space-y-3">
                {result.recommended_actions.map((action, idx) => (
                  <div key={idx} className="border rounded p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{action.action_type}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Confidence: {(action.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{action.description}</p>
                    {action.prerequisites && action.prerequisites.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        Prerequisites: {action.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policy Violations */}
          {result.policy_violations && result.policy_violations.length > 0 && (
            <div className="p-4 bg-red-50 rounded border border-red-200">
              <h3 className="font-semibold mb-2 text-red-800">Policy Violations</h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {result.policy_violations.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
