import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { REVIEW_EXAMPLE_PATH, REVIEW_REQUEST_PATH } from '../../lib/engagement-offers';

const FSX_EVIDENCE = 'https://arf-foundation.github.io/arf-ontap-live-evidence/';

export const metadata: Metadata = {
  title: 'What a Write-Access Review Delivers',
  description: 'See a sample ARF review finding about approval, recovery evidence and an unresolved ONTAP storage write.',
  alternates: { canonical: REVIEW_EXAMPLE_PATH },
};

export default function WriteAccessReviewPage() {
  return (
    <div className="arf-page-root">
      <section className="arf-hero-wash">
        <div className="arf-shell pb-10 pt-16 sm:pb-14 sm:pt-24">
          <p className="arf-eyebrow mb-4">Sample deliverable</p>
          <h1 className="max-w-[21ch] text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-balance">
            What a Write-Access Review <span className="arf-gradient-text">delivers</span>
          </h1>
          <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-[color:var(--text-secondary)]">
            See how a reviewer can go from a proposed storage write to a decision they can explain
            to a customer. This example uses observations from a disposable AWS FSx for NetApp ONTAP experiment.
          </p>
        </div>
      </section>

      <div className="arf-shell">
        <article className="arf-card mx-auto max-w-5xl overflow-hidden" aria-labelledby="finding-title">
          <div className="border-b border-[color:var(--hairline)] bg-[color:var(--surface-sunken)] p-6 sm:p-9">
            <p className="arf-eyebrow mb-3">Sample finding</p>
            <h2 id="finding-title" className="max-w-[28ch] text-h2 font-semibold text-balance">
              Recovery evidence is incomplete for a mirrored volume
            </h2>
            <p className="mt-3 text-[color:var(--text-secondary)]">
              Proposed write · Delete <code className="break-words">svm1:app_data</code>
            </p>
          </div>

          <dl className="grid gap-x-10 gap-y-7 p-6 sm:grid-cols-2 sm:p-9">
            <div>
              <dt className="font-semibold">Authority and dispatch</dt>
              <dd className="mt-2 leading-relaxed text-[color:var(--text-secondary)]">
                ARF held the requested source deletion for approval. The source was preserved.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Provider report</dt>
              <dd className="mt-2 leading-relaxed text-[color:var(--text-secondary)]">
                SnapMirror reported a healthy relationship. ARF&apos;s initial recovery explanation
                overstated what the destination held.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Observed evidence</dt>
              <dd className="mt-2 leading-relaxed text-[color:var(--text-secondary)]">
                A direct check found the newly written 65-byte test file on the source. The destination
                check reported that the file was absent.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Open question and owner</dt>
              <dd className="mt-2 leading-relaxed text-[color:var(--text-secondary)]">
                Recovery of current data remained unverified. The storage owner would confirm the
                required recovery point and check that a candidate restore contains the data the application needs.
              </dd>
            </div>
          </dl>

          <div className="border-t border-[color:var(--hairline)] p-6 sm:p-9">
            <h3 className="font-semibold">Sample decision for your reviewer</h3>
            <p className="mt-2 max-w-[68ch] leading-relaxed text-[color:var(--text-secondary)]">
              Keep the write held until the storage owner can provide evidence for the required recovery point.
              Preserve the request, approval status, and readback together so the reviewer can revisit the decision.
            </p>
            <a href={FSX_EVIDENCE} className="mt-4 inline-flex items-center gap-2 rounded-sm font-semibold text-arf-blue underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
              Read the public FSx experiment record <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>

      <section className="arf-shell py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-h2 font-semibold">For your own agent</h2>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-[color:var(--text-secondary)]">
            We use read-only materials to map up to ten named writes for one agent in one environment or provider,
            using up to 200 supplied records in one format. You get a write inventory, recoverability map, decision
            memo, evidence index and unresolved items to take to your reviewer. Any production enforcement has its own scope.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href={REVIEW_REQUEST_PATH} className="arf-btn-primary max-w-full justify-center">
              Request the $4,500 review <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/pricing" className="rounded-sm text-arf-blue underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
              Review scope and pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
