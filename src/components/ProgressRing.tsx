
type ProgressRingProps = {
  progress: number;
  size?: number;
};

export default function ProgressRing({
  progress,
  size = 116,
}: ProgressRingProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${progress}% complete`}
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#e8e6df"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#3559e8"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="48"
        textAnchor="middle"
        fontSize="19"
        fontWeight="700"
        fill="#222522"
      >
        {progress}%
      </text>
      <text
        x="50"
        y="63"
        textAnchor="middle"
        fontSize="8"
        fill="#777970"
      >
        COMPLETE
      </text>
    </svg>
  );
}
