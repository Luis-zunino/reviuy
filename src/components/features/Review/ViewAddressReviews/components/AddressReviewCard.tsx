'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ThumbsUp, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StarRatingDisplay } from '@/components/common';
import { manrope } from '@/constants/fonts.constant';
import { cn } from '@/lib/utils/cn';
import { PagesUrls } from '@/enums';
import type { AddressReviewCardProps } from './types';

export const AddressReviewCard = ({ review }: AddressReviewCardProps) => {
  const { push } = useRouter();
  const recommended = (review.rating ?? 0) >= 3.5;

  const daysSinceCreated = useMemo(() => {
    if (!review.created_at) return null;
    const now = new Date();
    return Math.floor(
      (now.getTime() - new Date(review.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [review.created_at]);

  const handleViewMore = () => {
    push(`${PagesUrls.REVIEW_DETAILS.replace(':id', review.id ?? '')}`);
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300',
        'border-zinc-200/50 dark:border-zinc-700/50 dark:bg-reviuy-gray-800/50',
        'hover:shadow-lg hover:border-zinc-300/70 dark:hover:border-zinc-600/70'
      )}
    >
      {/* Not-recommended indicator sutil */}
      {!recommended && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-reviuy-gray-100 dark:bg-reviuy-gray-800 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-reviuy-gray-500 dark:text-reviuy-gray-400">
          No recomiendo
        </div>
      )}

      {/* Quote icon decorativo */}
      <Quote className="absolute bottom-4 right-4 size-8 text-reviuy-gray-200 dark:text-reviuy-gray-600 transition-colors duration-300 group-hover:text-reviuy-gray-400 dark:group-hover:text-reviuy-gray-400" />

      {/* Rating estrellas */}
      <div className="mb-3">
        <StarRatingDisplay rating={review.rating ?? 0} showLabel={false} size="sm" />
      </div>

      {/* Título */}
      <h3
        className={cn(
          manrope.className,
          'mb-2 text-base font-semibold leading-snug text-reviuy-gray-900 dark:text-white line-clamp-2'
        )}
      >
        {review.title}
      </h3>

      {/* Extracto */}
      <p
        className={cn(
          manrope.className,
          'mb-4 flex-1 text-sm leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400 line-clamp-3'
        )}
      >
        {review.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-reviuy-gray-100 dark:border-reviuy-gray-700 pt-4">
        <div className="flex items-center gap-3 text-xs text-reviuy-gray-500 dark:text-reviuy-gray-400">
          {daysSinceCreated !== null && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Hace {daysSinceCreated}d
            </span>
          )}
          {review.likes !== null && review.likes !== undefined && review.likes > 0 && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-3.5" />
              {review.likes}
            </span>
          )}
        </div>
        <Button onClick={handleViewMore} variant="seeMore" size="sm">
          Leer más
        </Button>
      </div>
    </article>
  );
};
