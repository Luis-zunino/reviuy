'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { NominatimEntity } from '@/types/nominatimEntity';

interface AddressSearchInputProps {
  placeholder: string;
  handleOnClick: ({
    osmId,
    position,
  }: {
    osmId: string;
    position?: { lat: number; lon: number };
  }) => void;
}

export const AddressSearchInput = ({
  placeholder = 'Ej: Av. 18 de Julio 1234, Montevideo',
  handleOnClick,
}: AddressSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<NominatimEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=uy&limit=5`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data: NominatimEntity[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (address: NominatimEntity) => {
    const { osm_id, osm_type } = address;
    const osmId = osm_type.charAt(0).toUpperCase() + osm_id.toString();
    setSearchTerm(address.display_name);
    handleOnClick({ osmId, position: { lat: Number(address.lat), lon: Number(address.lon) } });
    setResults([]);
    setIsFocused(false);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchAddresses(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, fetchAddresses]);

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
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {isFocused && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.map((result) => (
            <li
              key={result.place_id}
              onMouseDown={() => handleSelect(result)}
              onClick={() => handleSelect(result)}
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
