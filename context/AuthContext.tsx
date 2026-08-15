"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";
import { watchAuthState, getUserProfile } from "@/lib/firebase/auth";
import type { AppUser } from "@/types/user";

interface AuthContextValue {
  firebaseUser: User | null;
  profile: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ firebaseUser: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ firebaseUser, profile, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
