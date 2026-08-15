import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { AppUser } from "@/types/user";

export async function signInAdmin(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", cred.user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    await firebaseSignOut(auth);
    throw new Error("This account does not have admin access.");
  }
  return cred.user;
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function watchAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid, ...(snap.data() as Omit<AppUser, "uid">) };
}
