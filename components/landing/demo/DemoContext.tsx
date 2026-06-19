"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { DemoModal } from "./DemoModal";

type DemoContextValue = {
  open: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a <DemoProvider>");
  }
  return ctx;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DemoContext.Provider value={{ open }}>
      {children}
      <DemoModal open={isOpen} onClose={close} />
    </DemoContext.Provider>
  );
}
