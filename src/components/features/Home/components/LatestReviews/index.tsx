'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { useLatestReviews } from './hooks';
import { Loading } from '@/components/common/Loading';
import { StarRating } from '@/components/common';
import { PagesUrls } from '@/enums';

export const LatestReviews = () => {
  const { reviewsData, loading, error, addVote } = useLatestReviews();

  if (reviewsData?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No hay reseñas todavía. ¡Sé el primero!</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-center">Listado de ultimas reseñas</h2>
      {loading ? <Loading message="Cargando reseñas..." /> : null}
      {error && (
        <div className="p-6 text-center text-red-500">Error al cargar: {error.message}</div>
      )}
      {!loading && !error && (
        <div className="flex gap-5 overflow-y-auto">
          {reviewsData?.map((review) => (
            <Card key={review.id} className="min-w-96">
              <CardHeader>
                <CardTitle className="text-lg">{review.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=" text-sm mb-2">
                  <div className="flex justify-between gap-1">
                    Lugar: <StarRating rating={review.rating} />
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    Zona: <StarRating rating={review.zone_rating} />
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{review.description}</p>
              </CardContent>
              <CardFooter className="p-4 flex justify-around bg-gray-50">
                <Button
                  onClick={() => {
                    redirect(PagesUrls.REVIEW_DETAILS);
                  }}
                >
                  Ver detalles
                </Button>
                <div className="text-center">
                  <span className="text-xs text-gray-500">¿Te fue útil?</span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addVote({ id: Number(review.id), voteType: 'like' })}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" /> {review.likes}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addVote({ id: Number(review.id), voteType: 'dislike' })}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" /> {review.dislikes}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
