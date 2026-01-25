import { useState } from 'react';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useUserReviews } from '@/hooks';
import { useGetUserFavoriteRealEstates, useGetUserFavoriteReviews } from '@/services';
import { useRouter } from 'next/navigation';

export const useProfileComponent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reviews');
  const { userId, signOut } = useAuthContext();
  const { reviews, loading, error, refetch } = useUserReviews();
  const { data: favorites, isLoading: loadingFavorites } = useGetUserFavoriteRealEstates({
    userId,
  });
  const { data: favoriteReviews, isLoading: loadingFavoriteReviews } = useGetUserFavoriteReviews({
    userId,
  });

  return {
    signOut,
    reviews,
    loading,
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
