"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryFilter from "@/components/menu/CategoryFilter";
import ProductCard from "@/components/menu/ProductCard";
import ProductModal from "@/components/menu/ProductModal";
import { MOCK_PUBLIC_PRODUCTS, MENU_CATEGORIES } from "@/lib/mock/products";
import type { PublicProduct } from "@/types/product";

const FILTER_CATEGORIES = [
  { id: "all", name: "All" },
  ...MENU_CATEGORIES.map((c) => ({ id: c.id, name: c.name })),
];
const PREVIEW_LIMIT = 12;

// Curated ordering: bestsellers/featured items surface first so the
// homepage teaser leads with the strongest items, then fills out with the
// rest of the catalog up to PREVIEW_LIMIT.
const CURATED_PRODUCTS = [...MOCK_PUBLIC_PRODUCTS].sort((a, b) => {
  const score = (p: PublicProduct) =>
    p.badge === "BESTSELLER" ? 2 : p.isFeatured ? 1 : 0;
  return score(b) - score(a);
});

export default function OurPopular() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [active, setActive] = useState<PublicProduct | null>(null);

  // TODO: swap CURATED_PRODUCTS for a live getFeaturedProducts()/getProducts()
  // call once Firestore is seeded — this is a preview only; the full catalog
  // lives on /menu.
  const filtered = useMemo(() => {
    return CURATED_PRODUCTS.filter(
      (p) =>
        p.isAvailable &&
        (activeCategory === "all" || p.categoryId === activeCategory),
    ).slice(0, PREVIEW_LIMIT);
  }, [activeCategory]);

  return (
    <section className="w-full" style={{ backgroundColor: "#FFFBF5" }}>
      <div className="container-max px-5 lg:px-8 py-8 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-jackpot-red uppercase mb-2 sm:mb-3">
            Our Menu
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-jackpot-black tracking-tight">
            Freshly Made, Just for You
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-jackpot-gray">
            Explore a selection of our most loved dishes, prepared fresh and
            served with quality ingredients.
          </p>
        </div>

        {/* Edge-to-edge scrollable row on mobile (matches native food-app
            chip rows); centered once it fits without scrolling on sm+. */}
        <div className="-mx-5 px-5 sm:mx-0 sm:px-0 flex sm:justify-center mb-6 sm:mb-10">
          <CategoryFilter
            categories={FILTER_CATEGORIES}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-jackpot-gray py-16">
            Nothing in this category yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={setActive}
              />
            ))}
          </div>
        )}

        {/* Premium "View Full Menu" CTA — natural continuation of the preview,
            not just a bare button. */}
        <div className="mt-8 sm:mt-16 rounded-[28px] bg-white border border-black/5 shadow-[0_4px_28px_rgba(0,0,0,0.05)] max-w-[1000px] mx-auto px-6 sm:px-12 py-8 sm:py-14 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-jackpot-red uppercase mb-3">
            Explore More
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-jackpot-black tracking-tight">
            Hungry for More?
          </h3>
          <p className="mt-3 text-jackpot-gray max-w-lg mx-auto">
            Discover our complete menu featuring burgers, wings, crispy chicken,
            drums, shakes, sides, and much more.
          </p>
          <Link
            href="/menu"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-jackpot-red px-8 py-4 font-bold text-white hover:bg-jackpot-red-dark transition-colors shadow-lg shadow-jackpot-red/20"
          >
            View Full Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ProductModal
        product={active}
        isOpen={!!active}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
