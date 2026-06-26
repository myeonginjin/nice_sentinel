import { gaugeColor } from '@/lib/gradeUtils';

interface Props {
  score: number;
  size?: number;
}

export function RiskGauge({ score, size = 120 }: Props) {
  const r = (size / 2) * 0.75;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const color = gaugeColor(score);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size * 0.1} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.1}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold" style={{ fontSize: size * 0.22, color, lineHeight: 1 }}>
          {score}
        </span>
        <span className="text-gray-500" style={{ fontSize: size * 0.1 }}>
          / 100
        </span>
      </div>
    </div>
  );
}
