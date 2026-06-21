"use client";

import dynamic from "next/dynamic";

// R3F/Three can't render on the server — load the scene client-only.
const MascotScene = dynamic(
  () => import("./MascotScene").then((m) => m.MascotScene),
  { ssr: false, loading: () => null },
);

export function Mascot({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <MascotScene />
    </div>
  );
}
