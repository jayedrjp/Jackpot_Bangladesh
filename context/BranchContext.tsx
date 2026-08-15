"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { BRANCHES_SEED } from "@/lib/constants";

export interface SelectableBranch {
  slug: string;
  name: string;
  phone: string;
}

interface BranchContextValue {
  branches: SelectableBranch[];
  selectedBranch: SelectableBranch;
  setSelectedBranchSlug: (slug: string) => void;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

function cleanName(name: string): string {
  return name.replace("Jackpot Bangladesh ", "").replace(/[()]/g, "");
}

export function BranchProvider({ children }: { children: ReactNode }) {
  const branches = useMemo<SelectableBranch[]>(
    () => BRANCHES_SEED.map((b) => ({ slug: b.slug, name: cleanName(b.name), phone: b.phone })),
    []
  );
  const [selectedSlug, setSelectedSlug] = useState(branches[0]?.slug ?? "");

  const selectedBranch = branches.find((b) => b.slug === selectedSlug) ?? branches[0];

  return (
    <BranchContext.Provider value={{ branches, selectedBranch, setSelectedBranchSlug: setSelectedSlug }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within a BranchProvider");
  return ctx;
}
