"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard, ShoppingCart, Package, Tags, SlidersHorizontal,
  Building2, Percent, Users, Star, BarChart3, Settings,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/options", label: "Options", icon: SlidersHorizontal },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/offers", label: "Offers", icon: Percent },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-jackpot-black text-white min-h-screen sticky top-0">
      <div className="px-6 py-6 font-black text-lg border-b border-white/10">
        JACKPOT<span className="text-jackpot-red"> Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-jackpot-red text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
