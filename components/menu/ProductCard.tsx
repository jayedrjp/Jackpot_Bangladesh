"use client";

import Image from "next/image";
import { Star, Plus } from "lucide-react";
import clsx from "clsx";
import type { PublicProduct } from "@/types/product";
import { formatCurrency } from "@/lib/utils/currency";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";

const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: "bg-jackpot-red text-white",
  HOT: "bg-jackpot-black text-white",
  NEW: "bg-white text-jackpot-black border border-black/10",
  SAVE: "bg-jackpot-red text-white",
};

export default function ProductCard({
  product,
  onOpen,
}: {
  product: PublicProduct;
  onOpen: (product: PublicProduct) => void;
}) {
  const price = product.discountPrice ?? product.price;
  const badgeLabel =
    product.badge === "SAVE" && product.discountPrice
      ? `SAVE ${Math.round(100 - (product.discountPrice / product.price) * 100)}%`
      : product.badge;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(product)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(product)}
      className="group relative cursor-pointer rounded-[24px] bg-white border border-[#ECECEC] overflow-hidden shadow-[0_2px_14px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-jackpot-red"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-jackpot-offwhite">
        <Image
          src={product.image || placeholderFoodImage(product.name, 500, 375)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
        />
        {badgeLabel && (
          <span
            className={clsx(
              "absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide shadow-sm",
              BADGE_STYLES[product.badge!],
            )}
          >
            {badgeLabel}
          </span>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-jackpot-black px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5">
        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-jackpot-gray mb-1 sm:mb-1.5">
          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-jackpot-red text-jackpot-red" />
          <span className="font-semibold text-jackpot-black">
            {product.rating.toFixed(1)}
          </span>
          <span>
            ({product.reviewCount > 99 ? "99+" : product.reviewCount})
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-jackpot-black leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-jackpot-gray line-clamp-2 min-h-[2.2em] sm:min-h-[2.5em]">
          {product.shortDescription}
        </p>

        <div className="mt-2 sm:mt-3 flex items-end justify-between">
          <div>
            {product.discountPrice && (
              <span className="block text-[11px] sm:text-xs text-jackpot-gray line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="font-black text-base sm:text-lg text-jackpot-red">
              {formatCurrency(price)}
            </span>
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(product);
            }}
            className="relative -mb-1 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-jackpot-black text-white shadow-lg transition-all duration-300 hover:bg-jackpot-red hover:scale-110 hover:rotate-12 active:scale-95"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
