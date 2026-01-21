'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { BackButtonProps } from './types';

/**
 * BackButton - Botón para navegar hacia atrás
 *
 * Por defecto usa router.back() para volver a la página anterior.
 * Puedes proporcionar un callback personalizado o una URL de fallback.
 *
 * @example
 * // Comportamiento por defecto (router.back)
 * <BackButton />
 *
 * // Con URL de fallback si no hay historial
 * <BackButton fallbackUrl="/home" />
 */
export const BackButton: React.FC<BackButtonProps> = ({ fallbackUrl }) => {
  const router = useRouter();

  const handleClick = () => {
    if (fallbackUrl) {
      router.push(fallbackUrl);
    }
    router.back();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Volver atrás"
      icon={ArrowLeft}
      iconPosition="left"
      className="hover:cursor-pointer"
    />
  );
};
