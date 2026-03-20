'use client';

import { useEffect, useState, useCallback } from 'react';
import { MemoryStats as MemoryStatsType } from '../types';
import { HelpCircle } from 'lucide-react';

export default function MemoryStats() {
  const [stats, setStats] = useState<MemoryStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/memory/stats`);
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      const data: MemoryStatsType = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, retryCount]);

  const handleRetry = () => setRetryCount(c => c + 1);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="font-semibold mb-2 text-gray-200">Memory Stats</h3>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="font-semibold mb-2 text-gray-200">Memory Stats</h3>
        <p className="text-sm text-red-400 mb-2">Error: {error}</p>
        <button
          onClick={handleRetry}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="font-semibold mb-2 text-gray-200">Memory Stats</h3>
        <p className="text-sm text-gray-400">No data available</p>
      </div>
    );
  }

  // If not operational, show helpful message
  if (!stats.is_operational) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="font-semibold mb-2 text-gray-200">Memory Stats</h3>
        <p className="text-sm text-gray-300">
          Memory is not yet populated – start by evaluating incidents to build semantic memory.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          (In OSS edition, memory is in‑memory only and resets on restart.)
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
      <h3 className="font-semibold mb-2 text-gray-200">Memory Stats</h3>
      <div className="space-y-2 text-sm">
        <StatRow
          label="Incident Nodes"
          value={stats.incident_nodes}
          tooltip="Number of incidents stored in semantic memory"
        />
        <StatRow
          label="Outcome Nodes"
          value={stats.outcome_nodes}
          tooltip="Number of outcomes (actions taken) recorded"
        />
        <StatRow
          label="Edges"
          value={stats.edges}
          tooltip="Connections between incidents and outcomes"
        />
        <StatRow
          label="Cache Hit Rate"
          value={`${(stats.cache_hit_rate * 100).toFixed(1)}%`}
          tooltip="How often similar incidents are retrieved from cache vs. recomputed"
        />
        <StatRow
          label="Operational"
          value={stats.is_operational ? 'Yes' : 'No'}
          tooltip="Memory system is ready to serve queries"
          valueClass={stats.is_operational ? 'text-green-400' : 'text-red-400'}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value, tooltip, valueClass = '' }: { label: string; value: string | number; tooltip: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center group">
      <span className="text-gray-400 flex items-center gap-1">
        {label}
        <span className="relative inline-block">
          <HelpCircle size={14} className="text-gray-500 cursor-help" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            {tooltip}
          </span>
        </span>
      </span>
      <span className={`font-mono ${valueClass || 'text-gray-300'}`}>{value}</span>
    </div>
  );
}
