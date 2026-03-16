'use client';

import { useEffect, useState } from 'react';
import { Decision } from '../types';

export default function RecentDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/history`, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setDecisions(data))
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-24 bg-gray-200 rounded"></div>;
  if (error) return <div className="text-red-600">Error loading recent decisions</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Decisions</h2>
      {decisions.length === 0 ? (
        <p className="text-gray-500">No decisions yet</p>
      ) : (
        <ul className="divide-y">
          {decisions.slice(0, 5).map((dec) => (
            <li key={dec.decision_id} className="py-2 flex justify-between">
              <span className="font-mono text-sm">{dec.decision_id.slice(0, 8)}…</span>
              <span className={`px-2 py-1 rounded text-xs ${
                dec.outcome === 'success' ? 'bg-green-100 text-green-800' :
                dec.outcome === 'failure' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {dec.outcome}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
