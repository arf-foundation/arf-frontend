'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HowItWorksVideo from './HowItWorksVideo';
import RecoveryEvidence from './RecoveryEvidence';
import { REVIEW_EXAMPLE_PATH } from '../lib/engagement-offers';

const EXAMPLES = [
  { id: 'fsx', label: 'FSx experiment', duration: '14 sec' },
  { id: 'simulation', label: 'Simulated approval', duration: '30 sec' },
] as const;

type Example = (typeof EXAMPLES)[number]['id'];

export default function ReviewProof() {
  const [example, setExample] = useState<Example>('fsx');
  const [fsxPlayed, setFsxPlayed] = useState(false);

  return (
    <section id="proof" className="arf-shell scroll-mt-24 py-10 sm:py-14" aria-labelledby="proof-title">
      <h2 id="proof-title" className="mb-5 text-h2 font-semibold">See the evidence</h2>
      <div className="arf-card overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b border-[color:var(--hairline)] p-4 sm:p-5" role="group" aria-label="Evidence videos">
          {EXAMPLES.map(({ id, label, duration }) => (
            <button
              key={id}
              type="button"
              aria-pressed={id === example}
              aria-controls="review-proof-clip"
              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border border-[color:var(--hairline)] px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arf-blue aria-pressed:border-arf-blue aria-pressed:bg-arf-blue/10"
              onClick={() => {
                if (id === example) return;
                setFsxPlayed(false);
                setExample(id);
              }}
            >
              {label} <span className="font-normal text-[color:var(--text-secondary)]">{duration}</span>
            </button>
          ))}
        </div>
        <div id="review-proof-clip">
          <div key={example} className="grid min-w-0 gap-6 p-4 motion-safe:animate-[arf-proof-in_220ms_ease-out] sm:p-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-9">
            {example === 'fsx' ? (
              <figure className="m-0 min-w-0">
                <div className="relative">
                  <video
                    className="aspect-video w-full rounded-xl bg-arf-dark object-contain"
                    controls
                    muted
                    playsInline
                    preload="none"
                    onPlay={() => setFsxPlayed(true)}
                    poster="/media/fsx-mirror-readback-poster.webp"
                    aria-label="FSx experiment showing the reported mirror state"
                    aria-describedby="fsx-video-caption"
                  >
                    <source src="/media/fsx-mirror-readback.mp4" type="video/mp4" />
                  </video>
                  {!fsxPlayed && (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                      <span className="absolute left-[14%] top-[44%] h-[3.5%] w-[10%] rounded-sm border-2 border-[#f8ce6a]" />
                      <span className="absolute left-[14%] top-[14%] rounded bg-[#131c23] px-2 py-1 text-xs font-medium text-[#f8ce6a]">Mirror health field</span>
                    </div>
                  )}
                </div>
                <figcaption id="fsx-video-caption" className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  Silent terminal excerpt from a disposable AWS experiment.
                </figcaption>
                <details className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  <summary className="cursor-pointer font-semibold text-arf-blue">Read the clip transcript</summary>
                  <p className="mt-2">SnapMirror reports <code>healthy: true</code> and <code>state: snapmirrored</code>. Its report describes the mirror relationship. The separate file check is in the evidence steps.</p>
                </details>
              </figure>
            ) : <HowItWorksVideo />}
            <div className="min-w-0">
              {example === 'fsx' ? <RecoveryEvidence /> : (
                <>
                  <h3 className="text-xl font-semibold text-balance">Approval applies to one write</h3>
                  <p className="mt-2 leading-relaxed text-[color:var(--text-secondary)]">
                    In the simulation, ARF holds a volume deletion for approval and checks the observed result after the approved call.
                  </p>
                </>
              )}
              <Link href={REVIEW_EXAMPLE_PATH} className="mt-4 inline-flex items-center gap-2 rounded-sm font-semibold text-arf-blue underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
                Read the sample finding <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
