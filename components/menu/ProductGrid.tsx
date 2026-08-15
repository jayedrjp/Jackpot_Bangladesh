"use client";

import { useState } from "react";
import type { PublicProduct } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function ProductGrid({
  products,
}: {
  products: PublicProduct[];
}) {
  const [active, setActive] = useState<PublicProduct | null>(null);

  if (products.length === 0) {
    return (
      <p className="text-center text-jackpot-gray py-16">No items available.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setActive} />
        ))}
      </div>
      <ProductModal
        product={active}
        isOpen={!!active}
        onClose={() => setActive(null)}
      />
    </>
  );
}
