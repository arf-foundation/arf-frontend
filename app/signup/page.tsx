'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, ArrowRight, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateApiKey = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the public registration endpoint (rate‑limited, no admin key required)
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create API key');
      }

      const data = await response.json();
      const newKey = data.api_key;
      setApiKey(newKey);
      localStorage.setItem('arf_api_key', newKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Get your API key</h1>
        <p className="text-gray-400 text-center mb-8">
          Start using ARF for free – 1,000 evaluations per month.
        </p>

        {!apiKey ? (
          <div className="space-y-4">
            <button
              onClick={generateApiKey}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your key...
                </>
              ) : (
                <>
                  Generate Free API Key
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between border border-gray-700">
              <code className="text-sm font-mono text-green-300 break-all">
                {apiKey}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-700 rounded transition"
                aria-label="Copy API key"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-300">
              Your API key has been saved to this browser. You can use it to authenticate requests.
            </p>
            <button
              onClick={goToDashboard}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
