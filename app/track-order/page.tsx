"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderByIdAndPhone } from "@/lib/services/orders";
import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";

const TIMELINE: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Ready", "Out for Delivery", "Delivered"];

function TrackOrderContent() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("orderId") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    try {
      const result = await getOrderByIdAndPhone(orderId.trim(), phone.trim());
      if (result) setOrder(result);
      else {
        setOrder(null);
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = order ? TIMELINE.indexOf(order.orderStatus) : -1;

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-jackpot-black mb-6">Track Your Order</h1>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            required
            placeholder="Order ID (e.g. JACK-20260731-001)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red"
          />
          <input
            required
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red"
          />
          <button disabled={loading} className="rounded-xl bg-jackpot-red px-6 py-3 font-bold text-white hover:bg-jackpot-red-dark disabled:opacity-50">
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {notFound && <p className="text-center text-jackpot-gray">No matching order found. Check the order ID and phone number.</p>}

        {order && (
          <div className="rounded-2xl border border-black/5 p-6">
            <div className="flex justify-between mb-6">
              <span className="font-black text-jackpot-black">{order.orderId}</span>
              <span className="font-bold text-jackpot-red">{formatCurrency(order.total)}</span>
            </div>
            {order.orderStatus === "Cancelled" ? (
              <p className="text-jackpot-red font-semibold">This order was cancelled.</p>
            ) : (
              <ol className="space-y-4">
                {TIMELINE.map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${i <= currentIndex ? "bg-jackpot-red" : "bg-gray-200"}`}
                    />
                    <span className={i === currentIndex ? "font-bold text-jackpot-black" : "text-jackpot-gray"}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}
