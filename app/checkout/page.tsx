"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils/currency";
import { BRANCHES_SEED } from "@/lib/constants";
import { createOrder } from "@/lib/services/orders";
import { useToast } from "@/components/ui/Toast";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [orderType, setOrderType] = useState<"Delivery" | "Pickup">("Delivery");
  const [address, setAddress] = useState("");
  const [branchId, setBranchId] = useState(BRANCHES_SEED[0].slug);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = orderType === "Delivery" ? (subtotal >= 500 ? 0 : 60) : 0;
  const total = subtotal + deliveryFee;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const orderId = await createOrder({
        customerName: name,
        phone,
        email: email || undefined,
        branchId,
        orderType,
        deliveryAddress: orderType === "Delivery" ? address : undefined,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          image: i.image,
          basePrice: i.basePrice,
          selectedOptions: i.selectedOptions.map((o) => ({ groupName: o.groupName, choiceName: o.choiceName, price: o.price })),
          optionTotal: i.optionTotal,
          quantity: i.quantity,
          finalUnitPrice: i.finalUnitPrice,
          totalPrice: i.totalPrice,
          specialInstructions: i.specialInstructions,
        })),
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        paymentMethod: "Cash on Delivery",
      });
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="w-full bg-white">
        <div className="container-max px-5 lg:px-8 py-24 text-center text-jackpot-gray">Your cart is empty.</div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black text-jackpot-black">Checkout</h1>

          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red" />
            <input required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red" />
          </div>
          <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red" />

          <div>
            <span className="font-bold text-sm text-jackpot-black block mb-2">Order Type</span>
            <div className="flex gap-3">
              {(["Delivery", "Pickup"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={`flex-1 rounded-xl border py-3 font-semibold text-sm ${orderType === t ? "border-jackpot-red bg-jackpot-red/5 text-jackpot-red" : "border-black/10 text-jackpot-gray"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {orderType === "Delivery" && (
            <textarea required placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red" />
          )}

          <div>
            <span className="font-bold text-sm text-jackpot-black block mb-2">Branch</span>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red">
              {BRANCHES_SEED.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          <textarea placeholder="Special instructions (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red" />

          <div className="rounded-xl bg-jackpot-offwhite p-4 text-sm text-jackpot-gray">
            Payment: <strong className="text-jackpot-black">Cash on Delivery</strong>. Online payment gateway can be added later without changing this flow.
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-full bg-jackpot-red py-4 font-bold text-white hover:bg-jackpot-red-dark disabled:opacity-50">
            {submitting ? "Placing order..." : `Place Order • ${formatCurrency(total)}`}
          </button>
        </form>

        <div className="rounded-2xl bg-jackpot-offwhite p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg text-jackpot-black mb-4">Order Summary</h2>
          {items.map((i) => (
            <div key={i.cartItemId} className="flex justify-between text-sm py-1.5">
              <span className="text-jackpot-gray">{i.productName} × {i.quantity}</span>
              <span className="font-semibold text-jackpot-black">{formatCurrency(i.totalPrice)}</span>
            </div>
          ))}
          <div className="border-t border-black/10 mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span></div>
            <div className="flex justify-between font-black text-jackpot-black text-base pt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
