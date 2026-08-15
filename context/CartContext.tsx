"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export interface CartOptionSelection {
  groupName: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique per product+option combo, so identical customizations merge
  productId: string;
  productName: string;
  image: string;
  basePrice: number;
  selectedOptions: CartOptionSelection[];
  optionTotal: number;
  quantity: number;
  finalUnitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "cartItemId" | "totalPrice">) => void;
  removeItem: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function buildCartItemId(productId: string, options: CartOptionSelection[]) {
  const optionKey = options
    .map((o) => `${o.groupName}:${o.choiceName}`)
    .sort()
    .join("|");
  return `${productId}::${optionKey}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  function addItem(item: Omit<CartItem, "cartItemId" | "totalPrice">) {
    const cartItemId = buildCartItemId(item.productId, item.selectedOptions);
    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + item.quantity, totalPrice: i.finalUnitPrice * (i.quantity + item.quantity) }
            : i
        );
      }
      return [...prev, { ...item, cartItemId, totalPrice: item.finalUnitPrice * item.quantity }];
    });
  }

  function removeItem(cartItemId: string) {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }

  function increaseQuantity(cartItemId: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: i.quantity + 1, totalPrice: i.finalUnitPrice * (i.quantity + 1) }
          : i
      )
    );
  }

  function decreaseQuantity(cartItemId: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity - 1, totalPrice: i.finalUnitPrice * (i.quantity - 1) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.totalPrice, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, isDrawerOpen, openDrawer, closeDrawer }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
