import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Offer } from "@/types/offer";

const offersCol = collection(db, "offers");

export async function getActiveOffers(): Promise<Offer[]> {
  const now = Date.now();
  const snap = await getDocs(query(offersCol, where("isActive", "==", true)));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Offer))
    .filter((o) => o.validTo >= now); // expired offers stop displaying automatically
}
