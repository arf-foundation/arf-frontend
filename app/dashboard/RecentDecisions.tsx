'use client';

import { useEffect, useState } from 'react';
import { Decision } from '../types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

// Extend Decision type locally to include action (we'll compute)
interface ExtendedDecision extends Decision {
  action?: 'approve' | 'deny' | 'escalate';
}

export default function RecentDecisions() {
  const [decisions, setDecisions] = useState<ExtendedDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState<string | null>(null);

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/history`, {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' }
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      const data: Decision[] = await res.json();
      // Enrich with action based on risk_score
      const enriched = data.map(d => ({
        ...d,
        action: d.risk_score !== undefined
          ? d.risk_score < 0.2 ? 'approve' : d.risk_score > 0.8 ? 'deny' : 'escalate'
          : undefined
      }));
      setDecisions(enriched);
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
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/feedback?decision_id=${decisionId}&success=${success}`,
        { method: 'POST', headers: { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '' } }
      );
      if (!res.ok) throw new Error('Feedback failed');
      // Refresh list to reflect updated outcome
      await fetchDecisions();
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setFeedbackLoading(null);
    }
  };

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
            <li key={dec.decision_id} className="py-3 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="font-mono text-sm cursor-help"
                    title={`Full ID: ${dec.decision_id}`}
                  >
                    {dec.decision_id.slice(0, 8)}…
                  </span>
                  {dec.risk_score !== undefined && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Risk: {dec.risk_score.toFixed(3)}
                    </span>
                  )}
                  {dec.action && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      dec.action === 'approve' ? 'bg-green-100 text-green-800' :
                      dec.action === 'deny' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {dec.action}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    dec.outcome === 'success' ? 'bg-green-100 text-green-800' :
                    dec.outcome === 'failure' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
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
                  className={`p-1 rounded hover:bg-gray-100 transition ${
                    dec.outcome === 'success' ? 'text-green-600' : 'text-gray-400'
                  }`}
                  title="Mark as success"
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => handleFeedback(dec.decision_id, false)}
                  disabled={feedbackLoading === dec.decision_id}
                  className={`p-1 rounded hover:bg-gray-100 transition ${
                    dec.outcome === 'failure' ? 'text-red-600' : 'text-gray-400'
                  }`}
                  title="Mark as failure"
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
