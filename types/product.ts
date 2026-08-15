export interface OptionChoice {
  name: string;
  price: number; // additive price, in BDT
}

export interface OptionGroup {
  id: string;
  name: string; // e.g. "Choose Size"
  type: "single" | "multiple";
  required: boolean;
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  categoryId: string;
  price: number;
  discountPrice?: number | null;
  /** ADMIN ONLY. Never send this field to the client bundle for public pages. */
  costPrice?: number;
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isAvailable: boolean;
  preparationTime: number; // minutes
  options: OptionGroup[];
  tags: string[];
  /** Small merchandising badge shown top-left of the product card. */
  badge?: "BESTSELLER" | "HOT" | "NEW" | "SAVE";
  createdAt: number;
  updatedAt: number;
}

/** Safe shape returned to public-facing pages/components — no costPrice. */
export type PublicProduct = Omit<Product, "costPrice">;

export function stripCostPrice(product: Product): PublicProduct {
  const { costPrice, ...rest } = product;
  return rest;
}
