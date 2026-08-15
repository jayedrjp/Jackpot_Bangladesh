export interface Review {
  id: string;
  customerId?: string;
  productId?: string;
  customerName: string;
  rating: number; // 1-5
  review: string;
  image?: string;
  isApproved: boolean;
  createdAt: number;
  source?: "site" | "google";
}
