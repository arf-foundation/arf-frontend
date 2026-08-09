'use client';

import type { ElementType, CSSProperties } from 'react';
import { Activity, Brain, Check, FileText, Globe, Rocket, Shield } from 'lucide-react';
import { useInView } from '../app/hooks/useInView';

interface Stage {
  n: string;
  label: string;
  state: string;
  detail: string;
  icon: ElementType;
}

// `state` mirrors the hero's live-looking decision-path card (that card is
// the teaser, kept as-is). This section is the explainer, so what's on
// screen here is `detail` -- what each stage actually does -- not a second
// copy of the hero's words. `state` only surfaces in the sr-only list below.
const OUTBOUND: Stage[] = [
  { n: '01', label: 'Application', state: 'client', detail: 'Any client, any request shape', icon: Globe },
  { n: '02', label: 'LLM / AI Agent', state: 'probabilistic', detail: 'Non-deterministic reasoning', icon: Brain },
];

const GATE: Stage[] = [
  { n: '03', label: 'Policies', state: 'matched', detail: 'Matched to tenant rules', icon: Shield },
  { n: '04', label: 'Risk Engine', state: 'scored 0.31', detail: 'Explainable scoring', icon: Activity },
  { n: '05', label: 'Approval', state: 'granted', detail: 'Deterministic gate', icon: Check },
];

const INBOUND: Stage[] = [
  { n: '06', label: 'Execution', state: 'gated', detail: 'Runs only once cleared', icon: Rocket },
  { n: '07', label: 'Audit Trail', state: 'signed', detail: 'Signed, tamper-evident', icon: FileText },
];

// One canonical description of the flow, for assistive tech only -- the
// decorative track below is aria-hidden, so this is the sole textual
// account of the sequence rather than a second copy sighted users also see.
function A11yStageList() {
  return (
    <ol className="sr-only">
      {[...OUTBOUND, ...GATE, ...INBOUND].map((s) => (
        <li key={s.label}>
          {s.label} — {s.detail} ({s.state})
        </li>
      ))}
    </ol>
  );
}

function PipelineNode({ stage, index, compact }: { stage: Stage; index: number; compact?: boolean }) {
  const Icon = stage.icon;
  return (
    <div
      className={`arf-pipeline-node ${compact ? 'arf-pipeline-node-compact' : ''}`}
      style={{ '--i': index } as CSSProperties}
    >
      <span className="arf-pipeline-node-ring">
        <Icon className="arf-pipeline-node-icon" strokeWidth={1.75} />
      </span>
      <span className="arf-pipeline-node-n">{stage.n}</span>
      <span className="arf-pipeline-node-label">{stage.label}</span>
      <span className="arf-pipeline-node-meta">{stage.detail}</span>
    </div>
  );
}

function Wire({ compact }: { compact?: boolean }) {
  return <div className={`arf-pipeline-wire ${compact ? 'arf-pipeline-wire-compact' : ''}`} />;
}

export default function ArchitecturePipeline() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`arf-pipeline ${inView ? 'arf-pipeline-in' : ''}`}>
      <A11yStageList />
      <div className="arf-pipeline-track" aria-hidden="true">
        {OUTBOUND.map((stage, i) => (
          <div className="arf-pipeline-item" key={stage.label}>
            <PipelineNode stage={stage} index={i} />
            <Wire />
          </div>
        ))}
        <div className="arf-pipeline-cluster">
          <p className="arf-pipeline-cluster-label">ARF control plane</p>
          <div className="arf-pipeline-cluster-track">
            {GATE.map((stage, i) => (
              <div className="arf-pipeline-item" key={stage.label}>
                <PipelineNode stage={stage} index={i + 2} compact />
                {i < GATE.length - 1 && <Wire compact />}
              </div>
            ))}
          </div>
        </div>
        <Wire />
        {INBOUND.map((stage, i) => (
          <div className="arf-pipeline-item" key={stage.label}>
            <PipelineNode stage={stage} index={i + 5} />
            {i < INBOUND.length - 1 && <Wire />}
          </div>
        ))}
      </div>
    </div>
  );
}
