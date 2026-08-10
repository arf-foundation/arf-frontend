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
        <div className="flex justify-between text-sm">
          <span>Conjugate prior</span>
          <span className="font-mono">
            {(breakdown.conjugate * 100).toFixed(1)}% (weight {weights.conjugate.toFixed(2)})
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[color:var(--surface-sunken)]">
          <div className="h-1.5 rounded-full bg-arf-blue" style={{ width: `${weights.conjugate * 100}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span>HMC prediction</span>
          <span className="font-mono">
            {(breakdown.hmc * 100).toFixed(1)}% (weight {weights.hmc.toFixed(2)})
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[color:var(--surface-sunken)]">
          <div className="h-1.5 rounded-full bg-arf-purple" style={{ width: `${weights.hmc * 100}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span>Hyperprior shrinkage</span>
          <span className="font-mono">
            {(breakdown.hyperprior * 100).toFixed(1)}% (weight {weights.hyperprior.toFixed(2)})
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[color:var(--surface-sunken)]">
          <div className="h-1.5 rounded-full bg-[#3f7a5c]" style={{ width: `${weights.hyperprior * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
