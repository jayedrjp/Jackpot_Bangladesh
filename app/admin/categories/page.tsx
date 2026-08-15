"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { createCategory, updateCategory, deleteCategory } from "@/lib/services/categories";
import type { Category } from "@/types/category";
import { slugify } from "@/lib/utils/slugify";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) })));
    });
    return unsubscribe;
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory({
      name, slug: slugify(name), description: "", image: "", sortOrder: categories.length + 1, isActive: true,
    });
    setName("");
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6 max-w-md">
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-xl border border-black/10 px-4 py-2.5 text-sm"
        />
        <button className="rounded-full bg-jackpot-red px-5 py-2.5 text-sm font-bold text-white hover:bg-jackpot-red-dark">Add</button>
      </form>

      <div className="rounded-2xl border border-black/5 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold text-jackpot-black">{c.name}</td>
                <td className="px-4 py-3 text-gray-400">{c.slug}</td>
                <td className="px-4 py-3">
                  <button onClick={() => updateCategory(c.id, { isActive: !c.isActive })} className={c.isActive ? "text-green-600 font-semibold" : "text-gray-400 font-semibold"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteCategory(c.id)} className="text-gray-400 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center text-gray-400 py-10">No categories yet.</p>}
      </div>
    </div>
  );
}
