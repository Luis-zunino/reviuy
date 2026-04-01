import { useState } from 'react';
import { useGetCurrentUserSummary } from '@/modules/profiles/presentation';
import { useRouter } from 'next/navigation';

export const useProfileComponent = () => {
  const router = useRouter();
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
    router,
    activeTab,
    setActiveTab,
  };
};
