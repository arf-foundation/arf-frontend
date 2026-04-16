'use client';

import { useEffect, useState } from 'react';
import { Decision } from '../types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ExtendedDecision extends Decision {
  action?: 'approve' | 'deny' | 'escalate';
}

// Optional: seed some mock decisions for demonstration
const MOCK_DECISIONS: ExtendedDecision[] = [
  {
    decision_id: 'mock-001',
    outcome: 'success',
    timestamp: new Date().toISOString(),
    risk_score: 0.25,
    action: 'approve',
  },
  {
    decision_id: 'mock-002',
    outcome: 'pending',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    risk_score: 0.67,
    action: 'escalate',
  },
  {
    decision_id: 'mock-003',
    outcome: 'failure',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    risk_score: 0.89,
    action: 'deny',
  },
];

export default function RecentDecisions() {
  const [decisions, setDecisions] = useState<ExtendedDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState<string | null>(null);

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      // Sandbox has no /history endpoint – use mock data instead
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // You can replace MOCK_DECISIONS with [] to show "No decisions yet"
      setDecisions(MOCK_DECISIONS);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleFeedback = async (decisionId: string, success: boolean) => {
    setFeedbackLoading(decisionId);
    // Sandbox has no feedback endpoint – just log and pretend success
    console.log(`[Mock] Feedback for ${decisionId}: ${success ? 'success' : 'failure'}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // Optionally refresh decisions (mock stays same)
    setFeedbackLoading(null);
  };

  if (loading) return <div className="animate-pulse h-24 bg-gray-800 rounded"></div>;
  if (error) return <div className="text-red-400">Error loading recent decisions</div>;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">Recent Decisions</h2>
      {decisions.length === 0 ? (
        <p className="text-gray-400">No decisions yet</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {decisions.slice(0, 5).map((dec) => (
            <li key={dec.decision_id} className="py-3 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span 
                    className="font-mono text-sm cursor-help text-gray-300"
                    title={`Full ID: ${dec.decision_id}`}
                  >
                    {dec.decision_id.slice(0, 8)}…
                  </span>
                  {dec.risk_score !== undefined && (
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                      Risk: {dec.risk_score.toFixed(3)}
                    </span>
                  )}
                  {dec.action && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      dec.action === 'approve' ? 'bg-green-900/50 text-green-300' :
                      dec.action === 'deny' ? 'bg-red-900/50 text-red-300' :
                      'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {dec.action}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    dec.outcome === 'success' ? 'bg-green-900/50 text-green-300' :
                    dec.outcome === 'failure' ? 'bg-red-900/50 text-red-300' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {dec.outcome || 'pending'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(dec.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleFeedback(dec.decision_id, true)}
                  disabled={feedbackLoading === dec.decision_id}
                  className={`p-1 rounded hover:bg-gray-700 transition ${
                    dec.outcome === 'success' ? 'text-green-400' : 'text-gray-500'
                  }`}
                  title="Mark as success (mock)"
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => handleFeedback(dec.decision_id, false)}
                  disabled={feedbackLoading === dec.decision_id}
                  className={`p-1 rounded hover:bg-gray-700 transition ${
                    dec.outcome === 'failure' ? 'text-red-400' : 'text-gray-500'
                  }`}
                  title="Mark as failure (mock)"
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
