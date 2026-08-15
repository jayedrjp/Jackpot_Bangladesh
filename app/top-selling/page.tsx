"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { MOCK_PUBLIC_PRODUCTS } from "@/lib/mock/products";
import { formatCurrency } from "@/lib/utils/currency";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";
import ProductModal from "@/components/menu/ProductModal";
import type { PublicProduct } from "@/types/product";

export default function TopSellingPage() {
  // TODO: replace with await getTopSellingProducts()
  const ranked = [...MOCK_PUBLIC_PRODUCTS].filter((p) => p.isPopular).sort((a, b) => b.reviewCount - a.reviewCount);
  const [active, setActive] = useState<PublicProduct | null>(null);

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-14">
        <h1 className="text-3xl sm:text-4xl font-black text-jackpot-black">Top Selling</h1>
        <p className="mt-2 text-jackpot-gray max-w-xl">The dishes Jackpot fans keep coming back for, ranked by real demand.</p>

        <div className="mt-10 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {ranked.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                className="w-full flex items-center gap-5 text-left rounded-2xl border border-black/5 p-4 hover:border-jackpot-red/30 hover:shadow-md transition-all"
              >
                <span className="text-3xl font-black text-jackpot-red/30 w-12 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="relative h-20 w-20 shrink-0 rounded-xl bg-jackpot-offwhite overflow-hidden">
                  <Image src={p.image || placeholderFoodImage(p.name, 160, 160)} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-jackpot-black">{p.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-jackpot-gray mt-1">
                    <Star className="h-3.5 w-3.5 fill-jackpot-red text-jackpot-red" />
                    {p.rating.toFixed(1)} · {p.reviewCount} reviews
                  </div>
                  <p className="text-sm text-jackpot-gray mt-1 line-clamp-1">{p.shortDescription}</p>
                </div>
                <span className="font-black text-jackpot-black shrink-0">{formatCurrency(p.discountPrice ?? p.price)}</span>
              </button>
            ))}
          </div>

          <aside className="rounded-2xl bg-jackpot-offwhite p-6 h-fit">
            <h2 className="font-bold text-jackpot-black mb-4">Customer Reviews</h2>
            <p className="text-sm text-jackpot-gray">
              Reviews are sourced live from Firestore's `reviews` collection once seeded — no placeholder testimonials are shown here.
            </p>
          </aside>
        </div>
      </div>
      <ProductModal product={active} isOpen={!!active} onClose={() => setActive(null)} />
    </section>
  );
}
