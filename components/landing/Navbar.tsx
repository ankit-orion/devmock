"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CtaButton } from "@/components/ui/CtaButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About Us", href: "#about" },
  { label: "API", href: "#api" },
  { label: "Support", href: "#support" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <header className={`sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${active ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}>
      <nav className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3 rounded-full border border-line bg-card/70 px-3 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-4 sm:py-2.5">
          <Link href="/" aria-label="devmock home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <CtaButton
              href="/sign-up"
              className="hidden px-5 py-2 md:inline-flex text-xs font-semibold"
            >
              Start Free
            </CtaButton>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-surface md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                width={18}
                height={18}
              >
                {open ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="mt-2 rounded-2xl border border-line bg-card/90 p-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <CtaButton
              href="/sign-up"
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-xs font-semibold"
            >
              Start Free
            </CtaButton>
          </div>
        )}
      </nav>
    </header>
  );
}
