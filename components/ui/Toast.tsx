"use client";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";

interface ToastMessage { id: number; text: string }
interface ToastContextValue { showToast: (text: string) => void }

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-full bg-jackpot-black text-white px-5 py-2.5 text-sm shadow-lg">
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
