"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { CATEGORY_ICONS } from "@/lib/utils/categoryIcons";

export interface SidebarCategory {
  id: string;
  name: string;
}

export default function MenuSidebar({
  categories,
  active,
  onChange,
}: {
  categories: SidebarCategory[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <aside className="hidden lg:block lg:w-[280px] shrink-0">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-[28px] bg-white border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5">
          <h3 className="px-2 pb-4 text-xs font-bold uppercase tracking-[0.15em] text-jackpot-gray">
            Categories
          </h3>
          <nav className="space-y-1.5">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] ?? CATEGORY_ICONS.all;
              const isActive = cat.id === active;
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "bg-jackpot-red text-white shadow-md shadow-jackpot-red/25"
                      : "text-jackpot-black hover:bg-jackpot-offwhite"
                  )}
                >
                  <Icon className={clsx("h-4.5 w-4.5 shrink-0", isActive ? "text-white" : "text-jackpot-red")} />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Promotional card */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-jackpot-black to-[#2a2a2a] p-6 text-white shadow-lg">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-jackpot-red/20 blur-2xl" />
          <span className="relative inline-block rounded-full bg-jackpot-red/20 border border-jackpot-red/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-jackpot-red">
            Today&apos;s Special
          </span>
          <p className="relative mt-3 text-sm text-white/80 leading-relaxed">
            Craving something big? Check out our top-rated combos and bestsellers.
          </p>
          <Link
            href="/top-selling"
            className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-jackpot-red transition-colors"
          >
            See what&apos;s popular <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
