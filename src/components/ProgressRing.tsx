import { type RiskLevel } from '../types';

interface ProgressRingProps {
  score: number; // 0-100
  riskLevel: RiskLevel;
  size?: number; // diameter in px
  strokeWidth?: number;
  label?: string;
  animate?: boolean;
}

export function ProgressRing({
  score,
  riskLevel,
  size = 160,
  strokeWidth = 8,
  label,
  animate = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const gradientId = `gauge-gradient-${riskLevel}`;
  const stops =
    riskLevel === 'green'
      ? [
          { offset: '0%', color: '#10B981' },
          { offset: '100%', color: '#34D399' },
        ]
      : riskLevel === 'yellow'
        ? [
            { offset: '0%', color: '#F59E0B' },
            { offset: '100%', color: '#FBBF24' },
          ]
        : [
            { offset: '0%', color: '#EF4444' },
            { offset: '100%', color: '#F87171' },
          ];

  const statusText =
    riskLevel === 'green' ? 'Healthy' : riskLevel === 'yellow' ? 'Caution' : 'Alert';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={animate ? 'transition-all duration-800 ease-out' : ''}
          style={{ transitionDuration: animate ? '0.8s' : '0s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-2xl font-bold ${
            riskLevel === 'green'
              ? 'text-success-600'
              : riskLevel === 'yellow'
                ? 'text-warning-600'
                : 'text-alert-600'
          }`}
        >
          {score}
        </span>
        <span className="text-xs font-medium text-slate-500 mt-0.5">{label ?? statusText}</span>
      </div>
    </div>
  );
}
