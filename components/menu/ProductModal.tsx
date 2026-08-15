"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { PublicProduct, OptionGroup } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils/currency";
import { placeholderFoodImage } from "@/lib/utils/placeholderImage";
import {
  calculateOptionTotal,
  calculateUnitPrice,
  validateRequiredOptions,
} from "@/lib/utils/calculations";

type SelectionMap = Record<string, string[]>; // groupId -> chosen choice names

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: {
  product: PublicProduct | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selections, setSelections] = useState<SelectionMap>({});
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const basePrice = product?.discountPrice ?? product?.price ?? 0;

  // Pre-select the first (smallest/default) choice of every required option
  // group — e.g. size/quantity variants — whenever the modal opens for a
  // product, so the price and Add button are correct before the user
  // touches anything.
  useEffect(() => {
    if (!isOpen || !product) return;
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
  }, [isOpen, product?.id]);

  const selectedOptions = useMemo(() => {
    if (!product) return [];
    const result: { groupName: string; choiceName: string; price: number }[] =
      [];
    for (const group of product.options) {
      const chosen = selections[group.id] ?? [];
      for (const choiceName of chosen) {
        const choice = group.choices.find((c) => c.name === choiceName);
        if (choice)
          result.push({
            groupName: group.name,
            choiceName: choice.name,
            price: choice.price,
          });
      }
    }
    return result;
  }, [product, selections]);

  const optionTotal = calculateOptionTotal(selectedOptions);
  const unitPrice = calculateUnitPrice(basePrice, selectedOptions);
  const total = unitPrice * quantity;

  function toggleChoice(group: OptionGroup, choiceName: string) {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.type === "single") {
        return { ...prev, [group.id]: [choiceName] };
      }
      const exists = current.includes(choiceName);
      return {
        ...prev,
        [group.id]: exists
          ? current.filter((c) => c !== choiceName)
          : [...current, choiceName],
      };
    });
  }

  function handleAddToCart() {
    if (!product) return;
    const selectedGroupIds = new Set(
      Object.keys(selections).filter((id) => (selections[id]?.length ?? 0) > 0),
    );
    const { valid } = validateRequiredOptions(
      product.options,
      selectedGroupIds,
    );
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
      specialInstructions: instructions || undefined,
    });
    showToast("Added to cart");
    handleClose();
  }

  function handleClose() {
    setSelections({});
    setQuantity(1);
    setInstructions("");
    setShowErrors(false);
    onClose();
  }

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy="product-modal-title"
    >
      <div className="grid sm:grid-cols-2">
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[420px] bg-jackpot-offwhite">
          <Image
            src={product.image || placeholderFoodImage(product.name, 700, 700)}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wide text-jackpot-red mb-2">
            {product.tags[0] ?? "Jackpot"}
          </span>
          <h2
            id="product-modal-title"
            className="text-2xl font-black text-jackpot-black"
          >
            {product.name}
          </h2>
          <p className="mt-2 text-sm text-jackpot-gray">
            {product.description}
          </p>
          <div className="mt-3 font-black text-lg text-jackpot-black">
            {formatCurrency(basePrice)}
          </div>

          <div className="mt-5 flex-1 overflow-y-auto max-h-[36vh] sm:max-h-[30vh] pr-1 space-y-6">
            {product.options.map((group) => (
              <fieldset key={group.id}>
                <legend className="flex items-center justify-between w-full mb-2">
                  <span className="font-bold text-sm text-jackpot-black">
                    {group.name}
                  </span>
                  {group.required && (
                    <span className="text-[11px] font-semibold text-jackpot-red">
                      Required
                    </span>
                  )}
                </legend>
                {showErrors &&
                  group.required &&
                  !selections[group.id]?.length && (
                    <p className="text-xs text-jackpot-red mb-2">
                      Please select {group.name.toLowerCase()}.
                    </p>
                  )}
                <div className="space-y-2">
                  {group.choices.map((choice) => {
                    const checked = (selections[group.id] ?? []).includes(
                      choice.name,
                    );
                    return (
                      <label
                        key={choice.name}
                        className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 cursor-pointer hover:border-jackpot-red/40"
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type={
                              group.type === "single" ? "radio" : "checkbox"
                            }
                            name={group.id}
                            checked={checked}
                            onChange={() => toggleChoice(group, choice.name)}
                            className="accent-jackpot-red h-4 w-4"
                          />
                          <span className="text-sm text-jackpot-black">
                            {choice.name}
                          </span>
                        </span>
                        <span className="text-sm text-jackpot-gray">
                          {choice.price > 0
                            ? `+${formatCurrency(choice.price)}`
                            : "Free"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div>
              <label
                htmlFor="instructions"
                className="font-bold text-sm text-jackpot-black block mb-2"
              >
                Special instructions
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="E.g. no onions"
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-jackpot-red"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-black/10 px-3 py-1.5">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-bold">{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-jackpot-red py-3.5 font-bold text-white hover:bg-jackpot-red-dark transition-colors"
            >
              Add • {formatCurrency(total)}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
