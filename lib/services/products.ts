import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Product } from "@/types/product";

const productsCol = collection(db, "products");

export async function getProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(
      query(productsCol, where("isAvailable", "==", true)),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch (err) {
    console.error("[products] getProducts failed:", err);
    throw err;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const snap = await getDocs(
      query(productsCol, where("slug", "==", slug), limit(1)),
    );
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Product;
  } catch (err) {
    console.error("[products] getProductBySlug failed:", err);
    throw err;
  }
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<Product[]> {
  try {
    const snap = await getDocs(
      query(
        productsCol,
        where("categoryId", "==", categoryId),
        where("isAvailable", "==", true),
      ),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch (err) {
    console.error("[products] getProductsByCategory failed:", err);
    throw err;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(
      query(productsCol, where("isFeatured", "==", true), limit(8)),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch (err) {
    console.error("[products] getFeaturedProducts failed:", err);
    throw err;
  }
}

export async function getTopSellingProducts(): Promise<Product[]> {
  try {
    // NOTE: where("isPopular") + orderBy("reviewCount") needs a Firestore
    // composite index (isPopular Asc, reviewCount Desc). Missing index =
    // this call throws instead of returning data.
    const snap = await getDocs(
      query(
        productsCol,
        where("isPopular", "==", true),
        orderBy("reviewCount", "desc"),
        limit(10),
      ),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch (err) {
    console.error("[products] getTopSellingProducts failed:", err);
    throw err;
  }
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">,
) {
  try {
    // BUG FIX: getProducts/getFeaturedProducts/getTopSellingProducts all
    // filter on isAvailable / isFeatured / isPopular, and the latter also
    // orders by reviewCount. A product created without these fields set was
    // invisible to storefront and admin reads, or crashed the sort. Defaults
    // below only apply when the caller doesn't already provide a value.
    return await addDoc(productsCol, {
      ...data,
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
      isPopular: data.isPopular ?? false,
      reviewCount: data.reviewCount ?? 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[products] createProduct failed:", err);
    throw err;
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  try {
    return await updateDoc(doc(db, "products", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[products] updateProduct failed:", err);
    throw err;
  }
}

export async function deleteProduct(id: string) {
  try {
    return await deleteDoc(doc(db, "products", id));
  } catch (err) {
    console.error("[products] deleteProduct failed:", err);
    throw err;
  }
}
