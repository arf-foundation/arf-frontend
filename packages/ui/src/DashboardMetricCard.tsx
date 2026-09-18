import type { ElementType, ReactNode } from 'react';

export function DashboardMetricCard({
  title,
  icon: Icon,
  iconClassName = 'text-arf-blue',
  action,
  footer,
  children,
}: {
  title: string;
  icon?: ElementType;
  iconClassName?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="arf-card-substantial p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-2 text-h3 font-semibold">
          {Icon && <Icon className={`h-5 w-5 ${iconClassName}`} />}
          {title}
        </h2>
        {action}
      </div>
      {children}
      {footer && <div className="mt-4 text-center text-xs text-[color:var(--text-muted)]">{footer}</div>}
    </div>
  );
}
