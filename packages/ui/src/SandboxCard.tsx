import { Check, Copy, Loader2, Rocket } from "lucide-react";

export function SandboxCard({
  curlCommand,
  loading,
  response,
  error,
  copied,
  onTryLive,
  onCopy,
}: {
  curlCommand: string;
  loading: boolean;
  response: Record<string, unknown> | null;
  error: string | null;
  copied: boolean;
  onTryLive: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="arf-card-light flex flex-col p-7">
      <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-arf-blue">
        API
      </p>
      <h3 className="mb-2 text-h3 font-semibold">Evaluation endpoint</h3>
      <p className="mb-4.5 text-small text-[color:var(--text-secondary)]">
        Send an incident, get a governed decision back.
      </p>
      <pre className="mb-4.5 overflow-x-auto whitespace-pre-wrap break-all rounded-[11px] bg-arf-dark p-4 font-mono text-[11.5px] leading-[1.7] text-[#9fe7b8]">
        {curlCommand}
      </pre>
      <div className="mt-auto flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onTryLive}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-[9px] bg-gradient-to-br from-arf-blue to-arf-purple px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.96] disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Evaluating…
            </>
          ) : (
            <>
              <Rocket size={16} /> Try it live
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-[9px] border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-semibold transition hover:border-arf-blue active:scale-[0.96]"
          aria-label="Copy curl command"
        >
          {copied ? (
            <Check size={16} className="text-arf-blue" />
          ) : (
            <Copy size={16} />
          )}
          {copied ? "Copied" : "Copy curl"}
        </button>
      </div>
      {response && (
        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-[11px] border border-[color:var(--hairline)] bg-arf-dark p-4 font-mono text-[11px] leading-[1.7] text-[#9fe7b8]">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
      {error && (
        <p className="mt-3 text-sm text-[#b0453a]">
          Failed to reach sandbox: {error}
        </p>
      )}
    </div>
  );
}
