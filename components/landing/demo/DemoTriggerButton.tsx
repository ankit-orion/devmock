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
        className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-card py-1.5 pl-1.5 pr-3.5 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition hover:scale-105"
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
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-gradient-to-b from-[#2c2c31] to-[#161619] py-2 pl-2 pr-5 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition hover:scale-[1.03]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] sheen">
        <svg viewBox="0 0 24 24" fill="white" className="ml-0.5 h-4 w-4">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="text-left leading-tight">
        <span className="block text-sm font-semibold text-white">
          Watch how it works
        </span>
        <span className="block text-[11px] text-white/55">
          See how it works in 2 minutes
        </span>
      </span>
    </button>
  );
}
