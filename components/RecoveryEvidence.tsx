'use client';

import { useState } from 'react';
import { Activity, FileSearch, Hand } from 'lucide-react';

const STEPS = [
  {
    id: 'report',
    label: 'Provider report',
    title: 'The mirror reported healthy',
    detail: 'ONTAP reported a healthy mirror. That status describes the relationship between the volumes.',
    Icon: Activity,
  },
  {
    id: 'file',
    label: 'File check',
    title: 'The new file was missing on the replica',
    detail: 'A direct read found the file on the source and absent from the replica.',
    Icon: FileSearch,
  },
  {
    id: 'decision',
    label: 'ARF decision',
    title: 'ARF held the source deletion',
    detail: 'Recoverability of the current data remained unresolved. The source was preserved.',
    Icon: Hand,
  },
] as const;

export default function RecoveryEvidence() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2" role="group" aria-label="FSx recovery evidence steps">
        {STEPS.map(({ id, label, Icon }, index) => (
          <button
            key={id}
            type="button"
            aria-controls="fsx-evidence-step"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            className="min-w-0 cursor-pointer rounded-lg border border-[color:var(--hairline)] px-1.5 py-2 text-xs font-medium leading-tight hover:border-arf-blue focus-visible:outline-2 focus-visible:outline-offset-2 aria-pressed:border-arf-blue aria-pressed:bg-arf-blue/10 aria-pressed:font-semibold sm:px-2"
          >
            <Icon size={18} className="mx-auto mb-1.5 text-arf-blue" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div id="fsx-evidence-step" aria-live="polite" className="min-h-[7rem]">
        <div key={step.id} className="border-l-2 border-arf-blue pl-4 motion-safe:animate-[arf-proof-in_220ms_ease-out]">
          <h3 className="text-xl font-semibold text-balance">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-[color:var(--text-secondary)]">{step.detail}</p>
        </div>
      </div>
    </div>
  );
}
