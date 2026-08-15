import type { OptionGroup } from "@/types/product";

export interface SelectedOption {
  groupId?: string;
  groupName: string;
  choiceName: string;
  price: number;
}

export function calculateOptionTotal(selected: SelectedOption[]): number {
  return selected.reduce((sum, o) => sum + o.price, 0);
}

export function calculateUnitPrice(basePrice: number, selected: SelectedOption[]): number {
  return basePrice + calculateOptionTotal(selected);
}

export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

/** Validates that every required option group has a selection. */
export function validateRequiredOptions(
  groups: OptionGroup[],
  selectedGroupIds: Set<string>
): { valid: boolean; missing: string[] } {
  const missing = groups.filter((g) => g.required && !selectedGroupIds.has(g.id)).map((g) => g.name);
  return { valid: missing.length === 0, missing };
}

/** Revenue/cost/profit for a single order — excludes cancelled orders upstream. */
export function calculateOrderProfit(
  items: { quantity: number; finalUnitPrice: number; costPrice?: number }[]
) {
  let revenue = 0;
  let cost = 0;
  let costIncomplete = false;
  for (const item of items) {
    revenue += item.finalUnitPrice * item.quantity;
    if (item.costPrice == null) {
      costIncomplete = true;
    } else {
      cost += item.costPrice * item.quantity;
    }
  }
  return {
    revenue,
    cost,
    profit: revenue - cost,
    costIncomplete,
  };
}
