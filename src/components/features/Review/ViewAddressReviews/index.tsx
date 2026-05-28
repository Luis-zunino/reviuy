'use client';

import { PageWithSidebar, StarRatingDisplay, LazyMapComponent } from '@/components/common';
import { Plus, MapPin, Star, MessageSquareText } from 'lucide-react';
import { useViewAddressReviews } from './hooks';
import { AddressReviewCard } from './components/AddressReviewCard';
import { Button } from '@/components/ui/button';
import { playfair, manrope } from '@/constants/fonts.constant';
import { cn } from '@/lib/utils/cn';

export const ViewAddressReviews = () => {
  const { data, reviews, isLoading, isAddressError, handleCreateReview, averageRating } =
    useViewAddressReviews();
  const address = data?.address;

  const addressLine = [address?.road, address?.house_number].filter(Boolean).join(' ');
  const locationLine = [address?.suburb, address?.city].filter(Boolean).join(', ');
  const fullLocation = [locationLine, address?.postcode].filter(Boolean).join(' · ');

  // Sidebar: mapa compacto + info + CTA
  const sidebar = address ? (
    <div className="flex flex-col gap-5">
      {/* Mapa compacto */}
      <div className="h-48 w-full overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
        <LazyMapComponent key={data?.osm_id} lat={Number(data?.lat)} lon={Number(data?.lon)}>
          {addressLine}
        </LazyMapComponent>
      </div>

      {/* Resumen de dirección */}
      <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 bg-reviuy-gray-50/50 p-4 dark:bg-reviuy-gray-800/30">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-reviuy-primary-500" />
          <div>
            <p
              className={cn(
                manrope.className,
                'text-sm font-medium text-reviuy-gray-900 dark:text-white'
              )}
            >
              {addressLine || 'Dirección'}
            </p>
            {fullLocation && (
              <p
                className={cn(
                  manrope.className,
                  'mt-0.5 text-xs text-reviuy-gray-500 dark:text-reviuy-gray-400'
                )}
              >
                {fullLocation}
              </p>
            )}
          </div>
        </div>

        {/* Rating rápido */}
        {reviews && reviews.length > 0 && (
          <div className="mt-4 flex items-center gap-4 border-t border-zinc-200/30 pt-4 dark:border-zinc-700/30">
            <div className="flex items-center gap-1.5">
              <Star className="size-4 fill-reviuy-secondary-400 text-reviuy-secondary-400" />
              <span
                className={cn(
                  manrope.className,
                  'text-lg font-bold text-reviuy-gray-900 dark:text-white'
                )}
              >
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span
              className={cn(
                manrope.className,
                'flex items-center gap-1 text-xs text-reviuy-gray-500 dark:text-reviuy-gray-400'
              )}
            >
              <MessageSquareText className="size-3.5" />
              {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <Button onClick={handleCreateReview} className="w-full" icon={Plus}>
        Compartí tu experiencia
      </Button>
    </div>
  ) : null;

  return (
    <PageWithSidebar
      isLoading={isLoading}
      isError={isAddressError || !data}
      title="Reseñas"
      description="Opiniones verificadas de inquilinos"
      sidebar={sidebar}
      headerClassName="py-8 bg-transparent border-none dark:bg-transparent"
      contentClassName="lg:col-span-3"
    >
      <div className="flex flex-col gap-8">
        {/* Header editorial con Playfair */}
        <div>
          <h1
            className={cn(
              playfair.className,
              'text-3xl font-bold leading-tight text-reviuy-gray-900 dark:text-white md:text-4xl'
            )}
          >
            {addressLine || 'Dirección'}
          </h1>
          {fullLocation && (
            <p
              className={cn(
                manrope.className,
                'mt-1.5 text-sm tracking-widest text-reviuy-gray-500 dark:text-reviuy-gray-400'
              )}
            >
              {fullLocation}
            </p>
          )}
          {reviews && reviews.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <StarRatingDisplay rating={averageRating} size="sm" />
              <span
                className={cn(
                  manrope.className,
                  'text-sm text-reviuy-gray-500 dark:text-reviuy-gray-400'
                )}
              >
                ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
          )}
        </div>

        {/* Encabezado de reseñas */}
        <div className="flex items-center justify-between border-b border-reviuy-gray-100 pb-4 dark:border-reviuy-gray-700">
          <h2
            className={cn(
              manrope.className,
              'text-lg font-semibold text-reviuy-gray-900 dark:text-white'
            )}
          >
            {reviews && reviews.length > 0 ? 'Últimas opiniones' : 'Sin opiniones'}
          </h2>
        </div>

        {/* Grid de reseñas o empty state */}
        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <AddressReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-reviuy-gray-50/50 px-6 py-16 text-center dark:border-zinc-600 dark:bg-reviuy-gray-800/20">
            <MessageSquareText className="mb-4 size-12 text-reviuy-gray-300 dark:text-reviuy-gray-600" />
            <h3
              className={cn(
                manrope.className,
                'mb-2 text-lg font-semibold text-reviuy-gray-900 dark:text-white'
              )}
            >
              Aún no hay reseñas para esta dirección
            </h3>
            <p
              className={cn(
                manrope.className,
                'mb-6 max-w-sm text-sm text-reviuy-gray-500 dark:text-reviuy-gray-400'
              )}
            >
              Tu experiencia puede ayudar a otros a decidir mejor. ¿Viviste o alquilaste acá? Contá
              tu historia.
            </p>
            <Button onClick={handleCreateReview} icon={Plus}>
              <span className="text-sm font-medium">Compartí tu experiencia</span>
            </Button>
          </div>
        )}
      </div>
    </PageWithSidebar>
  );
};
