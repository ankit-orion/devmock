"use client";

import { useDemo } from "./DemoContext";

export function DemoTriggerButton({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const { open } = useDemo();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={open}
        className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition hover:scale-105"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] sheen">
          <svg viewBox="0 0 24 24" fill="white" className="ml-0.5 h-3 w-3">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-[11px] font-medium text-ink">See a live session</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-full bg-white/90 py-2 pl-2 pr-4 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-sm transition hover:scale-105"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] sheen">
        <svg viewBox="0 0 24 24" fill="white" className="ml-0.5 h-3.5 w-3.5">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="text-xs font-medium text-ink">Watch how it works</span>
    </button>
  );
}
