"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/top-selling", label: "Top Selling" },
  { href: "/offers", label: "Offers" },
  { href: "/branches", label: "Branches" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenuSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            aria-label="Site navigation"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[81] rounded-t-[28px] bg-white px-5 pt-5 shadow-2xl lg:hidden"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/10" />
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-jackpot-black">
                JACKPOT<span className="text-jackpot-red"> BD</span>
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
              >
                <X className="h-4.5 w-4.5 text-jackpot-black" />
              </button>
            </div>
            <nav className="flex flex-col">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="py-3.5 text-base font-semibold text-jackpot-black border-b border-black/5 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
