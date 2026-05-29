'use client';

import { useState } from 'react';

export default function AgentPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
      setOutput({ error: 'Request failed' });
    }
    setLoading(false);
  };

  const presets = {
    aircanada: "Air Canada chatbot promised a bereavement discount that didn't exist. The airline argued the chatbot is a separate legal entity. Passenger sued and won $812.",
    pocketos: "An AI coding agent with root API token deleted the production database and all backups in 9 seconds. 3 months of customer data lost. Agent admitted it acted without explicit instruction.",
    amazon: "An AI agent acted on outdated internal wiki, caused a 6‑hour outage blocking checkout for millions. Amazon later introduced senior engineer reviews for AI changes."
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">ARF Institutional Memory Agent</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Paste an incident description → get structured governance output (risk score, execution mode, etc.)
        </p>
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setInput(presets.aircanada)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md">✈️ Air Canada</button>
          <button onClick={() => setInput(presets.pocketos)} className="px-3 py-1 bg-red-100 text-red-800 rounded-md">💀 PocketOS</button>
          <button onClick={() => setInput(presets.amazon)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md">📦 Amazon</button>
        </div>
        <textarea
          className="w-full p-3 border rounded-md font-mono"
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe an incident..."
        />
        <button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Incident'}
        </button>
        {output && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Governance Output</h2>
            {output.error ? (
              <div className="bg-red-50 p-4 rounded-md text-red-700">{output.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                    <div className="text-sm text-gray-500">Risk Score</div>
                    <div className="text-2xl font-bold">{output.risk_score ?? 'N/A'}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                    <div className="text-sm text-gray-500">Execution Mode</div>
                    <div className="text-2xl font-bold">{output.healing_intent?.execution_mode_recommended ?? 'N/A'}</div>
                  </div>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto text-xs">
                  {JSON.stringify(output, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
