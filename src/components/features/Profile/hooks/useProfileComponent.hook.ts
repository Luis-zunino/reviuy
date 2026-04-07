import { useState } from 'react';
import { useGetCurrentUserSummary } from '@/modules/profiles/presentation';

export const useProfileComponent = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const { data: summary, isLoading, error, refetch } = useGetCurrentUserSummary();

  const reviews = summary?.reviews ?? null;
  const favorites = summary?.favoriteRealEstates ?? [];
  const favoriteReviews = summary?.favoriteReviews ?? [];

  return {
    reviews,
    loadingReviews: isLoading,
    error,
    refetch,
    favorites,
    loadingFavorites: isLoading,
    favoriteReviews,
    loadingFavoriteReviews: isLoading,
    activeTab,
    setActiveTab,
  };
};
