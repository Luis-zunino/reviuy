import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import type { TipsSidebarProps } from './types';

export const TipsSidebar: React.FC<TipsSidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <>
      {/* Mobile: Select dropdown */}
      <div className="lg:hidden mb-6">
        <label htmlFor="tips-category-select" className="block font-bold text-foreground mb-2">
          Categorías
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="tips-category-select" className="w-full">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name}>
                <div className="flex items-center justify-between w-full">
                  <span>{cat.name}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                    {cat.count}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Sidebar buttons */}
      <div className="hidden lg:block">
        <h3 className="font-bold text-foreground mb-6">Categorías</h3>
        <div className="space-y-3">
          {categories.map((cat) => {
            const isActive = cat.name === selectedCategory;
            return (
              <Button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                variant="ghost"
                className={`flex items-center justify-between text-sm group w-full text-left p-2 ${
                  isActive ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
                }`}
              >
                <span className="group-hover:font-medium">{cat.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {cat.count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};
