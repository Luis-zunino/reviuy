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
 * // Con callback personalizado
 * <BackButton handleOnClick={() => router.push('/home')} />
 *
 * // Con URL de fallback si no hay historial
 * <BackButton fallbackUrl="/home" />
 */
export const BackButton: React.FC<BackButtonProps> = ({ handleOnClick, fallbackUrl }) => {
  const router = useRouter();

  const handleClick = () => {
    if (handleOnClick) {
      handleOnClick();
    } else if (fallbackUrl) {
      // Intenta ir atrás, si no hay historial va al fallback
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    } else {
      // Comportamiento por defecto: ir atrás
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Volver atrás"
      icon={ArrowLeft}
      iconPosition="left"
    />
  );
};
