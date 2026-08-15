"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PackageSearch, ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/top-selling", label: "Top Selling" },
  { href: "/offers", label: "Offers" },
  { href: "/branches", label: "Branches" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 w-full bg-white/95 backdrop-blur transition-shadow",
        scrolled
          ? "shadow-md border-b border-black/5"
          : "border-b border-transparent",
      )}
    >
      <div
        className={clsx(
          "container-max px-5 lg:px-8 flex items-center justify-between transition-all",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Jackpot Bangladesh home"
        >
          <Image
            src="/images/jackpot_logo.png"
            alt="Jackpot BD Logo"
            width={56}
            height={56}
            className="hidden sm:block h-14 w-14 rounded-full object-cover"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-jackpot-black/80 hover:text-jackpot-red transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/track-order"
            aria-label="Track Order"
            title="Track Order"
            className="group relative hidden sm:flex p-2 rounded-full hover:bg-black/5"
          >
            <PackageSearch className="h-5 w-5" />
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-jackpot-black px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Track Order
            </span>
          </Link>
          <button
            onClick={openDrawer}
            aria-label={`Cart, ${itemCount} items`}
            className="relative p-2 rounded-full hover:bg-black/5"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-jackpot-red text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            href="/menu"
            className="hidden sm:inline-flex rounded-full bg-jackpot-red px-5 py-2.5 text-sm font-bold text-white hover:bg-jackpot-red-dark"
          >
            Order Now
          </Link>
          <button
            aria-label="Open menu"
            className="lg:hidden p-2 rounded-full hover:bg-black/5"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex items-center justify-between px-5 h-16 border-b">
            <span className="font-black text-jackpot-black">
              JACKPOT<span className="text-jackpot-red"> BD</span>
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col p-5 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-lg font-semibold border-b border-black/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track-order"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-lg font-semibold border-b border-black/5"
            >
              Track Order
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-lg font-semibold"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
