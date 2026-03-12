'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_risk`, {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(setRisk)
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl">Loading risk data...</div></div>;
  if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">Error: {error}</div>;

  const statusColor = risk.status === 'critical' ? 'bg-red-600' : 'bg-yellow-500';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ARF System Risk</h1>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Risk Score</span>
          <span className="text-3xl font-mono">{risk.system_risk}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-white font-medium ${statusColor}`}>
            {risk.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
