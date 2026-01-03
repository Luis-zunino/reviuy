import { FAQCategory } from '../enums';

export const FAQCategoryLabels: Record<FAQCategory, string> = {
  [FAQCategory.ALL]: 'Todos',
  [FAQCategory.SEARCH]: 'Búsqueda',
  [FAQCategory.REAL_ESTATE]: 'Inmobiliarias',
  [FAQCategory.RENTAL]: 'Alquiler',
  [FAQCategory.SECURITY]: 'Seguridad',
  [FAQCategory.REVIEWS]: 'Opiniones',
  [FAQCategory.OTHERS]: 'Otros',
};

export const getFAQCategoryLabel = (category: FAQCategory): string => {
  return FAQCategoryLabels[category];
};
