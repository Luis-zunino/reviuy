import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FAQSidebarProps } from './types';

export const FAQSidebar = (props: FAQSidebarProps) => {
  const { categories, selectedCategory, setSelectedCategory, getCategoryLabel } = props;
  return (
    <>
      {/* Mobile: Select dropdown */}
      <div className="lg:hidden mb-6">
        <label htmlFor="category-select" className="block font-bold text-foreground mb-2">
          Categorías
        </label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as typeof selectedCategory)}
        >
          <SelectTrigger id="category-select" className="w-full">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {getCategoryLabel(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Sidebar buttons */}
      <div className="hidden lg:block">
        <h3 className="font-bold text-foreground mb-6">Categorías</h3>
        <div>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center justify-between text-sm group w-full text-left p-0 ${
                selectedCategory === category ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
              }`}
              variant="link"
            >
              <span className="group-hover:font-medium p-1">{getCategoryLabel(category)}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
