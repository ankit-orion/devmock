import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "dark" | "light";

type CtaButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  children: ReactNode;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200";

const variants: Record<Variant, string> = {
  dark:
    "bg-gradient-to-b from-[#3b3b41] to-[#161619] text-white ring-1 ring-black/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_10px_24px_-10px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_16px_30px_-12px_rgba(0,0,0,0.6)]",
  light:
    "bg-white text-ink ring-1 ring-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:ring-black/20",
};

export function CtaButton({
  variant = "dark",
  className = "",
  children,
  ...props
}: CtaButtonProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
