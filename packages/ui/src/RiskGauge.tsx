import { riskColor } from './riskColor';

export function RiskGauge({ risk, size = 180 }: { risk: number; size?: number }) {
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - risk);
  const color = riskColor(risk);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Risk score: ${(risk * 100).toFixed(0)} percent`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          style={{ stroke: 'var(--hairline)' }}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
            filter: `drop-shadow(0 0 ${size * 0.045}px ${color}99)`,
          }}
        />
        <text
          x={size / 2}
          y={size / 2 + size * 0.08}
          textAnchor="middle"
          style={{ fill: 'var(--text-primary)' }}
          fontSize={size * 0.12}
          fontWeight="bold"
        >
          {(risk * 100).toFixed(0)}%
        </text>
      </svg>
    </div>
  );
}
