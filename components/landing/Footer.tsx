import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const footerLinks = [
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
  { label: "Features", href: "#features" },
  { label: "Resources", href: "#docs" },
];

const socials = [
  {
    label: "X",
    href: "#",
    path: "M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.6l8-9.2L1 2h7l4.8 6.3L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4V24h-4zM8 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.37-3.9-2.38 0-2.74 1.85-2.74 3.77V24H8z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm4.8-3.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
];

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line">
      <div className="mx-auto max-w-5xl px-5 pt-12 pb-36 sm:px-6 sm:pt-14 sm:pb-48">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-xs leading-5 text-muted">
              On a mission to make interview prep feel exactly like the real
              thing.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" className="h-3.5 w-3.5">
                    <path d={s.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 text-[11px] text-muted">
          © {new Date().getFullYear()} devmock. All rights reserved.
        </p>
      </div>

      {/* Watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <span
          className="select-none font-serif font-medium leading-none tracking-tight text-transparent"
          style={{
            fontSize: "clamp(5rem, 22vw, 18rem)",
            backgroundImage:
              "linear-gradient(to bottom, rgba(42,42,46,0.10), rgba(42,42,46,0))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            transform: "translateY(28%)",
          }}
        >
          devmock
        </span>
      </div>
    </footer>
  );
}
