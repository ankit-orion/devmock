type LogoProps = {
  className?: string;
  /** size of the square mark in px */
  size?: number;
  wordmark?: boolean;
  tone?: "ink" | "white";
};

export function Logo({
  className = "",
  size = 28,
  wordmark = true,
  tone = "ink",
}: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span
        className="flex items-center justify-center rounded-[9px] bg-gradient-to-b from-[#3b3b41] to-[#161619] sheen"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 8 L5 12 L9 16" />
          <path d="M15 8 L19 12 L15 16" />
        </svg>
      </span>
      {wordmark && (
        <span
          className={`text-[15px] font-semibold tracking-tight ${
            tone === "white" ? "text-white" : "text-ink"
          }`}
        >
          devmock
        </span>
      )}
    </span>
  );
}
