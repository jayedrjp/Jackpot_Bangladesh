"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils/currency";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";

export default function CartPage() {
  const { items, subtotal, increaseQuantity, decreaseQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="w-full bg-white">
        <div className="container-max px-5 lg:px-8 py-24 text-center">
          <p className="text-lg text-jackpot-gray mb-6">Your cart is empty.</p>
          <Link href="/menu" className="inline-flex rounded-full bg-jackpot-red px-8 py-3.5 font-bold text-white hover:bg-jackpot-red-dark">
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-black text-jackpot-black mb-4">Your Cart</h1>
          {items.map((item) => (
            <div key={item.cartItemId} className="flex gap-4 rounded-2xl border border-black/5 p-4">
              <div className="relative h-20 w-20 shrink-0 rounded-xl bg-jackpot-offwhite overflow-hidden">
                <Image src={item.image || placeholderFoodImage(item.productName, 160, 160)} alt={item.productName} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-bold text-jackpot-black">{item.productName}</h3>
                  <button aria-label="Remove item" onClick={() => removeItem(item.cartItemId)} className="text-jackpot-gray hover:text-jackpot-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {item.selectedOptions.length > 0 && (
                  <p className="text-xs text-jackpot-gray mt-1">
                    {item.selectedOptions.map((o) => o.choiceName).join(", ")}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1">
                    <button onClick={() => decreaseQuantity(item.cartItemId)} className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-black/5">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.cartItemId)} className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-black/5">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-bold text-jackpot-black">{formatCurrency(item.totalPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-jackpot-offwhite p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg text-jackpot-black mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-jackpot-gray mb-2">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-jackpot-gray mb-4">Delivery fee and any discounts are calculated at checkout.</p>
          <Link href="/checkout" className="block w-full text-center rounded-full bg-jackpot-red py-3.5 font-bold text-white hover:bg-jackpot-red-dark">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
