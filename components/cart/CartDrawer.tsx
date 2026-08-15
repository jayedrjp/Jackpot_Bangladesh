"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2, Lock } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils/currency";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";

export default function CartDrawer() {
  const { items, itemCount, subtotal, increaseQuantity, decreaseQuantity, removeItem, isDrawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
        className={clsx(
          "fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={clsx(
          "fixed top-0 right-0 z-[71] h-full w-full sm:w-[420px] lg:w-[460px] bg-white shadow-2xl flex flex-col",
          "rounded-l-none sm:rounded-l-3xl lg:rounded-l-[24px]",
          "transition-transform duration-[350ms] ease-out",
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Sticky header */}
        <div className="shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-jackpot-black">Your Cart</h2>
              <p className="mt-0.5 text-sm text-jackpot-gray">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Close cart"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-jackpot-black" />
            </button>
          </div>
        </div>
        <div className="h-px bg-[#F1F1F1] shrink-0" />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-jackpot-offwhite mb-6">
              <ShoppingBag className="h-10 w-10 text-jackpot-gray" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-jackpot-black">Your cart is empty</h3>
            <p className="mt-2 text-sm text-jackpot-gray max-w-[260px]">
              Looks like you haven&apos;t added anything yet. Browse our delicious menu and start your order.
            </p>
            <Link
              href="/menu"
              onClick={closeDrawer}
              className="mt-7 inline-flex h-[52px] w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-jackpot-red to-jackpot-red-dark font-bold text-white shadow-lg shadow-jackpot-red/25 hover:brightness-105 transition-all"
            >
              <ShoppingBag className="h-4.5 w-4.5" /> Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.map((item) => {
                const sizeOption = item.selectedOptions.find((o) => o.groupName.toLowerCase().includes("size"));
                const otherOptions = item.selectedOptions.filter((o) => o !== sizeOption);
                return (
                  <div key={item.cartItemId} className="flex gap-4 rounded-2xl border border-[#F1F1F1] p-4">
                    <div className="relative h-[90px] w-[90px] shrink-0 rounded-xl overflow-hidden bg-jackpot-offwhite">
                      <Image src={item.image || placeholderFoodImage(item.productName, 180, 180)} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-jackpot-black text-sm leading-snug">{item.productName}</h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          aria-label={`Remove ${item.productName}`}
                          className="shrink-0 text-jackpot-gray hover:text-jackpot-red transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {sizeOption && <p className="mt-1 text-xs text-jackpot-gray">Size: {sizeOption.choiceName}</p>}
                      {otherOptions.length > 0 && (
                        <p className="text-xs text-jackpot-gray line-clamp-1">+ {otherOptions.map((o) => o.choiceName).join(", ")}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full bg-jackpot-offwhite px-2.5 py-1.5">
                          <button
                            onClick={() => decreaseQuantity(item.cartItemId)}
                            aria-label="Decrease quantity"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.cartItemId)}
                            aria-label="Increase quantity"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-black text-jackpot-black">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky checkout footer */}
            <div className="shrink-0 border-t border-[#F1F1F1] px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-jackpot-gray">Subtotal</span>
                <span className="font-semibold text-jackpot-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-jackpot-gray">Delivery Fee</span>
                <span className="text-jackpot-gray">Calculated at checkout</span>
              </div>
              <div className="h-px bg-[#F1F1F1]" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-jackpot-black">Total</span>
                <span className="text-xl font-black text-jackpot-red">{formatCurrency(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="mt-2 flex h-[52px] w-full items-center justify-center rounded-full bg-jackpot-red font-bold text-white shadow-lg shadow-jackpot-red/25 hover:bg-jackpot-red-dark transition-colors"
              >
                Proceed to Checkout
              </Link>
              <p className="flex items-center justify-center gap-1.5 text-xs text-jackpot-gray pt-0.5">
                <Lock className="h-3 w-3" /> Secure Checkout
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
