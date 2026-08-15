"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { createProduct, updateProduct, deleteProduct } from "@/lib/services/products";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/currency";
import { slugify } from "@/lib/utils/slugify";
import Modal from "@/components/ui/Modal";

const emptyForm = {
  name: "", description: "", shortDescription: "", categoryId: "", price: 0, costPrice: 0,
  discountPrice: undefined as number | undefined, isAvailable: true, isPopular: false, isFeatured: false, isNew: false,
  preparationTime: 15,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) })));
    });
    return unsubscribe;
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, shortDescription: p.shortDescription, categoryId: p.categoryId,
      price: p.price, costPrice: p.costPrice ?? 0, discountPrice: p.discountPrice ?? undefined,
      isAvailable: p.isAvailable, isPopular: p.isPopular, isFeatured: p.isFeatured, isNew: p.isNew,
      preparationTime: p.preparationTime,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      slug: slugify(form.name),
      image: editing?.image ?? "",
      gallery: editing?.gallery ?? [],
      rating: editing?.rating ?? 0,
      reviewCount: editing?.reviewCount ?? 0,
      options: editing?.options ?? [],
      tags: editing?.tags ?? [],
    };
    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await createProduct(payload as any);
    }
    setModalOpen(false);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-jackpot-black">Products</h1>
        <button onClick={openCreate} className="rounded-full bg-jackpot-red px-5 py-2.5 text-sm font-bold text-white hover:bg-jackpot-red-dark">
          + Add Product
        </button>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-400">
            <tr>
              {["Name", "Category", "Price", "Cost", "Available", "Flags", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-bold text-jackpot-black">{p.name}</td>
                <td className="px-4 py-3">{p.categoryId}</td>
                <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-gray-400">{p.costPrice != null ? formatCurrency(p.costPrice) : "Missing"}</td>
                <td className="px-4 py-3">{p.isAvailable ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {[p.isPopular && "Popular", p.isFeatured && "Featured", p.isNew && "New"].filter(Boolean).join(", ")}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => openEdit(p)} className="text-jackpot-red font-semibold">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-gray-400 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center text-gray-400 py-10">No products yet — add your first one.</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-4">
          <h2 className="font-black text-lg text-jackpot-black">{editing ? "Edit Product" : "Add Product"}</h2>
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          <input required placeholder="Category ID (e.g. burgers)" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          <input placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          <textarea placeholder="Full description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-3 gap-3">
            <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
            <input type="number" placeholder="Discount price" value={form.discountPrice ?? ""} onChange={(e) => setForm({ ...form, discountPrice: e.target.value ? Number(e.target.value) : undefined })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
            <input required type="number" placeholder="Cost price (admin only)" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm" />
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {(["isAvailable", "isPopular", "isFeatured", "isNew"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-jackpot-red" />
                {key.replace("is", "")}
              </label>
            ))}
          </div>
          <button type="submit" className="w-full rounded-full bg-jackpot-red py-3 font-bold text-white hover:bg-jackpot-red-dark">
            {editing ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
