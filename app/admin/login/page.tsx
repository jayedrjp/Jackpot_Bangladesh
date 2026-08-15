"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAdmin } from "@/lib/firebase/auth";
import {
  DEV_BYPASS_ENABLED,
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_PASSWORD,
  isDevBypassCredentials,
  setDevAdminSession,
} from "@/lib/devAdminBypass";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // DEV-ONLY bypass — inert in production builds. See lib/devAdminBypass.ts.
    if (isDevBypassCredentials(email, password)) {
      setDevAdminSession();
      router.push("/admin");
      return;
    }

    try {
      await signInAdmin(email, password);
      router.push("/admin");
    } catch {
      setError(
        "Invalid credentials or this account does not have admin access.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-jackpot-black px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8"
      >
        <h1 className="text-xl font-black text-jackpot-black mb-6">
          Jackpot Admin
        </h1>

        {DEV_BYPASS_ENABLED && (
          <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
            <strong className="block mb-1">Local dev preview only</strong>
            Email: <code>{DEV_ADMIN_EMAIL}</code>
            <br />
            Password: <code>{DEV_ADMIN_PASSWORD}</code>
            <br />
            This only works in <code>npm run dev</code> — it&apos;s disabled
            entirely in production. Connect Firebase for a real account.
          </div>
        )}

        {error && <p className="mb-4 text-sm text-jackpot-red">{error}</p>}
        <input
          required
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:border-jackpot-red"
        />
        <button
          disabled={loading}
          className="w-full rounded-full bg-jackpot-red py-3 font-bold text-white hover:bg-jackpot-red-dark disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
