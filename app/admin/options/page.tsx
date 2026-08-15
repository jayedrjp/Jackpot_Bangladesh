"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { OptionGroup, OptionChoice } from "@/types/product";
import { Trash2, Plus } from "lucide-react";

interface OptionGroupDoc extends OptionGroup {
  docId: string;
}

const emptyChoice: OptionChoice = { name: "", price: 0 };

export default function AdminOptionsPage() {
  const [groups, setGroups] = useState<OptionGroupDoc[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"single" | "multiple">("single");
  const [required, setRequired] = useState(false);
  const [choices, setChoices] = useState<OptionChoice[]>([{ ...emptyChoice }]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productOptions"), (snap) => {
      setGroups(snap.docs.map((d) => ({ docId: d.id, ...(d.data() as OptionGroup) })));
    });
    return unsubscribe;
  }, []);

  function updateChoice(i: number, field: keyof OptionChoice, value: string | number) {
    setChoices((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  function addChoiceRow() {
    setChoices((prev) => [...prev, { ...emptyChoice }]);
  }

  function removeChoiceRow(i: number) {
    setChoices((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || choices.some((c) => !c.name.trim())) return;
    await addDoc(collection(db, "productOptions"), {
      name,
      type,
      required,
      choices: choices.map((c) => ({ name: c.name, price: Number(c.price) || 0 })),
    });
    setName("");
    setType("single");
    setRequired(false);
    setChoices([{ ...emptyChoice }]);
  }

  async function handleDelete(docId: string) {
    await deleteDoc(doc(db, "productOptions", docId));
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-jackpot-black mb-6">Product Options</h1>
      <p className="text-sm text-gray-400 mb-6 max-w-2xl">
        Create reusable option groups (e.g. "Choose Size", "Extras") once here, then attach them to products
        from the Products screen. Prices are additive to the product's base price.
      </p>

      <form onSubmit={handleCreate} className="rounded-2xl border border-black/5 bg-white p-6 mb-8 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            required
            placeholder="Group name (e.g. Choose Size)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sm:col-span-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm"
          />
          <select value={type} onChange={(e) => setType(e.target.value as "single" | "multiple")} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm">
            <option value="single">Single choice</option>
            <option value="multiple">Multiple choice</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="accent-jackpot-red" />
          Required — customer must choose before adding to cart
        </label>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-gray-400">Choices</p>
          {choices.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Choice name (e.g. Large)"
                value={c.name}
                onChange={(e) => updateChoice(i, "name", e.target.value)}
                className="flex-1 rounded-xl border border-black/10 px-4 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="+Price"
                value={c.price}
                onChange={(e) => updateChoice(i, "price", Number(e.target.value))}
                className="w-28 rounded-xl border border-black/10 px-4 py-2 text-sm"
              />
              <button type="button" onClick={() => removeChoiceRow(i)} className="text-gray-400 hover:text-jackpot-red">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addChoiceRow} className="flex items-center gap-1 text-sm font-semibold text-jackpot-red">
            <Plus className="h-4 w-4" /> Add choice
          </button>
        </div>

        <button className="w-full rounded-full bg-jackpot-red py-3 font-bold text-white hover:bg-jackpot-red-dark">Create Option Group</button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div key={g.docId} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-jackpot-black">{g.name}</h3>
              <button onClick={() => handleDelete(g.docId)} className="text-gray-400 hover:text-jackpot-red">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">{g.type === "single" ? "Single choice" : "Multiple choice"} · {g.required ? "Required" : "Optional"}</p>
            <ul className="text-sm space-y-1">
              {g.choices.map((c) => (
                <li key={c.name} className="flex justify-between text-gray-600">
                  <span>{c.name}</span>
                  <span>{c.price > 0 ? `+৳${c.price}` : "Free"}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {groups.length === 0 && <p className="text-gray-400 text-sm">No option groups yet — create one above.</p>}
      </div>
    </div>
  );
}
