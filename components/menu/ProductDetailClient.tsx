"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus } from "lucide-react";
import type { PublicProduct, OptionGroup } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils/currency";
import { calculateOptionTotal, calculateUnitPrice, validateRequiredOptions } from "@/lib/utils/calculations";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";
import ProductCard from "@/components/menu/ProductCard";
import ProductModal from "@/components/menu/ProductModal";

export default function ProductDetailClient({
  product,
  related,
}: {
  product: PublicProduct;
  related: PublicProduct[];
}) {
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [activeRelated, setActiveRelated] = useState<PublicProduct | null>(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const basePrice = product.discountPrice ?? product.price;

  // Pre-select the first (smallest/default) choice of every required option
  // group — e.g. size/quantity variants — so the price and Add button are
  // correct before the user touches anything.
  useEffect(() => {
    setSelections((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const group of product.options) {
        if (
          group.required &&
          group.choices.length > 0 &&
          !(next[group.id]?.length)
        ) {
          next[group.id] = [group.choices[0].name];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const selectedOptions = useMemo(() => {
    const result: { groupName: string; choiceName: string; price: number }[] = [];
    for (const group of product.options) {
      for (const choiceName of selections[group.id] ?? []) {
        const choice = group.choices.find((c) => c.name === choiceName);
        if (choice) result.push({ groupName: group.name, choiceName: choice.name, price: choice.price });
      }
    }
    return result;
  }, [product.options, selections]);

  const optionTotal = calculateOptionTotal(selectedOptions);
  const unitPrice = calculateUnitPrice(basePrice, selectedOptions);

  function toggleChoice(group: OptionGroup, choiceName: string) {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.type === "single") return { ...prev, [group.id]: [choiceName] };
      const exists = current.includes(choiceName);
      return { ...prev, [group.id]: exists ? current.filter((c) => c !== choiceName) : [...current, choiceName] };
    });
  }

  function handleAddToCart() {
    const selectedGroupIds = new Set(Object.keys(selections).filter((id) => (selections[id]?.length ?? 0) > 0));
    const { valid } = validateRequiredOptions(product.options, selectedGroupIds);
    if (!valid) {
      setShowErrors(true);
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      image: product.image,
      basePrice,
      selectedOptions,
      optionTotal,
      quantity,
      finalUnitPrice: unitPrice,
    });
    showToast("Added to cart");
  }

  return (
    <section className="w-full bg-white">
      <div className="container-max px-5 lg:px-8 py-10 grid lg:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-3xl bg-jackpot-offwhite overflow-hidden">
          <Image
            src={product.image || placeholderFoodImage(product.name, 800, 800)}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-jackpot-red">{product.tags[0] ?? "Jackpot"}</span>
          <h1 className="mt-2 text-3xl font-black text-jackpot-black">{product.name}</h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-jackpot-gray">
            <Star className="h-4 w-4 fill-jackpot-red text-jackpot-red" />
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount} reviews)</span>
          </div>
          <p className="mt-4 text-jackpot-gray">{product.description}</p>
          <div className="mt-4 font-black text-2xl text-jackpot-black">{formatCurrency(basePrice)}</div>

          <div className="mt-6 space-y-6">
            {product.options.map((group) => (
              <fieldset key={group.id}>
                <legend className="flex items-center justify-between w-full mb-2">
                  <span className="font-bold text-sm text-jackpot-black">{group.name}</span>
                  {group.required && <span className="text-[11px] font-semibold text-jackpot-red">Required</span>}
                </legend>
                {showErrors && group.required && !(selections[group.id]?.length) && (
                  <p className="text-xs text-jackpot-red mb-2">Please select {group.name.toLowerCase()}.</p>
                )}
                <div className="space-y-2">
                  {group.choices.map((choice) => {
                    const checked = (selections[group.id] ?? []).includes(choice.name);
                    return (
                      <label key={choice.name} className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 cursor-pointer hover:border-jackpot-red/40">
                        <span className="flex items-center gap-3">
                          <input
                            type={group.type === "single" ? "radio" : "checkbox"}
                            name={group.id}
                            checked={checked}
                            onChange={() => toggleChoice(group, choice.name)}
                            className="accent-jackpot-red h-4 w-4"
                          />
                          <span className="text-sm">{choice.name}</span>
                        </span>
                        <span className="text-sm text-jackpot-gray">{choice.price > 0 ? `+${formatCurrency(choice.price)}` : "Free"}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-black/10 px-3 py-1.5">
              <button aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-bold">{quantity}</span>
              <button aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 rounded-full bg-jackpot-red py-3.5 font-bold text-white hover:bg-jackpot-red-dark">
              Add • {formatCurrency(unitPrice * quantity)}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-max px-5 lg:px-8 py-10 border-t border-black/5">
          <h2 className="text-xl font-black text-jackpot-black mb-6">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setActiveRelated} />
            ))}
          </div>
        </div>
      )}
      <ProductModal product={activeRelated} isOpen={!!activeRelated} onClose={() => setActiveRelated(null)} />
    </section>
  );
}
