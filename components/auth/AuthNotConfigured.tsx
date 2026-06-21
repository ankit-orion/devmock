export function AuthNotConfigured({ action }: { action: string }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 text-center shadow-[0_24px_50px_-30px_rgba(20,20,40,0.3)]">
      <h1 className="font-serif text-2xl font-medium text-ink">Almost there</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Authentication isn&apos;t configured yet. Add your Clerk API keys to{" "}
        <code className="rounded bg-subtle px-1 py-0.5 text-[12px]">.env.local</code>{" "}
        to enable {action}.
      </p>
      <div className="mt-4 rounded-lg border border-line bg-subtle p-3 text-left font-mono text-[11px] leading-relaxed text-ink-soft">
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
        <br />
        CLERK_SECRET_KEY=sk_...
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Get them free at dashboard.clerk.com
      </p>
    </div>
  );
}
