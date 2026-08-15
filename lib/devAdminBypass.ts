// DEV-ONLY admin bypass.
//
// This exists purely so the admin UI can be previewed on a machine that
// hasn't connected a real Firebase project yet. It is hard-gated behind
// `process.env.NODE_ENV !== "production"`, which Next.js sets automatically:
// `npm run dev` -> "development" (bypass works), `npm run build`/`next start`
// or any real deployment (Vercel, etc.) -> "production" (bypass is fully
// disabled, this file becomes inert). There is no way to enable this in a
// production build.
//
// DELETE this file (and its usages in app/admin/login/page.tsx and
// app/admin/layout.tsx) once a real Firebase project is connected — see
// README for the real admin-account setup steps.

export const DEV_BYPASS_ENABLED = process.env.NODE_ENV !== "production";

export const DEV_ADMIN_EMAIL = "demo@jackpotbd.com";
export const DEV_ADMIN_PASSWORD = "Demo@1234";

const STORAGE_KEY = "jackpot_dev_admin_session";

export function isDevBypassCredentials(
  email: string,
  password: string,
): boolean {
  return (
    DEV_BYPASS_ENABLED &&
    email.trim().toLowerCase() === DEV_ADMIN_EMAIL &&
    password === DEV_ADMIN_PASSWORD
  );
}

export function setDevAdminSession() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, "1");
  }
}

export function clearDevAdminSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function hasDevAdminSession(): boolean {
  if (!DEV_BYPASS_ENABLED || typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}
