'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleFavoriteReview } from '@/services/apis/reviews/useToggleFavoriteReview.hook';
import { useIsReviewFavorite } from '@/services/apis/reviews/useIsReviewFavorite.hook';
import type { FavoriteReviewButtonProps } from './types';

export const FavoriteReviewButton: React.FC<FavoriteReviewButtonProps> = ({
  reviewId,
  showText = false,
  className = '',
  onClick,
}) => {
  const { data: isFavorite, isLoading } = useIsReviewFavorite({ reviewId });
  const { mutateAsync, isPending } = useToggleFavoriteReview();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    onClick?.(e);

    await mutateAsync({ reviewId });
  };

  return (
    <Button
      variant="favorite"
      size={showText ? 'sm' : 'icon'}
      onClick={handleToggleFavorite}
      disabled={isPending || isLoading}
      className={`flex items-center gap-2 ${className}`}
      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      data-active={isFavorite}
      icon={Heart}
    >
      {showText ? (
        <span className="hidden sm:inline">{isFavorite ? 'Favorito' : 'Guardar'}</span>
      ) : null}
    </Button>
  );
};
