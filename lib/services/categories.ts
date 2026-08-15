import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Category } from "@/types/category";

const categoriesCol = collection(db, "categories");

export async function getCategories(): Promise<Category[]> {
  try {
    // NOTE: where("isActive") + orderBy("sortOrder") needs a Firestore
    // composite index (isActive Asc, sortOrder Asc). If it's missing, this
    // throws "The query requires an index" with a console link to create it —
    // that's a likely cause of the admin category list failing to load.
    const snap = await getDocs(
      query(
        categoriesCol,
        where("isActive", "==", true),
        orderBy("sortOrder", "asc"),
      ),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
  } catch (err) {
    console.error("[categories] getCategories failed:", err);
    throw err;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const snap = await getDocs(query(categoriesCol, where("slug", "==", slug)));
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Category;
  } catch (err) {
    console.error("[categories] getCategoryBySlug failed:", err);
    throw err;
  }
}

export async function createCategory(data: Omit<Category, "id">) {
  try {
    // BUG FIX: getCategories() filters isActive === true and orders by
    // sortOrder. Without defaults, a category created without those fields
    // set was invisible in every read, or sorted unpredictably.
    return await addDoc(categoriesCol, {
      ...data,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    });
  } catch (err) {
    console.error("[categories] createCategory failed:", err);
    throw err;
  }
}

export async function updateCategory(id: string, data: Partial<Category>) {
  try {
    return await updateDoc(doc(db, "categories", id), data);
  } catch (err) {
    console.error("[categories] updateCategory failed:", err);
    throw err;
  }
}

export async function deleteCategory(id: string) {
  try {
    return await deleteDoc(doc(db, "categories", id));
  } catch (err) {
    console.error("[categories] deleteCategory failed:", err);
    throw err;
  }
}
