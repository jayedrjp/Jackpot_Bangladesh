"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/menu/SearchBar";
import CategoryFilter from "@/components/menu/CategoryFilter";
import MenuSidebar from "@/components/menu/MenuSidebar";
import ProductGrid from "@/components/menu/ProductGrid";
import { MOCK_PUBLIC_PRODUCTS, MENU_CATEGORIES } from "@/lib/mock/products";

const FILTER_CATEGORIES = [{ id: "all", name: "All" }, ...MENU_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))];

export default function MenuPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // TODO: replace MOCK_PUBLIC_PRODUCTS with await getProducts() once Firestore is seeded.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PUBLIC_PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.categoryId === activeCategory;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q);
      return matchesCategory && matchesQuery && p.isAvailable;
    });
  }, [query, activeCategory]);

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-10 lg:py-14">
        <div className="lg:flex lg:gap-10 lg:items-start">
          <MenuSidebar categories={FILTER_CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-jackpot-red uppercase mb-3">
              Our Popular
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-jackpot-black tracking-tight">
              The Full Menu
            </h1>
            <p className="mt-3 text-jackpot-gray max-w-xl">
              Everything Jackpot Bangladesh has to offer, made fresh and ready to order.
            </p>

            <div className="mt-6 mb-6">
              <SearchBar value={query} onChange={setQuery} />
            </div>

            {/* Tablet/mobile fallback — horizontally scrollable pills replace
                the sticky sidebar below the lg breakpoint. */}
            <div className="lg:hidden mb-8">
              <CategoryFilter categories={FILTER_CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-jackpot-gray py-16">No items match your search — try a different keyword or category.</p>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
