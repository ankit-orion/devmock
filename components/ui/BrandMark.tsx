import type { ReactNode } from "react";

export type BrandName =
  | "Amazon"
  | "Google"
  | "Meta"
  | "Microsoft"
  | "Others";

const glyphs: Record<BrandName, ReactNode> = {
  Amazon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="M4 15c3.2 2.3 8.8 3 14.5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17.5 13.6c1 .2 2 .8 1.7 2-.3 1-1.2 1.6-1.9 1.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Google: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 12h6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 12V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Meta: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="M3 15c1.5-6 4.5-6 6-1.5S16 21 18 13.5 21 6 21 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Microsoft: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
    </svg>
  ),
  Others: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
};

type BrandMarkProps = {
  name: BrandName;
  className?: string;
  iconClassName?: string;
  showName?: boolean;
};

export function BrandMark({
  name,
  className = "",
  iconClassName = "",
  showName = true,
}: BrandMarkProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className={`h-5 w-5 shrink-0 ${iconClassName}`}>{glyphs[name]}</span>
      {showName && (
        <span className="text-sm font-medium tracking-tight">{name}</span>
      )}
    </span>
  );
}
