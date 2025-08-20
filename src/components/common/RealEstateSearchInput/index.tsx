"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export interface NominatimResult {
  place_id: number;
  display_name: string;
}

interface RealEstateSearchInputProps {
  placeholder: string;
  handleOnClick?: () => void;
}

export const RealEstateSearchInput = ({
  placeholder = "Inombiliaria ABC",
}: RealEstateSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results] = useState<NominatimResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <div className="relative w-full flex justify-center align-middle">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          autoComplete="off"
          required
        />
      </div>

      {isFocused && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.map((result) => (
            <li
              key={result.place_id}
              className="flex cursor-pointer items-start gap-3 px-4 py-2 hover:bg-gray-100"
            >
              <MapPin className="h-4 w-4 flex-shrink-0 mt-1 text-gray-500" />
              <span className="text-sm">{result.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
