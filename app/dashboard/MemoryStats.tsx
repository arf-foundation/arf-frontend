'use client';

import { useEffect, useState } from 'react';
import { MemoryStats as MemoryStatsType } from '../types';

export default function MemoryStats() {
  const [stats, setStats] = useState<MemoryStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/memory/stats`, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setStats(data))
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-24 bg-gray-200 rounded"></div>;
  if (error) return <div className="text-red-600">Error loading memory stats</div>;
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Memory Stats</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Incident nodes:</span>
          <span className="font-mono">{stats.incident_nodes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Outcome nodes:</span>
          <span className="font-mono">{stats.outcome_nodes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Edges:</span>
          <span className="font-mono">{stats.edges}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cache hit rate:</span>
          <span className="font-mono">{(stats.cache_hit_rate * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Operational:</span>
          <span className={`font-mono ${stats.is_operational ? 'text-green-600' : 'text-red-600'}`}>
            {stats.is_operational ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
}
