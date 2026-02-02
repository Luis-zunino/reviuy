import { useState } from 'react';
import {
  useGetReviewByUserId,
  useGetUserFavoriteRealEstates,
  useGetUserFavoriteReviews,
} from '@/services';
import { useRouter } from 'next/navigation';

export const useProfileComponent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reviews');
  const { data: reviews, isLoading: loadingReviews, error, refetch } = useGetReviewByUserId();
  const { data: favorites, isLoading: loadingFavorites } = useGetUserFavoriteRealEstates();
  const { data: favoriteReviews, isLoading: loadingFavoriteReviews } = useGetUserFavoriteReviews();

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
