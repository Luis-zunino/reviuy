'use client';

import { Star } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import type { StarRatingDisplayProps } from './types';

const sizeConfig = {
  sm: {
    star: 'h-3 w-3',
    text: 'text-xs',
  },
  md: {
    star: 'h-4 w-4',
    text: 'text-sm',
  },
  lg: {
    star: 'h-5 w-5',
    text: 'text-base',
  },
};

/**
 * StarRatingDisplay - Componente de solo lectura para mostrar calificaciones
 *
 * @example
 * <StarRatingDisplay rating={4.5} />
 * <StarRatingDisplay rating={3} showLabel={false} size="lg" />
 */
export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating,
  showLabel = true,
  size = 'md',
  className,
}) => {
  const normalizedRating = Math.max(0, Math.min(5, rating)); // Clamp between 0-5
  const config = sizeConfig[size];

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`${normalizedRating} de 5 estrellas`}
    >
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              config.star,
              'transition-colors',
              value <= normalizedRating ? 'text-yellow-400' : 'text-muted'
            )}
            fill={value <= normalizedRating ? '#ffc107' : '#e4e5e9'}
            color={value <= normalizedRating ? '#ffc107' : '#e4e5e9'}
            aria-hidden="true"
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn('text-muted-foreground', config.text)}>
          {normalizedRating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
};

StarRatingDisplay.displayName = 'StarRatingDisplay';
