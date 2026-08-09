import type { ElementType } from 'react';

export function CapabilityCard({
  n,
  title,
  description,
  icon: Icon,
  items,
}: {
  n: string;
  title: string;
  description: string;
  icon: ElementType;
  items: readonly string[];
}) {
  return (
    <div className="arf-card-substantial p-9">
      <div className="mb-5 flex items-center justify-between gap-5">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-arf-blue/25 bg-gradient-to-br from-arf-blue/15 to-arf-purple/15">
          <Icon className="h-[18px] w-[18px] text-arf-blue" strokeWidth={1.75} />
        </div>
        <span className="font-mono text-[11px] font-medium text-[color:var(--text-muted)]">{n}</span>
      </div>
      <h3 className="mb-2.5 text-h3 font-semibold">{title}</h3>
      <p className="mb-5 text-[15.5px] leading-[1.6] text-[color:var(--text-secondary)]">{description}</p>
      <ul className="grid gap-x-4.5 gap-y-2.5 border-t border-[color:var(--hairline)] pt-5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-[color:var(--text-secondary)]">
            <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-arf-purple" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
