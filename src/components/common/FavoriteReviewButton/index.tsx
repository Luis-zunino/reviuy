'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleFavoriteReview } from '@/services/apis/reviews/useToggleFavoriteReview.hook';
import { useIsReviewFavorite } from '@/services/apis/reviews/useIsReviewFavorite.hook';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import type { FavoriteReviewButtonProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const FavoriteReviewButton: React.FC<FavoriteReviewButtonProps> = ({
  reviewId,
  showText = false,
  className = '',
  onClick,
}) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const { data: isFavorite, isLoading } = useIsReviewFavorite({ reviewId, user });
  const { mutateAsync, isPending } = useToggleFavoriteReview();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    onClick?.(e);

    if (!user) {
      router.push(PagesUrls.LOGIN);
      return;
    }

    try {
      await mutateAsync({ reviewId });
    } catch (error) {
      console.error('Error toggling favorite review:', error);
    }
  };

  const isActive = isFavorite === true;

  return (
    <Button
      variant="favorite"
      size={showText ? 'sm' : 'icon'}
      onClick={handleToggleFavorite}
      disabled={isPending || isLoading}
      className={`flex items-center gap-2 ${className}`}
      title={isActive ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      data-active={isActive}
      icon={Heart}
    >
      {showText ? (
        <span className="hidden sm:inline">{isActive ? 'Favorito' : 'Guardar'}</span>
      ) : null}
    </Button>
  );
};
