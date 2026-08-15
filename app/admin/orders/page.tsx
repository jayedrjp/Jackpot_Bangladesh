"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { updateOrderStatus } from "@/lib/services/orders";
import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

const STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

interface OrderRow extends Order {
  docId: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ docId: d.id, ...(d.data() as Order) })));
      },
      () => setError(true)
    );
    return unsubscribe;
  }, []);

  const filtered = orders.filter((o) => {
    const matchesStatus = filter === "All" || o.orderStatus === filter;
    const matchesSearch =
      !search ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  async function handleStatusChange(docId: string, status: OrderStatus) {
    await updateOrderStatus(docId, status);
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Orders</h1>

      {error && (
        <p className="mb-4 text-sm text-jackpot-gray">
          No orders found yet — this table will populate live once Firebase is connected and orders start coming in.
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          placeholder="Search by order ID, phone, or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-jackpot-red"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | "All")} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm">
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block rounded-2xl border border-black/5 overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
            <tr>
              {["Order ID", "Customer", "Phone", "Branch", "Total", "Status", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.docId} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold text-jackpot-black">{o.orderId}</td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3">{o.phone}</td>
                <td className="px-4 py-3">{o.branchId}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o.docId, e.target.value as OrderStatus)}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-400">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No orders found.</p>}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((o) => (
          <div key={o.docId} className="rounded-2xl border border-black/5 bg-white p-4">
            <div className="flex justify-between mb-2">
              <span className="font-black text-jackpot-black">{o.orderId}</span>
              <span className="font-bold">{formatCurrency(o.total)}</span>
            </div>
            <p className="text-sm text-gray-500">{o.customerName} · {o.phone}</p>
            <select
              value={o.orderStatus}
              onChange={(e) => handleStatusChange(o.docId, e.target.value as OrderStatus)}
              className="mt-3 w-full rounded-full border border-black/10 px-3 py-2 text-sm font-semibold"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No orders found.</p>}
      </div>
    </div>
  );
}
