import { useState } from 'react';
import { FAQCategory } from '../enums';
import { getFAQCategoryLabel } from '../constants';
import { getDoubtsItems } from './getDoubtsItems.hook';

export const useFAQComponent = () => {
  const { data: doubtsItems } = getDoubtsItems();
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(FAQCategory.ALL);

  const categories = [...Object.values(FAQCategory)];

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
