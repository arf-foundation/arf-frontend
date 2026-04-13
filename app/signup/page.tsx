'use client';

import { useState } from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    useCase: '',
    expectedVolume: '',
    cloudEnvironment: '',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API call – replace with your actual pilot request endpoint
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In production: POST to /api/pilot/request
      console.log('Pilot request submitted:', formData);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit request. Please email petter2025us@outlook.com directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Request received</h1>
          <p className="text-gray-300 mb-4">
            Thank you for your interest in the ARF pilot program. Our founder will review your request and contact you within 3–5 business days.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Request Pilot Access</h1>
          <p className="text-gray-400">
            The core ARF engine is access‑controlled and offered under outcome‑based pricing.  
            Fill out this form to start a conversation with our founder.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Work email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                Company / Organisation *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="useCase" className="block text-sm font-medium text-gray-300 mb-1">
                Use case description *
              </label>
              <textarea
                id="useCase"
                name="useCase"
                rows={3}
                required
                value={formData.useCase}
                onChange={handleChange}
                placeholder="What AI systems would you govern with ARF? What risks do you need to mitigate?"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="expectedVolume" className="block text-sm font-medium text-gray-300 mb-1">
                Expected monthly incident evaluations *
              </label>
              <select
                id="expectedVolume"
                name="expectedVolume"
                required
                value={formData.expectedVolume}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="">Select...</option>
                <option value="<1,000">&lt; 1,000</option>
                <option value="1,000–10,000">1,000 – 10,000</option>
                <option value="10,000–100,000">10,000 – 100,000</option>
                <option value=">100,000">&gt; 100,000</option>
              </select>
            </div>

            <div>
              <label htmlFor="cloudEnvironment" className="block text-sm font-medium text-gray-300 mb-1">
                Cloud environment *
              </label>
              <select
                id="cloudEnvironment"
                name="cloudEnvironment"
                required
                value={formData.cloudEnvironment}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="">Select...</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="GCP">GCP</option>
                <option value="On‑premises">On‑premises / Private cloud</option>
                <option value="Multi‑cloud">Multi‑cloud</option>
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                I understand that the ARF core engine is not open source and that access is granted at the founder’s discretion.  
                I agree to the{' '}
                <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.agreeToTerms}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Pilot Request
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Prefer to email? Contact us directly at{' '}
            <a href="mailto:petter2025us@outlook.com" className="text-blue-400 hover:underline">
              petter2025us@outlook.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
