"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import { useBranch } from "@/context/BranchContext";
import BranchSwitcherSheet from "./BranchSwitcherSheet";

export default function MobileTopNav() {
  const pathname = usePathname();
  const { selectedBranch } = useBranch();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div
        className="sticky top-0 z-40 lg:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-3 mt-3 flex items-center justify-between rounded-full bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-3 py-2"
        >
          <Link
            href="/"
            aria-label="Jackpot Bangladesh home"
            className="flex items-center shrink-0"
          >
            <Image
              src="/images/jackpot_logo.png"
              alt="Jackpot Bangladesh"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              priority
            />
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-label={`Selected branch: ${selectedBranch?.name}. Tap to change branch.`}
            className="flex items-center gap-1.5 rounded-full bg-jackpot-offwhite px-3.5 py-2"
          >
            <MapPin className="h-4 w-4 text-jackpot-red shrink-0" />
            <span className="text-sm font-semibold text-jackpot-black max-w-[110px] truncate">
              {selectedBranch?.name ?? "Select branch"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-jackpot-gray shrink-0" />
          </motion.button>
        </motion.div>
      </div>

      <BranchSwitcherSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
