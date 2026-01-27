import type { FAQCategory } from '../enums';

export interface FAQItem {
  id: number;
  question: string;
  answer: React.ReactNode;
  category: FAQCategory;
}
