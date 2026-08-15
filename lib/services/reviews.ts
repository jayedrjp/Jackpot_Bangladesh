import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Review } from "@/types/review";

const reviewsCol = collection(db, "reviews");

export async function getApprovedReviews(
  productId?: string,
): Promise<Review[]> {
  try {
    const constraints = productId
      ? [where("isApproved", "==", true), where("productId", "==", productId)]
      : [where("isApproved", "==", true)];
    const snap = await getDocs(query(reviewsCol, ...constraints));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
  } catch (err) {
    console.error("[reviews] getApprovedReviews failed:", err);
    throw err;
  }
}

export async function submitReview(
  data: Omit<Review, "id" | "isApproved" | "createdAt">,
) {
  try {
    return await addDoc(reviewsCol, {
      ...data,
      isApproved: false,
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("[reviews] submitReview failed:", err);
    throw err;
  }
}
