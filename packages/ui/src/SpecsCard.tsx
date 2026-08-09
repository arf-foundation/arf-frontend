import type { ComponentType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface SpecsLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function SpecsCard({
  specs,
  href,
  renderLink: LinkTag = 'a',
}: {
  specs: readonly string[];
  href: string;
  /** Defaults to a plain <a>. Pass next/link's Link to get client-side navigation. */
  renderLink?: ComponentType<SpecsLinkProps> | 'a';
}) {
  return (
    <div className="arf-card-light flex flex-col p-7">
      <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-arf-blue">Specs</p>
      <h3 className="mb-2 text-h3 font-semibold">Technical specification</h3>
      <p className="mb-4.5 text-small text-[color:var(--text-secondary)]">
        Data models, API contracts and decision rules, shared with qualified pilots under written terms.
      </p>
      <div className="mb-5 flex flex-col gap-2.5">
        {specs.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between gap-3 rounded-[9px] bg-[color:var(--surface-sunken)] px-3.5 py-2.5"
          >
            <span className="font-mono text-xs text-[color:var(--text-secondary)]">{name}</span>
            <span className="flex-shrink-0 font-mono text-[9.5px] uppercase tracking-[0.07em] text-[color:var(--text-muted)]">
              pilot only
            </span>
          </div>
        ))}
      </div>
      <LinkTag href={href} className="mt-auto inline-flex items-center gap-2 text-[14.5px] font-semibold text-arf-blue">
        Request specifications <ArrowRight size={16} />
      </LinkTag>
    </div>
  );
}
