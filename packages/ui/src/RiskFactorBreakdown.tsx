import { Info } from 'lucide-react';

interface RiskBreakdown {
  conjugate: number;
  hmc: number;
  hyperprior: number;
}

interface RiskWeights {
  conjugate: number;
  hmc: number;
  hyperprior: number;
}

// Clamped, not just formatted: the underlying Bayesian weights can go
// negative (hyperprior shrinkage = 1 - conjugate - hmc), and a raw negative
// `width` percentage renders as an invalid/zero-width bar with no visual
// signal that anything's off. Clamp what's drawn; the exact number still
// prints in the label next to it.
const barWidth = (weight: number) => `${Math.max(0, weight * 100)}%`;

function BreakdownRow({
  label,
  pct,
  weight,
  gradientFrom,
  gradientTo,
}: {
  label: string;
  pct: number;
  weight: number;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">
          {(pct * 100).toFixed(1)}% (weight {weight.toFixed(2)})
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-sunken)]">
        <div
          className="h-1.5 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: barWidth(weight), background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
        />
      </div>
    </>
  );
}

export function RiskFactorBreakdown({ breakdown, weights }: { breakdown: RiskBreakdown; weights: RiskWeights }) {
  return (
    <div className="border-t border-[color:var(--hairline)] pt-4">
      <div className="mb-2 flex items-center gap-1 text-sm text-[color:var(--text-muted)]">
        Risk Factor Breakdown
        <span title="Weighted contributions from each Bayesian component">
          <Info size={14} className="cursor-help text-[color:var(--text-muted)]" />
        </span>
      </div>
      <div className="space-y-2">
        <BreakdownRow
          label="Conjugate prior"
          pct={breakdown.conjugate}
          weight={weights.conjugate}
          gradientFrom="color-mix(in oklch, var(--color-arf-blue) 55%, transparent)"
          gradientTo="var(--color-arf-blue)"
        />
        <BreakdownRow
          label="HMC prediction"
          pct={breakdown.hmc}
          weight={weights.hmc}
          gradientFrom="color-mix(in oklch, var(--color-arf-purple) 55%, transparent)"
          gradientTo="var(--color-arf-purple)"
        />
        <BreakdownRow
          label="Hyperprior shrinkage"
          pct={breakdown.hyperprior}
          weight={weights.hyperprior}
          gradientFrom="color-mix(in oklch, #3f7a5c 55%, transparent)"
          gradientTo="#3f7a5c"
        />
      </div>
    </div>
  );
}
