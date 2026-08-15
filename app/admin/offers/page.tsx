"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Offer } from "@/types/offer";

interface OfferDoc extends Offer {
  docId: string;
}

const emptyForm = {
  title: "", description: "", discountLabel: "", discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0, validFrom: "", validTo: "",
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferDoc[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "offers"), (snap) => {
      setOffers(snap.docs.map((d) => ({ docId: d.id, ...(d.data() as Offer) })));
    });
    return unsubscribe;
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.validFrom || !form.validTo) return;
    await addDoc(collection(db, "offers"), {
      title: form.title,
      description: form.description,
      banner: "",
      discountLabel: form.discountLabel,
      discountType: form.discountType,
      discountValue: form.discountValue,
      validFrom: new Date(form.validFrom).getTime(),
      validTo: new Date(form.validTo).getTime(),
      isActive: true,
    });
    setForm(emptyForm);
  }

  async function toggleActive(o: OfferDoc) {
    await updateDoc(doc(db, "offers", o.docId), { isActive: !o.isActive });
  }

  async function handleDelete(docId: string) {
    await deleteDoc(doc(db, "offers", docId));
  }

  const now = Date.now();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Offers</h1>

      <form onSubmit={handleCreate} className="rounded-2xl border border-black/5 bg-white p-6 mb-8 max-w-2xl space-y-3">
        <input required placeholder="Offer title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Label (e.g. 20% OFF)" value={form.discountLabel} onChange={(e) => setForm({ ...form, discountLabel: e.target.value })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <input type="number" placeholder="Discount value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400">Valid from</label>
            <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Valid to</label>
            <input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          </div>
        </div>
        <button className="w-full rounded-full bg-jackpot-red py-3 font-bold text-white hover:bg-jackpot-red-dark">Create Offer</button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {offers.map((o) => {
          const expired = o.validTo < now;
          return (
            <div key={o.docId} className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-jackpot-black">{o.title}</h3>
                <span className={`text-xs font-bold ${expired ? "text-gray-400" : o.isActive ? "text-green-600" : "text-gray-400"}`}>
                  {expired ? "Expired" : o.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{o.description}</p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => toggleActive(o)} className="text-sm font-semibold text-jackpot-red">
                  {o.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(o.docId)} className="text-sm font-semibold text-gray-400">Delete</button>
              </div>
            </div>
          );
        })}
        {offers.length === 0 && <p className="text-gray-400 text-sm">No offers yet — create your first promotion above.</p>}
      </div>
    </div>
  );
}
