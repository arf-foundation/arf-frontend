import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ExplainabilitySection {
  heading: string;
  body: ReactNode;
}

export function ExplainabilityModal({
  open,
  onClose,
  title,
  summary,
  sections,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  summary: string;
  sections: ExplainabilitySection[];
  footer?: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arf-explainability-title"
        tabIndex={-1}
        className="arf-card-substantial relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl outline-none"
      >
        <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-[color:var(--hairline)] p-6">
          <h2 id="arf-explainability-title" className="text-h3 font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 rounded-lg border border-[color:var(--hairline)] p-1.5 transition hover:border-arf-blue"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-6 rounded-xl border border-arf-blue/20 bg-arf-blue/[0.06] p-4 text-[15px] leading-[1.6] text-[color:var(--text-primary)]">
            {summary}
          </p>

          <div className="flex flex-col gap-5">
            {sections.map((section) => (
              <div key={section.heading}>
                <p className="arf-eyebrow mb-2">{section.heading}</p>
                <div className="text-sm leading-[1.6] text-[color:var(--text-secondary)]">{section.body}</div>
              </div>
            ))}
          </div>
        </div>

        {footer && (
          <div className="flex-shrink-0 border-t border-[color:var(--hairline)] p-4 text-center text-xs text-[color:var(--text-muted)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
