'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Check, Loader2, Shield, Eye, FileText } from 'lucide-react';
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="arf-page-root flex min-h-screen items-center justify-center p-4">
        <div className="arf-card w-full max-w-md p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Application received</h1>
          <p className="mb-4 text-[color:var(--text-secondary)]">
            You’ve taken the first step to equip your team with audit‑ready AI governance. Our founder will personally review your application.
          </p>
          <p className="mb-6 text-sm text-[color:var(--text-muted)]">
            If your use case is a fit, you’ll receive a <strong>30‑minute onboarding call</strong> within 3–5 business days. No commitment — outcome‑based pricing only applies after the pilot.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-arf-blue px-6 py-2 text-white transition hover:brightness-110"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="arf-page-root min-h-screen px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">Request Pilot Access</h1>
          <p className="mb-4 text-sm text-[color:var(--text-muted)] sm:text-base">
            Pilot programs are offered to qualified organizations where ARF is a strong fit.
            Fill out this form to start a conversation with our founder – no commitment required.
          </p>
          {/* Trust bar */}
          <div className="inline-flex items-center gap-4 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-raised)]/50 px-4 py-1 text-xs text-[color:var(--text-muted)]">
            <span className="flex items-center gap-1"><Shield size={12} /> Deterministic enforcement</span>
            <span className="flex items-center gap-1"><Eye size={12} /> Full audit trail</span>
            <span className="flex items-center gap-1"><FileText size={12} /> SOC2‑ready logs</span>
          </div>
        </div>

        <div className="arf-card p-5 sm:p-6 md:p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="mb-1 flex justify-between text-xs text-[color:var(--text-muted)]">
              <span>Step {step} of {totalSteps}</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[color:var(--hairline)]">
              <div
                className="h-1.5 rounded-full bg-arf-blue transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step indicator */}
          <div
            className="mb-6 flex justify-between"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-valuetext={`Step ${step} of ${totalSteps}`}
          >
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 text-center">
                <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === i ? 'bg-arf-blue text-white' : step > i ? 'bg-green-600 text-white' : 'bg-[color:var(--hairline)] text-[color:var(--text-muted)]'
                }`}>
                  {step > i ? '✓' : i}
                </div>
                <div className="mt-1 text-xs text-[color:var(--text-muted)]">
                  {i === 1 ? 'About you' : i === 2 ? 'Technical details' : 'Budget & terms'}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Step 1: Personal & Company (unchanged) */}
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Full name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.fullName = el; }}
                    aria-invalid={!!fieldErrors.fullName}
                    aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                    className={`arf-input ${fieldErrors.fullName ? 'arf-input-error' : ''}`}
                  />
                  {fieldErrors.fullName && (
                    <p id="fullName-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Work email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.email = el; }}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    className={`arf-input ${fieldErrors.email ? 'arf-input-error' : ''}`}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                  <p className="mt-1 text-xs text-[color:var(--text-muted)]">We’ll only use this for pilot coordination – no mailing lists, no spam.</p>
                </div>
                <div>
                  <label htmlFor="company" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Company / Organisation *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.company = el; }}
                    aria-invalid={!!fieldErrors.company}
                    aria-describedby={fieldErrors.company ? 'company-error' : undefined}
                    className={`arf-input ${fieldErrors.company ? 'arf-input-error' : ''}`}
                  />
                  {fieldErrors.company && (
                    <p id="company-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.company}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="industry" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Industry *</label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.industry = el; }}
                    aria-invalid={!!fieldErrors.industry}
                    aria-describedby={fieldErrors.industry ? 'industry-error' : undefined}
                    className={`arf-input ${fieldErrors.industry ? 'arf-input-error' : ''}`}
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
                    <p id="industry-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.industry}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="jobRole" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Job role / title *</label>
                  <select
                    id="jobRole"
                    name="jobRole"
                    required
                    value={formData.jobRole}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.jobRole = el; }}
                    aria-invalid={!!fieldErrors.jobRole}
                    aria-describedby={fieldErrors.jobRole ? 'jobRole-error' : undefined}
                    className={`arf-input ${fieldErrors.jobRole ? 'arf-input-error' : ''}`}
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
                    <p id="jobRole-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.jobRole}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Use Case & Technical Details (unchanged) */}
            {step === 2 && (
              <>
                <div>
                  <label htmlFor="useCase" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Use case description *</label>
                  <textarea
                    id="useCase"
                    name="useCase"
                    rows={3}
                    required
                    value={formData.useCase}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.useCase = el; }}
                    placeholder="What AI systems would you govern with ARF? What risks do you need to mitigate?"
                    aria-invalid={!!fieldErrors.useCase}
                    aria-describedby={fieldErrors.useCase ? 'useCase-error' : undefined}
                    className={`arf-input ${fieldErrors.useCase ? 'arf-input-error' : ''}`}
                  />
                  {fieldErrors.useCase && (
                    <p id="useCase-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.useCase}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="expectedVolume" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Expected monthly evaluations *</label>
                  <select
                    id="expectedVolume"
                    name="expectedVolume"
                    required
                    value={formData.expectedVolume}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.expectedVolume = el; }}
                    aria-invalid={!!fieldErrors.expectedVolume}
                    aria-describedby={fieldErrors.expectedVolume ? 'expectedVolume-error' : undefined}
                    className={`arf-input ${fieldErrors.expectedVolume ? 'arf-input-error' : ''}`}
                  >
                    <option value="">Select volume</option>
                    <option value="< 1,000">&lt; 1,000</option>
                    <option value="1,000–10,000">1,000 – 10,000</option>
                    <option value="10,000–100,000">10,000 – 100,000</option>
                    <option value="> 100,000">&gt; 100,000</option>
                  </select>
                  {fieldErrors.expectedVolume && (
                    <p id="expectedVolume-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.expectedVolume}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cloudEnvironment" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Cloud environment *</label>
                  <select
                    id="cloudEnvironment"
                    name="cloudEnvironment"
                    required
                    value={formData.cloudEnvironment}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.cloudEnvironment = el; }}
                    aria-invalid={!!fieldErrors.cloudEnvironment}
                    aria-describedby={fieldErrors.cloudEnvironment ? 'cloudEnvironment-error' : undefined}
                    className={`arf-input ${fieldErrors.cloudEnvironment ? 'arf-input-error' : ''}`}
                  >
                    <option value="">Select cloud</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                    <option value="On‑premises">On‑premises / Private cloud</option>
                    <option value="Multi‑cloud">Multi‑cloud</option>
                  </select>
                  {fieldErrors.cloudEnvironment && (
                    <p id="cloudEnvironment-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.cloudEnvironment}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="aiMaturity" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Current AI maturity *</label>
                  <select
                    id="aiMaturity"
                    name="aiMaturity"
                    required
                    value={formData.aiMaturity}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.aiMaturity = el; }}
                    aria-invalid={!!fieldErrors.aiMaturity}
                    aria-describedby={fieldErrors.aiMaturity ? 'aiMaturity-error' : undefined}
                    className={`arf-input ${fieldErrors.aiMaturity ? 'arf-input-error' : ''}`}
                  >
                    <option value="">Select maturity level</option>
                    <option value="Exploring / Proof of concept">Exploring / Proof of concept</option>
                    <option value="Advisory AI in production">Advisory AI in production</option>
                    <option value="Limited autonomous actions">Limited autonomous actions</option>
                    <option value="Full autonomous operations">Full autonomous operations</option>
                  </select>
                  {fieldErrors.aiMaturity && (
                    <p id="aiMaturity-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.aiMaturity}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Budget, Timeline & Terms */}
            {step === 3 && (
              <>
                <div className="mb-4 rounded-lg border border-arf-blue/30 bg-arf-blue/10 p-4 text-sm text-[color:var(--text-secondary)]">
                  <div className="flex items-start gap-2">
                    <Shield size={18} className="mt-0.5 flex-shrink-0 text-arf-blue" />
                    <div>
                      <p className="mb-1 font-semibold text-[color:var(--text-primary)]">Pilot slots are reviewed monthly</p>
                      <p>
                        Once submitted, your application will be personally reviewed by the founder.
                        If qualified, you’ll receive an email to schedule a 30‑minute onboarding call.
                        Pilot access is time‑limited and free; pricing is outcome‑based after the evaluation period.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="budgetApproved" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
                    Do you have an approved budget for AI governance? <span className="text-[color:var(--text-muted)]">(optional)</span>
                  </label>
                  <select
                    id="budgetApproved"
                    name="budgetApproved"
                    value={formData.budgetApproved}
                    onChange={handleChange}
                    className="arf-input"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Yes, approved">Yes, approved</option>
                    <option value="In discussion">In discussion</option>
                    <option value="Not yet">Not yet</option>
                  </select>
                  <p className="mt-1 text-xs text-[color:var(--text-muted)]">This helps us understand your procurement timeline. No budget is required to apply.</p>
                </div>
                <div>
                  <label htmlFor="timeline" className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">Planned deployment timeline *</label>
                  <select
                    id="timeline"
                    name="timeline"
                    required
                    value={formData.timeline}
                    onChange={handleChange}
                    ref={el => { inputRefs.current.timeline = el; }}
                    aria-invalid={!!fieldErrors.timeline}
                    aria-describedby={fieldErrors.timeline ? 'timeline-error' : undefined}
                    className={`arf-input ${fieldErrors.timeline ? 'arf-input-error' : ''}`}
                  >
                    <option value="">Select timeline</option>
                    <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="3–6 months">3–6 months</option>
                    <option value="> 6 months / exploratory">&gt; 6 months / exploratory</option>
                  </select>
                  {fieldErrors.timeline && (
                    <p id="timeline-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.timeline}</p>
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
                    aria-invalid={!!fieldErrors.agreeToTerms}
                    aria-describedby={fieldErrors.agreeToTerms ? 'agreeToTerms-error' : undefined}
                    className="mt-1 h-4 w-4 rounded border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] focus:ring-arf-blue"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-[color:var(--text-secondary)]">
                    I understand that ARF is proprietary and access is granted at the founder’s discretion.
                    I agree to the{' '}
                    <Link href="/terms" className="text-arf-blue hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-arf-blue hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                {fieldErrors.agreeToTerms && (
                  <p id="agreeToTerms-error" role="alert" className="mt-1 text-xs text-red-500">{fieldErrors.agreeToTerms}</p>
                )}
                <p className="text-xs italic text-[color:var(--text-muted)]">
                  Every ungoverned AI decision is a liability. Turn your AI operations into an auditable asset.
                </p>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] px-4 py-2 text-[color:var(--text-primary)] transition hover:border-[color:var(--color-arf-blue)]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.agreeToTerms}
                    className="flex items-center gap-2 rounded-lg bg-arf-blue px-6 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="mr-2 rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] px-4 py-2 text-[color:var(--text-primary)] transition hover:border-[color:var(--color-arf-blue)]"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-arf-blue px-6 py-2 text-white transition hover:brightness-110"
                >
                  Next →
                </button>
              </div>
            )}
          </form>

          {error && (
            <div className="mt-6 rounded-lg border border-[#b3392a]/50 bg-[#b3392a]/10 p-3 text-sm text-[#b3392a]">
              {error}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-[color:var(--text-muted)]">
            Prefer to email? Contact us directly at{' '}
            <a href="mailto:juan@arf-ai.com" className="text-arf-blue hover:underline">juan@arf-ai.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
