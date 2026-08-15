import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Branch } from "@/types/branch";

const branchesCol = collection(db, "branches");

export async function getBranches(): Promise<Branch[]> {
  try {
    const snap = await getDocs(
      query(branchesCol, where("isActive", "==", true)),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Branch);
  } catch (err) {
    // Surfacing the real Firestore error (permission-denied, failed-precondition, etc.)
    // instead of letting it fail silently in the admin UI.
    console.error("[branches] getBranches failed:", err);
    throw err;
  }
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  try {
    const snap = await getDocs(query(branchesCol, where("slug", "==", slug)));
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Branch;
  } catch (err) {
    console.error("[branches] getBranchBySlug failed:", err);
    throw err;
  }
}

export async function createBranch(data: Omit<Branch, "id">) {
  try {
    // BUG FIX: getBranches() filters on isActive === true. If the caller
    // (e.g. an admin form) doesn't explicitly send isActive, it was previously
    // saved as undefined and the branch would silently never show up anywhere
    // that reads it — looking like "admin is broken" when it's really just
    // an invisible branch. Default it here so writes and reads stay consistent.
    return await addDoc(branchesCol, { ...data, isActive: data.isActive ?? true });
  } catch (err) {
    console.error("[branches] createBranch failed:", err);
    throw err;
  }
}

export async function updateBranch(id: string, data: Partial<Branch>) {
  try {
    return await updateDoc(doc(db, "branches", id), data);
  } catch (err) {
    console.error("[branches] updateBranch failed:", err);
    throw err;
  }
}

export async function deleteBranch(id: string) {
  try {
    return await deleteDoc(doc(db, "branches", id));
  } catch (err) {
    console.error("[branches] deleteBranch failed:", err);
    throw err;
  }
}
