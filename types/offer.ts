export interface Offer {
  id: string;
  title: string;
  description: string;
  banner: string;
  discountLabel: string; // e.g. "20% OFF"
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: number;
  validTo: number;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  isActive: boolean;
}
