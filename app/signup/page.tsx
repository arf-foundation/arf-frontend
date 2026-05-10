'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Check, Loader2, Shield,  Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    industry: '',
    jobRole: '',
    useCase: '',
    expectedVolume: '',
    cloudEnvironment: '',
    aiMaturity: '',
    budgetApproved: '',
    timeline: '',
    agreeToTerms: false,
  });

  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>
  >({});

  // Auto-save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('arf-pilot-form', JSON.stringify(formData));
  }, [formData]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('arf-pilot-form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateStep = (s: number): boolean => {
    const errors: Record<string, string> = {};
    const step1Fields = ['fullName', 'email', 'company', 'industry', 'jobRole'];
    const step2Fields = ['useCase', 'expectedVolume', 'cloudEnvironment', 'aiMaturity'];
    const fields = s === 1 ? step1Fields : step2Fields;
    fields.forEach(key => {
      if (!formData[key as keyof typeof formData]) {
        errors[key] = 'This field is required';
      }
    });
    setFieldErrors(errors);
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      inputRefs.current[firstErrorKey]?.focus();
    }
    return Object.keys(errors).length === 0;
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    const required = [
      'fullName', 'email', 'company', 'industry', 'jobRole',
      'useCase', 'expectedVolume', 'cloudEnvironment', 'aiMaturity',
      'timeline'
    ];
    required.forEach(key => {
      if (!formData[key as keyof typeof formData]) {
        errors[key] = 'This field is required';
      }
    });
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy.';
    }
    setFieldErrors(errors);
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      inputRefs.current[firstErrorKey]?.focus();
    }
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateAll()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/pilot-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          company: formData.company,
          industry: formData.industry,
          jobRole: formData.jobRole,
          useCase: formData.useCase,
          expectedVolume: formData.expectedVolume,
          cloudEnvironment: formData.cloudEnvironment,
          aiMaturity: formData.aiMaturity,
          budgetApproved: formData.budgetApproved,
          timeline: formData.timeline,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      setSubmitted(true);
      localStorage.removeItem('arf-pilot-form');
    } catch (err) {
      console.error(err);
      setError('Failed to submit request. Please email juan@arf-ai.com directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Application received</h1>
          <p className="text-gray-300 mb-4">
            You’ve taken the first step to equip your team with audit‑ready AI governance. Our founder will personally review your application.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            If your use case is a fit, you’ll receive a <strong>30‑minute onboarding call</strong> within 3–5 business days. No commitment — outcome‑based pricing only applies after the pilot.
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white py-8 sm:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Request Pilot Access</h1>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            The core ARF engine is access‑controlled and offered under outcome‑based pricing.
            Fill out this form to start a conversation with our founder.
          </p>
          {/* Trust bar – addresses certainty preference & compliance sensitivity */}
          <div className="inline-flex items-center gap-4 text-xs text-gray-400 bg-gray-800/50 rounded-full px-4 py-1 border border-gray-700">
            <span className="flex items-center gap-1"><Shield size={12} /> Deterministic enforcement</span>
            <span className="flex items-center gap-1"><Eye size={12} /> Full audit trail</span>
            <span className="flex items-center gap-1"><FileText size={12} /> SOC2‑ready logs</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 sm:p-6 md:p-8">
          {/* Progress bar – reduces perceived friction */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Step {step} of {totalSteps}</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step indicator (visual only – progress bar above does the job, kept for clarity) */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
                  step === i ? 'bg-blue-600 text-white' : step > i ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > i ? '✓' : i}
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {i === 1 ? 'About you' : i === 2 ? 'Technical details' : 'Budget & terms'}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Step 1: Personal & Company */}
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.fullName = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.fullName ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Work email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.email = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">We’ll only use this for pilot coordination – no mailing lists, no spam.</p>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company / Organisation *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.company = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.company ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {fieldErrors.company && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.company}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-1">Industry *</label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.industry = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.industry ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select industry</option>
                    <option value="Fintech / Banking">Fintech / Banking</option>
                    <option value="Healthcare / Life Sciences">Healthcare / Life Sciences</option>
                    <option value="Cloud Infrastructure / DevOps">Cloud Infrastructure / DevOps</option>
                    <option value="E‑commerce / Retail">E‑commerce / Retail</option>
                    <option value="Manufacturing / IoT">Manufacturing / IoT</option>
                    <option value="Government / Defense">Government / Defense</option>
                    <option value="Consulting / Services">Consulting / Services</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.industry && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.industry}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="jobRole" className="block text-sm font-medium text-gray-300 mb-1">Job role / title *</label>
                  <select
                    id="jobRole"
                    name="jobRole"
                    required
                    value={formData.jobRole}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.jobRole = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.jobRole ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select role</option>
                    <option value="CTO / VP Engineering">CTO / VP Engineering</option>
                    <option value="Director of AI / ML">Director of AI / ML</option>
                    <option value="Platform / SRE Lead">Platform / SRE Lead</option>
                    <option value="Solutions Architect">Solutions Architect</option>
                    <option value="ML / AI Engineer">ML / AI Engineer</option>
                    <option value="Security / Compliance Lead">Security / Compliance Lead</option>
                    <option value="Consultant / Advisor">Consultant / Advisor</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.jobRole && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.jobRole}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Use Case & Technical Details */}
            {step === 2 && (
              <>
                <div>
                  <label htmlFor="useCase" className="block text-sm font-medium text-gray-300 mb-1">Use case description *</label>
                  <textarea
                    id="useCase"
                    name="useCase"
                    rows={3}
                    required
                    value={formData.useCase}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.useCase = el; }}
                    placeholder="What AI systems would you govern with ARF? What risks do you need to mitigate?"
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.useCase ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {fieldErrors.useCase && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.useCase}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="expectedVolume" className="block text-sm font-medium text-gray-300 mb-1">Expected monthly incident evaluations *</label>
                  <select
                    id="expectedVolume"
                    name="expectedVolume"
                    required
                    value={formData.expectedVolume}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.expectedVolume = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.expectedVolume ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select volume</option>
                    <option value="< 1,000">&lt; 1,000</option>
                    <option value="1,000–10,000">1,000 – 10,000</option>
                    <option value="10,000–100,000">10,000 – 100,000</option>
                    <option value="> 100,000">&gt; 100,000</option>
                  </select>
                  {fieldErrors.expectedVolume && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.expectedVolume}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cloudEnvironment" className="block text-sm font-medium text-gray-300 mb-1">Cloud environment *</label>
                  <select
                    id="cloudEnvironment"
                    name="cloudEnvironment"
                    required
                    value={formData.cloudEnvironment}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.cloudEnvironment = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.cloudEnvironment ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select cloud</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                    <option value="On‑premises">On‑premises / Private cloud</option>
                    <option value="Multi‑cloud">Multi‑cloud</option>
                  </select>
                  {fieldErrors.cloudEnvironment && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.cloudEnvironment}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="aiMaturity" className="block text-sm font-medium text-gray-300 mb-1">Current AI maturity *</label>
                  <select
                    id="aiMaturity"
                    name="aiMaturity"
                    required
                    value={formData.aiMaturity}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.aiMaturity = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.aiMaturity ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select maturity level</option>
                    <option value="Exploring / Proof of concept">Exploring / Proof of concept</option>
                    <option value="Advisory AI in production">Advisory AI in production</option>
                    <option value="Limited autonomous actions">Limited autonomous actions</option>
                    <option value="Full autonomous operations">Full autonomous operations</option>
                  </select>
                  {fieldErrors.aiMaturity && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.aiMaturity}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Budget, Timeline & Terms */}
            {step === 3 && (
              <>
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-sm text-blue-200 mb-4">
                  <div className="flex items-start gap-2">
                    <Shield size={18} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Pilot slots are reviewed monthly</p>
                      <p className="text-blue-300">
                        Once submitted, your application will be personally reviewed by the founder.
                        If qualified, you’ll receive an email to schedule a 30‑minute onboarding call.
                        Pilot access is time‑limited and free; pricing is outcome‑based after the evaluation period.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="budgetApproved" className="block text-sm font-medium text-gray-300 mb-1">
                    Do you have an approved budget for AI governance? <span className="text-gray-500">(optional)</span>
                  </label>
                  <select
                    id="budgetApproved"
                    name="budgetApproved"
                    value={formData.budgetApproved}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Yes, approved">Yes, approved</option>
                    <option value="In discussion">In discussion</option>
                    <option value="Not yet">Not yet</option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1">This helps us understand your procurement timeline. No budget is required to apply.</p>
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">Planned deployment timeline *</label>
                  <select
                    id="timeline"
                    name="timeline"
                    required
                    value={formData.timeline}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.timeline = el; }}
                    className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:outline-none focus:border-blue-500 text-white ${
                      fieldErrors.timeline ? 'border-red-500' : 'border-gray-700'
                    }`}
                  >
                    <option value="">Select timeline</option>
                    <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="3–6 months">3–6 months</option>
                    <option value="> 6 months / exploratory">&gt; 6 months / exploratory</option>
                  </select>
                  {fieldErrors.timeline && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.timeline}</p>
                  )}
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
                {fieldErrors.agreeToTerms && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.agreeToTerms}</p>
                )}
                {/* Loss-aversion + urgency nudge */}
                <p className="text-xs text-gray-500 italic">
                  Every ungoverned AI decision is a liability. Turn your AI operations into an auditable asset.
                </p>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.agreeToTerms}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        Apply for Pilot <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Navigation for steps 1 and 2 */}
            {step < 3 && (
              <div className="flex justify-end pt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="mr-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </form>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-sm text-red-200 mt-6">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            Prefer to email? Contact us directly at{' '}
            <a href="mailto:juan@arf-ai.com" className="text-blue-400 hover:underline">juan@arf-ai.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
