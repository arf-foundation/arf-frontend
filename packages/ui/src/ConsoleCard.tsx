import type { ComponentType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ConsoleLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function ConsoleCard({
  href,
  renderLink: LinkTag = 'a',
}: {
  href: string;
  /** Defaults to a plain <a>. Pass next/link's Link to get client-side navigation. */
  renderLink?: ComponentType<ConsoleLinkProps> | 'a';
}) {
  return (
    <div className="arf-card-light flex flex-col p-7">
      <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-arf-blue">Console</p>
      <h3 className="mb-2 text-h3 font-semibold">Governance Console</h3>
      <p className="mb-5 text-small text-[color:var(--text-secondary)]">
        Risk, governance and compliance views on simulated decision data.
      </p>
      <div className="mb-5 overflow-hidden rounded-[11px] bg-[color:var(--surface-sunken)]">
        <div className="bg-arf-dark px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.09em] text-[#c3cfff]">
          Simulation
        </div>
        <div className="flex flex-col gap-2 p-3.5" aria-hidden>
          <div className="h-[7px] rounded bg-[color:var(--text-muted)]/25" />
          <div className="h-[7px] w-8/12 rounded bg-[color:var(--text-muted)]/25" />
          <div className="h-[7px] w-5/12 rounded bg-gradient-to-r from-arf-blue to-arf-purple opacity-60" />
        </div>
      </div>
      <LinkTag href={href} className="mt-auto inline-flex items-center gap-2 text-[14.5px] font-semibold text-arf-blue">
        Open console <ArrowRight size={16} />
      </LinkTag>
    </div>
  );
}
