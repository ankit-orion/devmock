import Link from "next/link";

// Placeholder until Phase 4 (live interview session UI) is built.
export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[#3b3b41] to-[#161619] sheen">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M4 5h16v11H7l-3 3z" />
        </svg>
      </span>
      <h1 className="mt-5 font-serif text-3xl font-medium tracking-tight text-ink">
        Your interview is ready
      </h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-soft">
        The live interview session screen is coming next (Phase 4). Your plan
        for session{" "}
        <code className="rounded bg-subtle px-1.5 py-0.5 text-[12px]">{id}</code>{" "}
        has been created.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/interview/new"
          className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          Back to setup
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-sm font-medium text-white sheen dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
