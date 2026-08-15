import {
  LayoutGrid, Sandwich, Beef, Drumstick, Soup, UtensilsCrossed,
  Sparkles, Flame, CupSoda, GlassWater, type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  "chicken-burgers": Sandwich,
  "beef-burgers": Beef,
  wings: Drumstick,
  "sausage-mushroom": Soup,
  sides: UtensilsCrossed,
  toppings: Sparkles,
  drums: Drumstick,
  "crispy-chicken": Flame,
  shakes: CupSoda,
  "refreshing-drinks": GlassWater,
  "soft-drinks": CupSoda,
};
