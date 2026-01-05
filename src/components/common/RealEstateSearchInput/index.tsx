'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Plus, X } from 'lucide-react';
import { useRealEstateSearchInput } from './hooks';
import { CreateRealEstateModal } from '@/components/features/RealEstate/CreateRealEstate/CreateRealEstateModal';
import type { RealEstateSearchInputProps } from './types';

export const RealEstateSearchInput = ({
  placeholder = 'Buscar inmobiliaria...',
  onRealEstateSelect,
  selectedRealEstate,
  isModal,
  value,
  onChange,
  name,
  disabled,
}: RealEstateSearchInputProps) => {
  const {
    value: inputValue,
    handleInputChange,
    setIsFocused,
    setShowResults,
    isFocused,
    showResults,
    isLoading,
    results,
    handleRealEstateClick,
    shouldShowNoResults,
    debouncedSearchTerm,
    handleCreateNew,
    isModalOpen,
    onOpenChange,
    clearSelection,
  } = useRealEstateSearchInput({
    onRealEstateSelect,
    selectedRealEstate,
    onChange,
    value,
  });

  return (
    <div className="relative w-full">
      <div className="relative w-full flex justify-center align-middle">
        <div className="relative w-full">
          <Input
            type="text"
            value={selectedRealEstate?.name || inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setShowResults(false);
              }, 200);
            }}
            placeholder={selectedRealEstate ? '' : placeholder}
            autoComplete="off"
            name={name}
            disabled={disabled || Boolean(selectedRealEstate)}
          />
          {selectedRealEstate ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-red-100"
                onClick={clearSelection}
              >
                <X className="h-6 w-6 text-red-500" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {isFocused && showResults && !selectedRealEstate && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {isLoading && (
            <li className="flex items-center justify-center py-4 text-sm text-gray-500">
              Buscando inmobiliarias...
            </li>
          )}

          {!isLoading &&
            results?.map((result) => (
              <li key={result.id}>
                <Button
                  variant="ghost"
                  onClick={() => handleRealEstateClick(result)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 w-full justify-start h-auto border-b border-gray-100 last:border-b-0 rounded-none"
                >
                  <Building2 className="h-4 w-4 flex-shrink-0 mt-1 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </span>
                    </div>
                  </div>
                </Button>
              </li>
            ))}
        </ul>
      )}

      {isFocused && shouldShowNoResults && !selectedRealEstate && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-4 text-center">
            <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              No encontramos la inmobiliaria {debouncedSearchTerm}
            </p>
            <Button
              type="button"
              onClick={() => handleCreateNew(isModal)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar nueva inmobiliaria
            </Button>
          </div>
        </div>
      )}
      <CreateRealEstateModal
        isOpen={isModalOpen}
        onOpenChange={onOpenChange}
        defaultValue={debouncedSearchTerm}
      />
    </div>
  );
};
