"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { hasDevAdminSession } from "@/lib/devAdminBypass";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  // DEV-ONLY bypass check — hasDevAdminSession() is always false in
  // production builds. See lib/devAdminBypass.ts.
  const [devBypassed, setDevBypassed] = useState(false);
  useEffect(() => {
    setDevBypassed(hasDevAdminSession());
  }, []);

  const isAuthorized = (!!profile && profile.role === "admin") || devBypassed;

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!isAuthorized) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthorized, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  // Dev bypass short-circuits everything below — it must not get stuck
  // behind Firebase's `loading` state, which may never resolve cleanly
  // against an empty/placeholder Firebase config.
  if (devBypassed) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-jackpot-gray">
        Loading...
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
