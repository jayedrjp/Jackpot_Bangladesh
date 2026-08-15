"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Review } from "@/types/review";
import { Star } from "lucide-react";

interface ReviewDoc extends Review {
  docId: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snap) => {
      setReviews(snap.docs.map((d) => ({ docId: d.id, ...(d.data() as Review) })));
    });
    return unsubscribe;
  }, []);

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  async function approve(docId: string) {
    await updateDoc(doc(db, "reviews", docId), { isApproved: true });
  }
  async function reject(docId: string) {
    await deleteDoc(doc(db, "reviews", docId));
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Reviews</h1>

      <div className="flex gap-2 mb-6">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === f ? "bg-jackpot-red text-white" : "bg-gray-100 text-gray-500"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
          <div key={r.docId} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-jackpot-black">{r.customerName}</span>
              <span className="flex items-center gap-1 text-sm text-jackpot-red">
                <Star className="h-4 w-4 fill-jackpot-red" /> {r.rating}
              </span>
            </div>
            <p className="text-sm text-gray-600">{r.review}</p>
            {!r.isApproved && (
              <div className="mt-3 flex gap-3">
                <button onClick={() => approve(r.docId)} className="text-sm font-semibold text-green-600">Approve</button>
                <button onClick={() => reject(r.docId)} className="text-sm font-semibold text-jackpot-red">Reject</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-400 text-sm">No reviews in this filter.</p>}
      </div>
    </div>
  );
}
