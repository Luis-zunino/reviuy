'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleFavoriteRealEstate } from '@/services/apis/realEstates/toggleFavoriteRealEstate.hook';
import { useIsRealEstateFavorite } from '@/services/apis/realEstates/isRealEstateFavorite.hook';
import type { FavoriteRealEstateButtonProps } from './types';

export const FavoriteRealEstateButton: React.FC<FavoriteRealEstateButtonProps> = ({
  realEstateId,
  showText = false,
  className = '',
}) => {
  const { data: isFavorite, isLoading } = useIsRealEstateFavorite({ realEstateId });
  const { mutateAsync, isPending } = useToggleFavoriteRealEstate();

  const handleToggleFavorite = async () => {
    await mutateAsync({ realEstateId });
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
      {showText && <span className="hidden sm:inline">{isFavorite ? 'Favorito' : 'Guardar'}</span>}
    </Button>
  );
};
