import React from 'react';
import { Filter } from 'lucide-react';
import { RealEstateSearchInput, StarRatingInput } from '@/components/common';
import { Button } from '@/components/ui/button';
import type { RealEstateSidebarProps } from './types';
import { Label } from '@/components/ui/label';

export const RealEstateSidebar: React.FC<RealEstateSidebarProps> = ({
  searchValue,
  selectedRealEstate,
  selectedRating,
  setSearchValue,
  handleRealEstateSelect,
  setSelectedRating,
  handleClearFilters,
}) => {
  return (
    <>
      <div className="flex items-center gap-2 font-bold text-foreground mb-6">
        <Filter className="w-5 h-5 text-gray-700" />
        <h2 className="text-gray-900">Filtros</h2>
      </div>
      <div className="mb-6">
        <RealEstateSearchInput
          placeholder="Buscar inmobiliaria..."
          onRealEstateSelect={handleRealEstateSelect}
          value={searchValue}
          onChange={setSearchValue}
          selectedRealEstate={selectedRealEstate}
        />
      </div>
      <div className="mb-6">
        <Label className="block text-gray-700 mb-3">Calificación mínima</Label>
        <StarRatingInput value={selectedRating} onChange={setSelectedRating} size="sm" />
      </div>

      <Button onClick={handleClearFilters}>Limpiar filtros</Button>
    </>
  );
};
