export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  image?: string;
  isActive: boolean;
  googleRating?: number;
  googleReviewCount?: number;
}
