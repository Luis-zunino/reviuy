import { useState } from 'react';
import { getDoubtsItems } from '../utils';
import { FAQCategory } from '../enums';
import { getFAQCategoryLabel } from '../utils/faqCategoryLabels.utils';

export const useFAQComponent = () => {
  const { data: doubtsItems } = getDoubtsItems();
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(FAQCategory.ALL);

  const categories = [
    FAQCategory.ALL,
    ...Object.values(FAQCategory).filter(
      (category) =>
        category !== FAQCategory.ALL && doubtsItems.some((item) => item.category === category)
    ),
  ];

  const filteredFAQ =
    selectedCategory === FAQCategory.ALL
      ? doubtsItems
      : doubtsItems.filter((item) => item.category === selectedCategory);

  const getCategoryLabel = (category: FAQCategory) => getFAQCategoryLabel(category);

  return {
    categories,
    filteredFAQ,
    selectedCategory,
    setSelectedCategory,
    openId,
    setOpenId,
    getCategoryLabel,
  };
};
