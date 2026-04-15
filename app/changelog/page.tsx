'use client';

import { useEffect, useState } from 'react';
import { Calendar, Tag, ArrowRight, Copy, Check, Github, Rocket, Mail } from 'lucide-react';
import Link from 'next/link';

// Types for our manual changelog entries
interface ChangelogEntry {
  date: string;          // ISO date (YYYY-MM-DD)
  title: string;
  description: string;
  type: 'public' | 'pilot';  // public = spec/demo, pilot = core engine
  link?: string;          // optional URL (e.g., GitHub release, commit, or pilot documentation)
}

// Sandbox API snippet (mock, not real engine)
const CURL_COMMAND = `curl -X POST https://sandbox.arf.dev/v1/evaluate \\
  -H "Content-Type: application/json" \\
  -d '{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}'`;

export default function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    document.title = "ARF – Changelog & Pilot Updates";
  }, []);

  const copyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const res = await fetch('/data/changelog.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Expecting { entries: ChangelogEntry[] }
        setEntries(data.entries || []);
      } catch (err) {
        console.error('Failed to load changelog:', err);
        setError('Unable to load changelog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchChangelog();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Changelog</h1>
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              What’s New in ARF
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Updates to the public specification, demo UI, and the proprietary core engine (available to pilot customers).
            </p>
          </div>

          {/* Changelog entries */}
          <div className="space-y-6 mb-12">
            {entries.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No updates yet. Check back soon!
              </div>
            ) : (
              entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 p-5 hover:border-blue-500 transition"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        entry.type === 'public'
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-purple-900 text-purple-200'
                      }`}
                    >
                      {entry.type === 'public' ? '📘 Public' : '✈️ Pilot Program'}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(entry.date)}
                    </span>
                    {entry.link && (
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline flex items-center gap-1"
                      >
                        <Tag size={14} /> Details
                      </a>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
                  <p className="text-gray-300 text-sm">{entry.description}</p>
                  {entry.type === 'pilot' && (
                    <div className="mt-3">
                      <Link
                        href="/signup"
                        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        Request pilot access to experience this feature →
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Newsletter signup – lead generation */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-12 text-center">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h2 className="text-xl font-semibold mb-2">Get updates in your inbox</h2>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive changelog summaries and early access announcements.
            </p>
            <form
              action="https://your-newsletter-provider.com/subscribe" // Replace with your actual endpoint
              method="POST"
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">No spam. Unsubscribe anytime.</p>
          </div>

          {/* Sandbox API section (kept) */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Try the Sandbox API</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
                <pre className="text-sm font-mono text-green-300 flex-1 overflow-x-auto whitespace-pre-wrap break-all">{CURL_COMMAND}</pre>
                <button
                  onClick={() => copyCode(CURL_COMMAND)}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition shrink-0"
                  aria-label="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
                </button>
              </div>
              <p className="text-sm text-yellow-300">
                ⚠️ This is a <strong>sanitized demo endpoint</strong>. It does <strong>not</strong> use the protected Bayesian engine. For pilot access, <Link href="/signup" className="underline">request here</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
