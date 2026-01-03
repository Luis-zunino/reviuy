import { FAQCategory } from '../../../enums';

export interface FAQSidebarProps {
  categories: FAQCategory[];
  selectedCategory: FAQCategory;
  setSelectedCategory: React.Dispatch<React.SetStateAction<FAQCategory>>;
  getCategoryLabel: (category: FAQCategory) => string;
}
