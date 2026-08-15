import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Order } from "@/types/order";
import { calculateOrderProfit } from "@/lib/utils/calculations";

/**
 * Computes revenue/cost/profit for a date range, excluding cancelled orders.
 * NOTE: real product cost snapshots should be captured on the order item at
 * checkout time (not re-fetched later), so historical profit stays accurate
 * even if a product's cost price changes afterward.
 */
export async function getSalesAnalytics(startTs: number, endTs: number) {
  try {
    const ordersCol = collection(db, "orders");
    const snap = await getDocs(
      query(
        ordersCol,
        where("createdAt", ">=", startTs),
        where("createdAt", "<=", endTs),
      ),
    );

    const orders = snap.docs
      .map((d) => d.data() as Order)
      .filter((o) => o.orderStatus !== "Cancelled");

    let revenue = 0;
    let cost = 0;
    let costIncomplete = false;

    for (const order of orders) {
      const result = calculateOrderProfit(
        order.items.map((i: any) => ({
          quantity: i.quantity,
          finalUnitPrice: i.finalUnitPrice,
          costPrice: i.costPrice, // must be snapshotted on the order item
        })),
      );
      revenue += result.revenue;
      cost += result.cost;
      if (result.costIncomplete) costIncomplete = true;
    }

    return {
      orderCount: orders.length,
      revenue,
      cost,
      profit: revenue - cost,
      profitMargin: revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0,
      costIncomplete,
    };
  } catch (err) {
    console.error("[analytics] getSalesAnalytics failed:", err);
    throw err;
  }
}
