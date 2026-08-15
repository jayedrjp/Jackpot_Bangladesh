"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getSalesAnalytics } from "@/lib/services/analytics";
import { startOfMonth } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/currency";

interface PeriodStats {
  orderCount: number;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  costIncomplete: boolean;
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export default function AdminAnalyticsPage() {
  const [current, setCurrent] = useState<PeriodStats | null>(null);
  const [previous, setPrevious] = useState<PeriodStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthStart = startOfMonth(prevMonthDate);
        const prevMonthEnd = thisMonthStart - 1;

        const [curr, prev] = await Promise.all([
          getSalesAnalytics(thisMonthStart, Date.now()),
          getSalesAnalytics(prevMonthStart, prevMonthEnd),
        ]);
        setCurrent(curr);
        setPrevious(prev);
      } catch {
        setError(true);
      }
    }
    load();
  }, []);

  const revenueChange = current && previous ? pctChange(current.revenue, previous.revenue) : null;
  const profitChange = current && previous ? pctChange(current.profit, previous.profit) : null;
  const orderChange = current && previous ? pctChange(current.orderCount, previous.orderCount) : null;

  // Placeholder chart shape until per-day aggregation (e.g. sales/{YYYY-MM-DD}) is wired in.
  const chartData = [{ name: "This Month", revenue: current?.revenue ?? 0 }, { name: "Last Month", revenue: previous?.revenue ?? 0 }];

  function ChangeBadge({ value }: { value: number | null }) {
    if (value === null) return <span className="text-xs text-gray-400">No prior data</span>;
    const up = value > 0;
    return (
      <span className={`text-xs font-bold ${up ? "text-green-600" : value < 0 ? "text-jackpot-red" : "text-gray-400"}`}>
        {up ? "↑" : value < 0 ? "↓" : "—"} {Math.abs(value).toFixed(1)}%
      </span>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Sales Analytics</h1>

      {error && <p className="mb-4 text-sm text-jackpot-gray">Sales data is not available yet — connect Firebase to see real figures here.</p>}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-white border border-black/5 p-5">
          <p className="text-xs uppercase text-gray-400 font-semibold">Revenue (This Month)</p>
          <p className="mt-2 text-2xl font-black text-jackpot-black">{current ? formatCurrency(current.revenue) : "—"}</p>
          <ChangeBadge value={revenueChange} />
        </div>
        <div className="rounded-2xl bg-white border border-black/5 p-5">
          <p className="text-xs uppercase text-gray-400 font-semibold">Profit (This Month)</p>
          <p className="mt-2 text-2xl font-black text-jackpot-black">{current ? formatCurrency(current.profit) : "—"}</p>
          <ChangeBadge value={profitChange} />
        </div>
        <div className="rounded-2xl bg-white border border-black/5 p-5">
          <p className="text-xs uppercase text-gray-400 font-semibold">Orders (This Month)</p>
          <p className="mt-2 text-2xl font-black text-jackpot-black">{current ? current.orderCount : "—"}</p>
          <ChangeBadge value={orderChange} />
        </div>
      </div>

      {current?.costIncomplete && (
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Cost data incomplete — some order items are missing a snapshotted cost price, so profit figures may be understated.
        </div>
      )}

      <div className="rounded-2xl bg-white border border-black/5 p-5 mb-8">
        <h2 className="font-bold text-jackpot-black mb-4">Monthly Revenue Comparison</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatCurrency(Number(v) || 0)} />
              <Bar dataKey="revenue" fill="#e11d24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-black/5 p-5">
        <h2 className="font-bold text-jackpot-black mb-2">Branch-wise Analytics</h2>
        <p className="text-sm text-gray-400">
          Requires an admin-side aggregation query grouping completed orders by `branchId` — hook this up to
          <code className="mx-1 text-jackpot-red">getOrdersByBranch()</code>
          once branches are seeded and have real order volume.
        </p>
      </div>
    </div>
  );
}
