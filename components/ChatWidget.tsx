'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send, X } from 'lucide-react';

/* ============================================================================
   Site-wide floating chat widget for the ARF Institutional Memory Agent.

   Rendered once from app/layout.tsx (same level as NavBar), so it's the
   same fixed-position overlay on every route. It calls the real /api/chat
   route -- the same Claude-backed endpoint /agent already demos with a
   full-page form. This gives a lightweight entry point from anywhere on
   the site without requiring a route change.

   The backend is stateless per-call (prompt.txt has no notion of
   conversation history -- each request is independently classified), so
   this renders as a running transcript of independent evaluations rather
   than pretending the model remembers earlier turns.

   Root element carries `arf-page-root` for the same reason NavBar does:
   it's a layout-level sibling, not nested inside a page's own
   `arf-page-root` wrapper, so it needs its own explicit color/font-family
   to avoid inheriting the legacy unlayered `body` rule that /dashboard and
   friends still rely on (see globals.css's note on this).
   ========================================================================= */

interface HealingIntent {
  intent_type: string;
  parameters: Record<string, unknown>;
  rollback_required: boolean;
  execution_mode_recommended: 'Advisory' | 'Approval' | 'Autonomous';
}

interface ARFAgentOutput {
  incident_summary: string;
  normalized_category: string;
  detected_patterns: string[];
  pattern_signal_count: number;
  probable_root_cause: string;
  similarity_confidence: number;
  risk_score: number;
  gating_rule_triggered: string;
  gating_rule_stack: string[];
  policy_flag_frequency_hint: string[];
  healing_intent: HealingIntent;
  policy_flags: string[];
  uncertainty_notes: string;
}

type Message =
  | { role: 'user'; text: string }
  | { role: 'assistant'; output: ARFAgentOutput }
  | { role: 'assistant'; error: string };

const EXECUTION_MODE_STYLE: Record<HealingIntent['execution_mode_recommended'], string> = {
  Advisory: 'bg-[color:var(--surface-sunken)] text-[color:var(--text-secondary)]',
  Approval: 'bg-[#f0a94e]/15 text-[#a5661a]',
  Autonomous: 'bg-[#9fe7b8]/25 text-[#1c7a41]',
};

function AgentResponseCard({ output }: { output: ARFAgentOutput }) {
  return (
    <div className="arf-card-light w-full p-4">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] ${EXECUTION_MODE_STYLE[output.healing_intent.execution_mode_recommended]}`}
        >
          {output.healing_intent.execution_mode_recommended}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[color:var(--text-muted)]">
          risk {output.risk_score.toFixed(2)} · confidence {output.similarity_confidence.toFixed(2)}
        </span>
      </div>
      <p className="mb-2 text-[14px] leading-[1.55] text-[color:var(--text-primary)]">{output.incident_summary}</p>
      {output.probable_root_cause && (
        <p className="mb-2 text-[13px] leading-[1.5] text-[color:var(--text-secondary)]">
          <span className="font-semibold">Probable root cause: </span>
          {output.probable_root_cause}
        </p>
      )}
      {output.policy_flags.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1.5">
          {output.policy_flags.map((flag) => (
            <span
              key={flag}
              className="rounded-md bg-[#b0453a]/10 px-2 py-0.5 font-mono text-[10px] text-[#b0453a]"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
      {output.uncertainty_notes && (
        <p className="mt-1.5 text-[12.5px] italic leading-[1.5] text-[color:var(--text-muted)]">
          {output.uncertainty_notes}
        </p>
      )}
      <details className="mt-2.5 border-t border-[color:var(--hairline)] pt-2">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.1em] text-[color:var(--text-muted)]">
          View full output
        </summary>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--surface-sunken)] p-2.5 font-mono text-[10.5px] leading-[1.5] text-[color:var(--text-secondary)]">
          {JSON.stringify(output, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // /dashboard has its own fixed bottom-0 mobile nav bar (DashboardBottomNav,
  // md:hidden, z-40) -- push the launcher up above it there so they don't
  // overlap. Everywhere else the default bottom-5 is fine.
  const pathname = usePathname();
  const launcherBottomClass = pathname?.startsWith('/dashboard') ? 'bottom-20 sm:bottom-6' : 'bottom-5 sm:bottom-6';

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const send = async () => {
    const message = input.trim();
    if (!message || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!isMounted.current) return;
      if ('error' in data) {
        setMessages((prev) => [...prev, { role: 'assistant', error: data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', output: data as ARFAgentOutput }]);
      }
    } catch {
      if (isMounted.current) {
        setMessages((prev) => [...prev, { role: 'assistant', error: 'Could not reach the agent. Please try again.' }]);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="arf-page-root">
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close ARF agent chat' : 'Open ARF agent chat'}
        aria-expanded={open}
        aria-controls="arf-chat-panel"
        className={`fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-arf-blue to-arf-purple text-white shadow-[0_16px_34px_-16px_rgba(51,88,232,0.75)] transition hover:brightness-110 sm:right-6 ${launcherBottomClass}`}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel: full-screen on mobile, floating card on sm+ */}
      {open && (
        <div
          id="arf-chat-panel"
          role="dialog"
          aria-label="ARF Institutional Memory Agent"
          className="arf-card-anchored fixed inset-0 z-40 flex flex-col overflow-hidden border border-[color:var(--hairline)] shadow-[0_40px_80px_-40px_rgba(19,18,24,0.75)] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl"
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-white/12 bg-arf-dark px-5 py-4">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-white/60">
                ARF Institutional Memory Agent
              </p>
              <p className="text-[13.5px] text-white/85">Paste an incident, get a governed decision</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white sm:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[color:var(--surface-canvas)] px-4 py-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <p className="text-[13.5px] text-[color:var(--text-secondary)]">
                  Describe an operational incident and ARF will return a structured, policy-aware governance
                  decision — risk score, execution mode, and reasoning.
                </p>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[color:var(--text-muted)]">
                  Each message is evaluated independently
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-arf-blue to-arf-purple px-3.5 py-2.5 text-[13.5px] text-white">
                    {m.text}
                  </div>
                ) : 'error' in m ? (
                  <div key={i} className="max-w-[90%] rounded-2xl rounded-bl-sm bg-[#b0453a]/10 px-3.5 py-2.5 text-[13.5px] text-[#b0453a]">
                    {m.error}
                  </div>
                ) : (
                  <div key={i} className="max-w-[92%]">
                    <AgentResponseCard output={m.output} />
                  </div>
                ),
              )}
              {loading && (
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[color:var(--surface-raised)] px-3.5 py-2.5 text-[13.5px] text-[color:var(--text-secondary)]">
                  Evaluating…
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <div className="flex flex-shrink-0 items-end gap-2 border-t border-[color:var(--hairline)] bg-[color:var(--surface-raised)] p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Describe an incident…"
              rows={1}
              className="max-h-28 flex-1 resize-none rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface-canvas)] px-3 py-2.5 text-[13.5px] text-[color:var(--text-primary)] outline-none focus-visible:border-[color:var(--color-arf-blue)]"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-arf-blue to-arf-purple text-white transition hover:brightness-110 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
