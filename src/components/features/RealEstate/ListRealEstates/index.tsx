'use client';

import { Building2 } from 'lucide-react';
import { StarRatingDisplay, PageWithSidebar } from '@/components/common';
import Link from 'next/link';
import { PagesUrls } from '@/enums';
import { useListRealEstate } from './hooks';
import { RealEstateSidebar } from './components';
import { Button } from '@/components/ui/button';

export const ListRealEstates: React.FC = () => {
  const {
    isLoading,
    displayedItems,
    handleClearFilters,
    isFetchingNextPage,
    loadMore,
    hasNextPage,
    form,
  } = useListRealEstate();

  return (
    <PageWithSidebar
      title="Inmobiliarias"
      description="Conocé las calificaciones y reseñas de las principales inmobiliarias"
      sidebar={<RealEstateSidebar form={form} handleClearFilters={handleClearFilters} />}
    >
      <div className="mb-4 text-gray-600">
        Mostrando {displayedItems.length}{' '}
        {displayedItems.length === 1 ? 'inmobiliaria' : 'inmobiliarias'}
      </div>

      {!isLoading && displayedItems.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron inmobiliarias
          </h3>
          <p className="text-gray-600">
            Intenta ajustar tus filtros o realiza una búsqueda diferente
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedItems.map((realEstate) => (
              <div
                key={realEstate.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3 flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {realEstate.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <StarRatingDisplay
                            rating={
                              realEstate.rating ? parseFloat(realEstate.rating.toString()) : 0
                            }
                          />
                        </div>
                      </div>
                      <Link
                        href={PagesUrls.REAL_ESTATE_VIEW.replace(':id', realEstate.id)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Ver perfil
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">
                          {realEstate.review_count || 0}{' '}
                          {realEstate.review_count === 1 ? 'reseña' : 'reseñas'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button onClick={loadMore} disabled={isFetchingNextPage} variant="outline" size="lg">
                {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
              </Button>
            </div>
          )}
        </>
      )}
    </PageWithSidebar>
  );
};
