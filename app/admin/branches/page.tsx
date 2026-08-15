"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { createBranch, updateBranch, deleteBranch } from "@/lib/services/branches";
import type { Branch } from "@/types/branch";
import { slugify } from "@/lib/utils/slugify";

const emptyForm = { name: "", phone: "", address: "", openingHours: "", googleMapsUrl: "", latitude: 0, longitude: 0 };

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "branches"), (snap) => {
      setBranches(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Branch, "id">) })));
    });
    return unsubscribe;
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await createBranch({ ...form, slug: slugify(form.name), isActive: true });
    setForm(emptyForm);
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Branches</h1>

      <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3 mb-8 rounded-2xl border border-black/5 bg-white p-5 max-w-2xl">
        <input placeholder="Branch name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm sm:col-span-2" />
        <input placeholder="Opening hours" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <input placeholder="Google Maps URL" value={form.googleMapsUrl} onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
        <button className="sm:col-span-2 rounded-full bg-jackpot-red py-2.5 text-sm font-bold text-white hover:bg-jackpot-red-dark">Add Branch</button>
      </form>

      <div className="rounded-2xl border border-black/5 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold text-jackpot-black">{b.name}</td>
                <td className="px-4 py-3">{b.phone}</td>
                <td className="px-4 py-3">
                  <button onClick={() => updateBranch(b.id, { isActive: !b.isActive })} className={b.isActive ? "text-green-600 font-semibold" : "text-gray-400 font-semibold"}>
                    {b.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteBranch(b.id)} className="text-gray-400 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {branches.length === 0 && <p className="text-center text-gray-400 py-10">No branches yet — add Staff Quarter, Konapara, and Shonir-Akhra to get started.</p>}
      </div>
    </div>
  );
}
