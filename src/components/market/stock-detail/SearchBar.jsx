"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center gap-3 border-b px-6 py-4">

      <Search
        size={20}
        className="text-gray-600"
      />

      <input
        type="text"
        placeholder="Search eg: infy bse, nifty fut, index fund, etc."
        className="flex-1 text-lg outline-none placeholder:text-gray-400"
      />

      <kbd className="rounded border bg-gray-50 px-3 py-1 text-xs text-gray-500">
        Ctrl + Shift + F
      </kbd>

    </div>
  );
}