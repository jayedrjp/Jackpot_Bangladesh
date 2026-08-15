"use client";

import { useEffect, useState } from "react";
import { getSalesAnalytics } from "@/lib/services/analytics";
import { startOfDay, startOfMonth } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/currency";

interface Stats {
  todaySales: number;
  todayOrders: number;
  monthlySales: number;
  monthlyProfit: number;
  costIncomplete: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const now = Date.now();
        const today = await getSalesAnalytics(startOfDay(new Date()), now);
        const month = await getSalesAnalytics(startOfMonth(new Date()), now);
        setStats({
          todaySales: today.revenue,
          todayOrders: today.orderCount,
          monthlySales: month.revenue,
          monthlyProfit: month.profit,
          costIncomplete: today.costIncomplete || month.costIncomplete,
        });
      } catch {
        setError(true);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Dashboard Overview</h1>

      {error && (
        <p className="mb-4 text-sm text-jackpot-red">
          Sales data is not available yet. Connect Firebase and seed the `orders` collection to see live figures.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          ["Today's Sales", stats ? formatCurrency(stats.todaySales) : "—"],
          ["Today's Orders", stats ? String(stats.todayOrders) : "—"],
          ["Monthly Sales", stats ? formatCurrency(stats.monthlySales) : "—"],
          ["Monthly Profit", stats ? formatCurrency(stats.monthlyProfit) : "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white border border-black/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-jackpot-black">{value}</p>
          </div>
        ))}
      </div>

      {stats?.costIncomplete && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Cost data incomplete — some products are missing a cost price, so profit figures above may be understated. Add cost prices in Products to fix this.
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-white border border-black/5 p-5">
        <h2 className="font-bold text-jackpot-black mb-2">Live Orders</h2>
        <p className="text-sm text-gray-400">
          Wire this panel to a Firestore `onSnapshot` listener on the `orders` collection (status = Pending) to show new orders in real time.
        </p>
      </div>
    </div>
  );
}
