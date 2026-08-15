"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search burgers, wings, drinks...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-jackpot-gray" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search menu"
        className="w-full rounded-full bg-white border border-black/10 pl-12 pr-5 py-3.5 text-sm text-jackpot-black placeholder:text-jackpot-gray shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none transition-all duration-300 focus:border-jackpot-red focus:shadow-[0_4px_18px_rgba(225,29,36,0.12)]"
      />
    </div>
  );
}
