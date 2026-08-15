"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Check, X } from "lucide-react";
import { useBranch } from "@/context/BranchContext";

export default function BranchSwitcherSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { branches, selectedBranch, setSelectedBranchSlug } = useBranch();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a branch"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[81] rounded-t-[28px] bg-white px-5 pt-5 shadow-2xl lg:hidden"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/10" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-jackpot-black">Choose Branch</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
              >
                <X className="h-4.5 w-4.5 text-jackpot-black" />
              </button>
            </div>

            <div className="space-y-2 pb-2">
              {branches.map((b) => {
                const active = b.slug === selectedBranch.slug;
                return (
                  <button
                    key={b.slug}
                    onClick={() => {
                      setSelectedBranchSlug(b.slug);
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                      active ? "border-jackpot-red bg-jackpot-red/5" : "border-black/10"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className={`h-4.5 w-4.5 ${active ? "text-jackpot-red" : "text-jackpot-gray"}`} />
                      <span className="font-semibold text-jackpot-black">{b.name}</span>
                    </span>
                    {active && <Check className="h-4.5 w-4.5 text-jackpot-red" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
