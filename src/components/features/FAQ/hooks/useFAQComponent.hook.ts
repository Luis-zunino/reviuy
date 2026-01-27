import { useState } from 'react';
import { FAQCategory } from '../enums';
import { getFAQCategoryLabel } from '../constants';
import { useGetDoubtsItems } from './useGetDoubtsItems.hook';

export const useFAQComponent = () => {
  const { data: doubtsItems } = useGetDoubtsItems();
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
