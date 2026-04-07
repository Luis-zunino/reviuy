'use client';

import { Building2, Plus } from 'lucide-react';
import { StarRatingDisplay, PageWithSidebar, Loader, Box } from '@/components/common';
import Link from 'next/link';
import { PagesUrls } from '@/enums';
import { useListRealEstate } from './hooks';
import { RealEstateSidebar } from './components';
import { Button } from '@/components/ui/button';
import { CreateRealEstateModal } from '../CreateRealEstate';

export const ListRealEstates: React.FC = () => {
  const {
    isLoading,
    displayedItems,
    handleClearFilters,
    isFetchingNextPage,
    loadMore,
    hasNextPage,
    form,
    isCreateRealEstateOpen,
    setIsCreateRealEstateOpen,
  } = useListRealEstate();

  return (
    <PageWithSidebar
      title="Inmobiliarias"
      description="Conocé las calificaciones y reseñas de las principales inmobiliarias"
      sidebar={<RealEstateSidebar form={form} handleClearFilters={handleClearFilters} />}
    >
      <div className="mb-4">
        Mostrando {displayedItems.length}{' '}
        {displayedItems.length === 1 ? 'inmobiliaria' : 'inmobiliarias'}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading && displayedItems.length === 0 ? (
        <Box className="rounded-xl p-12 text-center">
          <Building2 className="w-16 h-16  mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No se encontraron inmobiliarias</h3>
          <p>Intenta ajustar tus filtros o realiza una búsqueda diferente</p>
          <div className="relative my-9">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className=" px-2">O</span>
            </div>
          </div>

          <CreateRealEstateModal
            isOpen={isCreateRealEstateOpen}
            onOpenChange={setIsCreateRealEstateOpen}
            showModal={true}
            name="real_estate_name"
            triggerComponentModal={() => (
              <div className="z-10 mt-1 w-full rounded-md ">
                <div className="p-4 text-center">
                  <Button
                    type="button"
                    onClick={() => setIsCreateRealEstateOpen(true)}
                    variant="outline"
                    size="sm"
                    icon={Plus}
                  >
                    Agregar nueva inmobiliaria
                  </Button>
                </div>
              </div>
            )}
            defaultValues={form.watch()}
          />
        </Box>
      ) : (
        <>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedItems.map((realEstate) => (
              <Box
                key={realEstate.id}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col md:flex-row gap-6 p-6"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{realEstate.name}</h3>
                      <div className="flex items-center gap-3">
                        <StarRatingDisplay
                          rating={
                            realEstate.rating ? Number.parseFloat(realEstate.rating.toString()) : 0
                          }
                        />
                      </div>
                    </div>
                    <Link
                      href={PagesUrls.REAL_ESTATE_VIEW.replace(':id', realEstate.id ?? '')}
                      className="px-5 py-2 rounded-lg  transition-colors whitespace-nowrap"
                    >
                      Ver perfil
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 ">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">
                        {realEstate.review_count || 0}{' '}
                        {realEstate.review_count === 1 ? 'reseña' : 'reseñas'}
                      </span>
                    </div>
                  </div>
                </div>
              </Box>
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
