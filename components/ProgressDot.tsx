export default function ProgressDot({
  color,
  progress,
  isSelected,
}: {
  color: string;
  progress: number;
  isSelected: boolean;
}) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const isComplete = safeProgress === 1;

  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <span className="relative h-5 w-5 shrink-0">
      <svg
        viewBox="0 0 20 20"
        className="absolute inset-0 h-5 w-5 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
        />

        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <span
        className={`absolute left-1/2 top-1/2 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[8px] font-bold leading-none text-white ${
          isSelected ? "border-white/70" : "border-white/30"
        }`}
        style={{ backgroundColor: color }}
      >
        {isComplete ? "✓" : null}
      </span>
    </span>
  );
}
