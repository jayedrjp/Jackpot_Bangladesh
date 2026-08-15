import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Order, OrderStatus } from "@/types/order";
import { generateOrderId } from "@/lib/utils/orderId";

const ordersCol = collection(db, "orders");

export async function createOrder(
  data: Omit<
    Order,
    "orderId" | "createdAt" | "updatedAt" | "orderStatus" | "paymentStatus"
  >,
) {
  try {
    // In production, sequence should come from a Firestore counter/transaction
    // scoped to the current day rather than a client-side guess.
    const orderId = generateOrderId(
      new Date(),
      Math.floor(Math.random() * 900) + 100,
    );
    await addDoc(ordersCol, {
      ...data,
      orderId,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return orderId;
  } catch (err) {
    console.error("[orders] createOrder failed:", err);
    throw err;
  }
}

export async function getOrderByIdAndPhone(
  orderId: string,
  phone: string,
): Promise<Order | null> {
  try {
    const snap = await getDocs(
      query(
        ordersCol,
        where("orderId", "==", orderId),
        where("phone", "==", phone),
      ),
    );
    if (snap.empty) return null;
    return snap.docs[0].data() as Order;
  } catch (err) {
    console.error("[orders] getOrderByIdAndPhone failed:", err);
    throw err;
  }
}

export async function updateOrderStatus(docId: string, status: OrderStatus) {
  try {
    return await updateDoc(doc(db, "orders", docId), {
      orderStatus: status,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[orders] updateOrderStatus failed:", err);
    throw err;
  }
}

export async function getOrdersByBranch(branchId: string): Promise<Order[]> {
  try {
    // NOTE: where("branchId") + orderBy("createdAt") needs a Firestore
    // composite index (branchId Asc, createdAt Desc). If it's missing, this
    // is the single most likely reason an admin "orders by branch" view
    // fails to load — check the browser console for the auto-generated
    // index-creation link Firestore returns with the error.
    const snap = await getDocs(
      query(
        ordersCol,
        where("branchId", "==", branchId),
        orderBy("createdAt", "desc"),
      ),
    );
    return snap.docs.map((d) => d.data() as Order);
  } catch (err) {
    console.error("[orders] getOrdersByBranch failed:", err);
    throw err;
  }
}
