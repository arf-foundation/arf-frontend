'use client';

import { useEffect, useState } from 'react';
import { MemoryStats as MemoryStatsType } from '../types';

export default function MemoryStats() {
  const [stats, setStats] = useState<MemoryStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/memory/stats`);
        if (!response.ok) throw new Error('Failed to fetch memory stats');
        const data: MemoryStatsType = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Memory Stats</h3>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Memory Stats</h3>
        <p className="text-sm text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Memory Stats</h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">Memory Stats</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Incident Nodes:</span>
          <span className="font-mono">{stats.incident_nodes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Outcome Nodes:</span>
          <span className="font-mono">{stats.outcome_nodes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Edges:</span>
          <span className="font-mono">{stats.edges}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cache Hit Rate:</span>
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
