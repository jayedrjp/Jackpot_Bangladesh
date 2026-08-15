"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Order } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";

interface CustomerSummary {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snap) => {
      const byPhone = new Map<string, CustomerSummary>();
      snap.docs.forEach((d) => {
        const o = d.data() as Order;
        if (o.orderStatus === "Cancelled") return;
        const existing = byPhone.get(o.phone);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += o.total;
        } else {
          byPhone.set(o.phone, { phone: o.phone, name: o.customerName, orderCount: 1, totalSpent: o.total });
        }
      });
      setCustomers(Array.from(byPhone.values()).sort((a, b) => b.totalSpent - a.totalSpent));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-2">Customers</h1>
      <p className="text-sm text-gray-400 mb-6">Derived automatically from completed orders — no separate customer entry required.</p>

      <div className="rounded-2xl border border-black/5 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.phone} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold text-jackpot-black">{c.name}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{c.orderCount}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="text-center text-gray-400 py-10">No customers yet.</p>}
      </div>
    </div>
  );
}
