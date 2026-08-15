export interface PromoBanner {
  id: string;
  image: string;
  link: string;
  alt: string;
  active: boolean;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: "offer-1",
    image: "/images/offers/1.png",
    link: "/offers",
    alt: "Special Offer 1",
    active: true,
  },
  {
    id: "offer-2",
    image: "/images/offers/2.png",
    link: "/offers",
    alt: "Special Offer 2",
    active: true,
  },
  {
    id: "offer-3",
    image: "/images/offers/3.png",
    link: "/offers",
    alt: "Special Offer 3",
    active: true,
  },
];

export function getActivePromoBanners(): PromoBanner[] {
  return PROMO_BANNERS.filter((b) => b.active);
}
