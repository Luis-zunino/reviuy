'use client';

import { Star } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { StarRatingInputProps } from './types';
import { Button } from '@/components/ui/button';

const sizeConfig = {
  sm: {
    star: 'h-4 w-4',
    text: 'text-xs',
  },
  md: {
    star: 'h-5 w-5',
    text: 'text-sm',
  },
  lg: {
    star: 'h-6 w-6',
    text: 'text-base',
  },
};

const ratingLabels = {
  0: 'Sin calificación',
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
};

/**
 * StarRatingInput - Componente interactivo para seleccionar calificaciones
 *
 * @example
 * const [rating, setRating] = useState(0);
 * <StarRatingInput value={rating} onChange={setRating} />
 */
export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  size = 'md',
  className,
  disabled = false,
  showLabel = true,
  required = false,
}) => {
  const [hover, setHover] = useState(0);
  const config = sizeConfig[size];
  const displayValue = hover || value;
  const currentLabel = ratingLabels[displayValue as keyof typeof ratingLabels] || ratingLabels[0];

  const handleClick = (rating: number) => {
    if (disabled) return;
    onChange(rating);
  };

  const handleKeyDown = (event: React.KeyboardEvent, rating: number) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(rating);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Calificación"
        aria-required={required}
      >
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              role="radio"
              variant="ghost"
              aria-checked={value === rating}
              aria-label={`${rating} estrella${rating > 1 ? 's' : ''}`}
              disabled={disabled}
              onClick={() => handleClick(rating)}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              onMouseEnter={() => !disabled && setHover(rating)}
              onMouseLeave={() => !disabled && setHover(0)}
              className={cn(
                'transition-transform focus:outline-none focus:ring-0 rounded p-0 hover:bg-transparent',
                !disabled && 'hover:scale-110 cursor-pointer',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <Star
                className={cn(
                  config.star,
                  'transition-colors',
                  rating <= displayValue ? 'text-yellow-400' : 'text-muted'
                )}
                fill={rating <= displayValue ? '#ffc107' : '#e4e5e9'}
                color={rating <= displayValue ? '#ffc107' : '#e4e5e9'}
                aria-hidden="true"
              />
            </Button>
          ))}
        </div>

        {showLabel && (
          <span className={cn('text-muted-foreground ml-1', config.text)}>
            {value > 0 ? `${value}/5` : 'Selecciona'}
          </span>
        )}
      </div>

      {/* Label descriptivo */}
      <span className={cn('text-muted-foreground', config.text)} aria-live="polite">
        {currentLabel}
      </span>
    </div>
  );
};

StarRatingInput.displayName = 'StarRatingInput';
