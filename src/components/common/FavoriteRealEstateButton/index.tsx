'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleFavoriteRealEstate } from '@/services/apis/realEstates/toggleFavoriteRealEstate.hook';
import { useIsRealEstateFavorite } from '@/services/apis/realEstates/isRealEstateFavorite.hook';
import type { FavoriteRealEstateButtonProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export const FavoriteRealEstateButton: React.FC<FavoriteRealEstateButtonProps> = ({
  realEstateId,
  showText = false,
  className = '',
}) => {
  const { userId } = useAuthContext();
  const { data: isFavorite, isLoading } = useIsRealEstateFavorite({ realEstateId });
  const toggleFavoriteMutation = useToggleFavoriteRealEstate();

  const handleToggleFavorite = async () => {
    if (!userId) {
      toast.warning('Debes iniciar sesión para realizar esta acción');
      return;
    }

    await toggleFavoriteMutation.mutateAsync({ realEstateId });
  };

  const isActive = isFavorite === true;

  return (
    <Button
      variant="favorite"
      size={showText ? 'sm' : 'icon'}
      onClick={handleToggleFavorite}
      disabled={toggleFavoriteMutation.isPending || isLoading}
      className={`flex items-center gap-2 ${className}`}
      title={isActive ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      data-active={isActive}
      icon={Heart}
    >
      {showText && <span className="hidden sm:inline">{isActive ? 'Favorito' : 'Guardar'}</span>}
    </Button>
  );
};
