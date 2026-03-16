// app/dashboard/EvaluateForm.tsx
'use client';

import { useState } from 'react';
import { EvaluateResponse } from '../types';

export default function EvaluateForm() {
  const [service, setService] = useState('');
  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState('low');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/incidents/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: service,
          event_type: eventType,
          severity,
          metrics: parsedMetrics,
        }),
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
      <h2 className="text-xl font-bold mb-4">Test an Intent</h2>
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
            onChange={(e) => setSeverity(e.target.value)}
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
        <div className="mt-6 p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold mb-2">Result</h3>
          <pre className="text-sm overflow-auto bg-gray-100 p-3 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div><strong>Risk Score:</strong> {result.risk_score.toFixed(3)}</div>
            <div><strong>Base Risk:</strong> {result.base_risk.toFixed(3)}</div>
            <div><strong>Memory Risk:</strong> {result.memory_risk?.toFixed(3) ?? 'N/A'}</div>
            <div><strong>Weight:</strong> {result.weight.toFixed(3)}</div>
            <div><strong>Confidence:</strong> {result.confidence.toFixed(3)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
