import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// All values come from environment variables — never hardcode Firebase
// project credentials in source. See .env.example.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
// Auth is browser-only: initializing it during server-side prerendering
// throws with placeholder/missing credentials, which would otherwise break
// `next build`. Real auth calls only ever happen from client components.
export const auth = typeof window !== "undefined" ? getAuth(app) : (undefined as unknown as ReturnType<typeof getAuth>);
export const storage = getStorage(app);
export default app;
