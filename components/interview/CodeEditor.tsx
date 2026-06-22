"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[220px] items-center justify-center text-xs text-muted">
      Loading editor…
    </div>
  ),
});

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp"];

export function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5a97f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#efd97a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8bd5a0]" />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-md border border-line bg-card px-2 py-1 text-[11px] font-medium text-ink-soft outline-none"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <MonacoEditor
        height="220px"
        language={language}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme={dark ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          renderLineHighlight: "none",
          fontFamily: "var(--font-mono, monospace)",
        }}
      />
    </div>
  );
}
