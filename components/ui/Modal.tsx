"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
}

export default function Modal({ isOpen, onClose, children, labelledBy }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
        >
          <X className="h-5 w-5 text-jackpot-black" />
        </button>
        {children}
      </div>
    </div>
  );
}
