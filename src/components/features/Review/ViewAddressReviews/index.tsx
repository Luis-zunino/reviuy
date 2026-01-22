'use client';

import { PageWithSidebar, StarRatingDisplay } from '@/components/common';
import { Share, Plus } from 'lucide-react';
import { useViewAddressReviews } from './hooks';
import { AddressReviewCard } from './components/AddressReviewCard';
import { Button } from '@/components/ui/button';
import { LazyMapComponent } from '@/components/common';

export const ViewAddressReviews = () => {
  const { data, reviews, isLoading, isError, handleCreateReview, averageRating } =
    useViewAddressReviews();
  const address = data?.address;
  return (
    <PageWithSidebar
      isLoading={isLoading}
      isError={isError || !data}
      authIsRequired={true}
      title="Reseñas de la dirección"
      description="Lee las reseñas de otros usuarios sobre esta dirección o comparte tu experiencia"
    >
      <div className="lg:px-14 lg:pb:-14 bg-white pb-4 mb-11 lg:mb-0">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 mb-7">
            <h1 className="text-2xl lg:text-3xl  font-secondary">
              {address?.road ? `${address.road},` : ''}{' '}
              {address?.house_number ? `${address.house_number},` : ''}{' '}
              {address?.city ? address.city : ''}
            </h1>
            <p className="text-sm tracking-widest">
              {address?.suburb ? `${address?.suburb},` : ''} {address?.postcode}
            </p>
            {reviews?.length && (
              <div className="flex items-center gap-2 mt-2">
                <StarRatingDisplay rating={averageRating} />
                <span className="text-sm text-gray-600">
                  ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            )}
          </div>
          <Button variant="share" icon={Share}>
            Compartir
          </Button>
        </div>
        <div>
          <div className="h-72 w-full mb-10">
            <LazyMapComponent key={data?.osm_id} lat={Number(data?.lat)} lon={Number(data?.lon)}>
              {data?.address?.road}, {data?.address?.house_number}
            </LazyMapComponent>
          </div>

          <div className="flex justify-between items-center my-4 py-4">
            <h2 className="h-plain text-base lg:text-xl">
              {reviews?.length ? 'Últimas opiniones' : 'Sin opiniones'}
            </h2>
            <Button onClick={handleCreateReview} icon={Plus}>
              <span className="text-sm font-medium">Crear reseña</span>
            </Button>
          </div>

          {reviews?.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {reviews.map((review) => (
                <AddressReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Aún no hay reseñas para esta dirección</p>
              <p className="text-gray-400 text-sm">Sé el primero en compartir tu experiencia</p>
            </div>
          )}
        </div>
      </div>
    </PageWithSidebar>
  );
};
