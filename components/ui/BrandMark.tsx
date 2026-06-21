import type { ReactNode } from "react";

export type BrandName =
  | "monday"
  | "Trello"
  | "ClickUp"
  | "asana"
  | "Others"
  | "Amazon"
  | "Google"
  | "Meta"
  | "Microsoft";

const glyphs: Record<BrandName, ReactNode> = {
  monday: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
      <rect x="3.5" y="6" width="3.8" height="12" rx="1.9" transform="rotate(-20 5.4 12)" fill="#FD2E58" />
      <rect x="10.1" y="6" width="3.8" height="12" rx="1.9" transform="rotate(-20 12 12)" fill="#00CA72" />
      <rect x="16.7" y="6" width="3.8" height="12" rx="1.9" transform="rotate(-20 18.6 12)" fill="#00C0FF" />
    </svg>
  ),
  Trello: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill="#0079BF" />
      <rect x="7.2" y="7.2" width="3.8" height="9.6" rx="1" fill="white" />
      <rect x="13" y="7.2" width="3.8" height="5.8" rx="1" fill="white" />
    </svg>
  ),
  ClickUp: (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <defs>
        <linearGradient id="clickup-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B68EE" />
          <stop offset="100%" stopColor="#FF0E82" />
        </linearGradient>
      </defs>
      <path
        d="M2 18.439l3.69-2.828c1.961 2.56 4.044 3.739 6.363 3.739 2.307 0 4.33-1.166 6.203-3.704L22 18.405C19.298 22.065 15.941 24 12.053 24 8.178 24 4.788 22.078 2 18.439zM12.04 6.15l-6.568 5.66-3.036-3.52L12.055 0l9.543 8.296-3.05 3.509z"
        fill="url(#clickup-grad)"
      />
    </svg>
  ),
  asana: (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="7.2" r="2.8" fill="#FC636B" />
      <circle cx="6.5" cy="16.2" r="2.8" fill="#FC636B" />
      <circle cx="17.5" cy="16.2" r="2.8" fill="#FC636B" />
    </svg>
  ),
  Others: (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="#6C6C75">
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="19" cy="12" r="2.5" />
    </svg>
  ),
  Amazon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="M3 14c3.5 2.5 10 3 15 .5"
        stroke="#FF9900"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16.5 12.5c.8.3 1.8 1 1.5 2-.2.8-1 1.2-1.6 1.4"
        stroke="#FF9900"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Google: (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path
        d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.18 3.5v2.88h5.08c2.97-2.73 4.68-6.75 4.68-11.1 0-.68-.06-1.34-.16-2.01z"
        fill="#4285F4"
      />
      <path
        d="M12.18 22c2.7 0 4.96-.9 6.62-2.42l-5.08-2.88c-.83.56-1.9.92-3.18.92-2.48 0-4.58-1.67-5.33-3.92H.08v3c1.67 3.32 5.12 5.6 9.1 5.6z"
        fill="#34A853"
      />
      <path
        d="M6.85 13.7c-.2-.56-.3-1.16-.3-1.7s.1-1.14.3-1.7V7.3H.08C-.5 8.44-.8 9.7-.8 11s.3 2.56.88 3.7l5.97-4z"
        fill="#FBBC05"
      />
      <path
        d="M12.18 5.75c1.47 0 2.78.5 3.82 1.5l2.87-2.87C17.13 2.7 14.88 1.8 12.18 1.8c-3.98 0-7.43 2.28-9.1 5.6l5.97 3.99c.75-2.25 2.85-3.92 5.33-3.92z"
        fill="#EA4335"
      />
    </svg>
  ),
  Meta: (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="M16.5 7.5c-1.8 0-3.3 1.2-4.5 3-1.2-1.8-2.7-3-4.5-3-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c1.8 0 3.3-1.2 4.5-3 1.2 1.8 2.7 3 4.5 3 2.5 0 4.5-2 4.5-4.5S19 7.5 16.5 7.5z"
        stroke="#0064E0"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Microsoft: (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="3" y="3" width="8.5" height="8.5" fill="#F25022" />
      <rect x="12.5" y="3" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="3" y="12.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="8.5" height="8.5" fill="#FFB900" />
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
  const displayName = name === "monday" ? "monday" : name === "asana" ? "asana" : name;
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className={`h-5 w-5 shrink-0 ${iconClassName}`}>{glyphs[name]}</span>
      {showName && (
        <span className="text-sm font-semibold tracking-tight text-ink">{displayName}</span>
      )}
    </span>
  );
}
