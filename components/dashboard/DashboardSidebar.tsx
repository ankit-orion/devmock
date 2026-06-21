"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserButton } from "@clerk/nextjs";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: "M3 11l9-7 9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { label: "New Interview", href: "/interview/new", icon: "M12 5v14M5 12h14" },
  { label: "History", href: "/dashboard/history", icon: "M12 8v4l3 2M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z" },
  { label: "Settings", href: "/dashboard/settings", icon: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" },
];

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-surface text-ink ring-1 ring-line shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          : "text-ink-soft hover:bg-surface/60 hover:text-ink"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d={icon} />
      </svg>
      {label}
    </Link>
  );
}

function UserArea() {
  if (clerkEnabled) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
        <UserButton />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-ink">Your account</p>
          <p className="truncate text-[10px] text-muted">Manage profile</p>
        </div>
      </div>
    );
  }
  return (
    <Link href="/sign-in" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-surface/60">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7aa2f7] text-[11px] font-bold text-white">
        AK
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-ink">Aditya Kumar</p>
        <p className="truncate text-[10px] text-muted">Sign in</p>
      </div>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-card/70 p-4 backdrop-blur-xl lg:flex">
        <Link href="/" aria-label="devmock home" className="px-2 py-1.5">
          <Logo />
        </Link>

        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-medium text-muted">Theme</span>
            <ThemeToggle />
          </div>
          <UserArea />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-card/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/" aria-label="devmock home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" width={18} height={18}>
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

      {/* Mobile drawer */}
      {open && (
        <div className="sticky top-[57px] z-40 border-b border-line bg-card/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={isActive(item.href)}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
          <div className="mt-2 border-t border-line pt-2">
            <UserArea />
          </div>
        </div>
      )}
    </>
  );
}
