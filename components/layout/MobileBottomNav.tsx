"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu as MenuIcon, Search, Home, ShoppingBag, User } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import MobileMenuSheet from "./MobileMenuSheet";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  // Profile currently points at Track Order — there's no dedicated customer
  // account page yet (see original spec's optional /account route). Swap
  // this href once that page exists.
  const isProfile = pathname === "/track-order";

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="relative mx-3 mb-3">
          <div className="flex items-center justify-between rounded-[28px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.14)] px-2 py-2.5">
            {/* Menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(true)}
              aria-label="Open site menu"
              className="flex flex-1 flex-col items-center gap-1 py-1.5 text-jackpot-gray"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Menu</span>
            </motion.button>

            {/* Search — lands on /menu, which has the search bar built in */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/menu")}
              aria-label="Search the menu"
              className="flex flex-1 flex-col items-center gap-1 py-1.5 text-jackpot-gray"
            >
              <Search className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Search</span>
            </motion.button>

            {/* Home — spacer so the elevated button doesn't sit on top of a label */}
            <div className="flex-1 flex justify-center">
              <div className="w-14" />
            </div>

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={openDrawer}
              aria-label={`Cart, ${itemCount} items`}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5 text-jackpot-gray"
            >
              <span className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-jackpot-red text-[9px] font-bold text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-semibold">Cart</span>
            </motion.button>

            {/* Profile */}
            <Link
              href="/track-order"
              aria-label="Track your order"
              className={clsx(
                "flex flex-1 flex-col items-center gap-1 py-1.5",
                isProfile ? "text-jackpot-red" : "text-jackpot-gray"
              )}
            >
              <User className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Profile</span>
            </Link>
          </div>

          {/* Elevated Home button */}
          <Link
            href="/"
            aria-label="Home"
            className="absolute left-1/2 -top-7 -translate-x-1/2"
          >
            <span
              aria-hidden
              className={clsx(
                "absolute inset-0 -m-2.5 rounded-full transition-colors duration-300",
                isHome ? "bg-jackpot-red/15" : "bg-transparent"
              )}
            />
            <motion.span
              whileTap={{ scale: 0.92 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-jackpot-red text-white shadow-[0_8px_20px_rgba(225,29,36,0.35)]"
            >
              <Home className="h-6 w-6" />
            </motion.span>
          </Link>
          <span
            className={clsx(
              "absolute left-1/2 -translate-x-1/2 top-9 text-[11px] font-semibold",
              isHome ? "text-jackpot-red" : "text-jackpot-gray"
            )}
          >
            Home
          </span>
        </div>
      </div>

      <MobileMenuSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Reserves space so the fixed bar never overlaps footer content. */}
      <div className="h-24 lg:hidden" aria-hidden />
    </>
  );
}
