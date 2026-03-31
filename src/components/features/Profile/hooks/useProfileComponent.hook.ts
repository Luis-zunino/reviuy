import { useState } from 'react';
import {
  useGetCurrentUserFavoriteRealEstates,
  useGetCurrentUserFavoriteReviews,
  useGetCurrentUserReviews,
} from '@/services';
import { useRouter } from 'next/navigation';

export const useProfileComponent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reviews');
  const { data: reviews, isLoading: loadingReviews, error, refetch } = useGetCurrentUserReviews();
  const { data: favorites, isLoading: loadingFavorites } = useGetCurrentUserFavoriteRealEstates();
  const { data: favoriteReviews, isLoading: loadingFavoriteReviews } =
    useGetCurrentUserFavoriteReviews();

  return {
    reviews,
    loadingReviews,
    error,
    refetch,
    favorites,
    loadingFavorites,
    favoriteReviews,
    loadingFavoriteReviews,
    router,
    activeTab,
    setActiveTab,
  };
};
