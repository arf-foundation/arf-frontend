import { useEffect, useRef, type ReactNode } from "react";
import { Printer, X } from "lucide-react";

export function PrintableReportModal({
  open,
  onClose,
  title,
  generatedAt,
  children,
  footer,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  generatedAt: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Extra buttons (e.g. a real PDF download link) rendered before the built-in Print button. */
  actions?: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="arf-no-print absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="arf-printable-report"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arf-report-title"
        tabIndex={-1}
        className="arf-card-substantial relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl outline-none"
      >
        <div className="arf-no-print flex flex-shrink-0 items-start justify-between gap-4 border-b border-[color:var(--hairline)] p-6">
          <div>
            <h2 id="arf-report-title" className="text-h3 font-semibold">
              {title}
            </h2>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              Generated {generatedAt}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={() => window.print()}
              className="arf-btn-secondary"
            >
              <Printer size={16} /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border border-[color:var(--hairline)] p-1.5 transition hover:border-arf-blue active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Print-only header -- the screen header above is hidden when printing (arf-no-print) */}
        <div className="hidden text-center print:block">
          <h2 className="text-h3 font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-[color:var(--text-muted)]">
            Generated {generatedAt}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 print:overflow-visible">
          <div className="flex flex-col gap-6">{children}</div>
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
