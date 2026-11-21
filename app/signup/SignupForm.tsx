'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { OFFER_LABELS, type RequestOffer } from '../../lib/engagement-offers';

const DRAFT_KEY = 'arf-review-request';
const LEGACY_DRAFT_KEY = 'arf-pilot-form';
const EMPTY_DRAFT = { email: '', intendedWrite: '', decision: '' };
const FIELD_CLASS = 'mt-2 block w-full rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-raised)] px-3.5 py-3 text-[color:var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arf-blue';

export default function SignupForm({ initialOffer }: { initialOffer: RequestOffer | null }) {
  const [offer, setOffer] = useState(initialOffer);
  const [draft, setDraft] = useState<typeof EMPTY_DRAFT | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let restored = EMPTY_DRAFT;
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(LEGACY_DRAFT_KEY);
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(LEGACY_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        restored = {
          email: typeof parsed?.email === 'string' ? parsed.email.slice(0, 254) : '',
          intendedWrite: typeof parsed?.intendedWrite === 'string' ? parsed.intendedWrite.slice(0, 500)
            : typeof parsed?.useCase === 'string' ? parsed.useCase.slice(0, 500) : '',
          decision: typeof parsed?.decision === 'string' ? parsed.decision.slice(0, 500) : '',
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(restored));
      }
    } catch {
      // The form works with unavailable browser storage or an unreadable draft.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(restored);
  }, []);

  useEffect(() => {
    if (status === 'sent') confirmation.current?.focus();
  }, [status]);

  useEffect(() => {
    if (error) errorMessage.current?.focus();
  }, [error, status]);

  function updateDraft(field: keyof typeof EMPTY_DRAFT, value: string) {
    const next = { ...(draft ?? EMPTY_DRAFT), [field]: value };
    setDraft(next);
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // Local draft storage is optional.
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !offer || status !== 'idle') return;
    const data = new FormData(event.currentTarget);
    const intendedWrite = draft.intendedWrite.trim();
    const decision = draft.decision.trim();
    setError(null);
    if (!intendedWrite || !decision) {
      setError('Enter the intended write and the decision it is holding up.');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch('/api/pilot-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer,
          email: draft.email.trim(),
          intendedWrite,
          decision,
          agreeToTerms: data.get('agreeToTerms') === 'on',
        }),
      });
      if (!response.ok) {
        setError(response.status === 429
          ? 'Please wait a few minutes before trying again.'
          : 'Your request could not be sent. Try again in a moment.');
        setStatus('idle');
        return;
      }
      setStatus('sent');
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // A storage error cannot undo a confirmed submission.
      }
    } catch {
      setError('Your request could not be sent. Check your connection and try again.');
      setStatus('idle');
    }
  }

  const heading = offer === 'write-access-review' ? 'Request the $4,500 Write-Access Review'
    : offer === 'pilot-snapshot' ? 'Request the free Pilot Snapshot' : 'Tell us about your agent’s write path';
  const values = draft ?? EMPTY_DRAFT;
  const disabled = draft === null || status === 'sending';

  return (
    <div className="arf-page-root arf-hero-wash">
      <div className="arf-shell py-12 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {status === 'sent' ? (
            <div className="arf-card p-6 sm:p-10">
              <Check className="mb-4 text-arf-blue" aria-hidden="true" />
              <h1 ref={confirmation} tabIndex={-1} className="text-h2 font-semibold">Request received</h1>
              <p className="mt-3 text-[color:var(--text-secondary)]">
                Your {offer ? OFFER_LABELS[offer] : 'engagement'} request is in. We’ll use your work email
                to discuss the scope and next steps.
              </p>
              <Link href="/" className="mt-6 inline-block text-arf-blue underline underline-offset-4">Back to ARF</Link>
            </div>
          ) : (
            <>
              <h1 className="max-w-[23ch] text-h2 font-semibold text-balance">{heading}</h1>
              <p className="mb-7 mt-3 max-w-[56ch] text-[color:var(--text-secondary)]">
                Start with one agent and a brief description of the write. We’ll follow up by email to discuss scope.
                Share only a summary here. Keep credentials and customer records out of this form.
              </p>
              <form method="post" action="/api/pilot-request" onSubmit={submit}
                aria-busy={status === 'sending'} className="arf-card space-y-6 p-5 sm:p-8">
                <fieldset className="min-w-0" disabled={disabled}>
                  <legend className="mb-2 font-semibold">I’m interested in</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(['write-access-review', 'pilot-snapshot'] as const).map((value) => (
                      <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-arf-blue ${offer === value ? 'border-arf-blue bg-arf-blue/5' : 'border-[color:var(--hairline)]'}`}>
                        <input type="radio" name="offer" value={value} required checked={offer === value}
                          onChange={() => setOffer(value)} className="mt-1 accent-arf-blue" />
                        <span>
                          <span className="block font-semibold">{OFFER_LABELS[value]} · {value === 'write-access-review' ? '$4,500' : 'Free'}</span>
                          <span className="mt-1 block text-[color:var(--text-secondary)]">
                            {value === 'write-access-review' ? 'Written findings on a scoped set of writes.' : 'A first look at one agent’s write path.'}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="email" className="font-semibold">Work email</label>
                  <input id="email" name="email" type="email" autoComplete="email" maxLength={254}
                    className={FIELD_CLASS} required value={values.email} disabled={disabled}
                    onChange={(event) => updateDraft('email', event.target.value)} />
                </div>
                <div>
                  <label htmlFor="intended-write" className="font-semibold">What write does the agent need to make?</label>
                  <textarea id="intended-write" name="intendedWrite" rows={3} maxLength={500} className={FIELD_CLASS}
                    placeholder="For example, delete a volume after a migration." required value={values.intendedWrite}
                    disabled={disabled} onChange={(event) => updateDraft('intendedWrite', event.target.value)} />
                </div>
                <div>
                  <label htmlFor="decision" className="font-semibold">What decision is it holding up?</label>
                  <textarea id="decision" name="decision" rows={3} maxLength={500} className={FIELD_CLASS}
                    placeholder="For example, customer sign-off on this write before rollout." required value={values.decision}
                    disabled={disabled} onChange={(event) => updateDraft('decision', event.target.value)} />
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <input id="agree-to-terms" name="agreeToTerms" type="checkbox" required
                    disabled={disabled} className="mt-1 accent-arf-blue" />
                  <label htmlFor="agree-to-terms" className="text-[color:var(--text-secondary)]">
                    I agree to the <Link href="/terms" className="text-arf-blue underline">Terms of Service</Link>
                    {' '}and <Link href="/privacy" className="text-arf-blue underline">Privacy Policy</Link>.
                  </label>
                </div>
                {error && (
                  <div ref={errorMessage} tabIndex={-1} role="alert" className="rounded-lg border border-current px-4 py-3 text-sm text-[#a72f28] dark:text-[#ffaca5]">
                    {error}{' '}<a href="mailto:juan@arf-ai.com" className="underline underline-offset-4">Email ARF</a>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={disabled} className="arf-btn-primary max-w-full justify-center disabled:opacity-60">
                    {status === 'sending' ? 'Sending request…' : 'Send request'} <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  {!error && <a href="mailto:juan@arf-ai.com" className="text-sm text-arf-blue underline underline-offset-4">Email ARF</a>}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
