'use client';

import { useMemo } from 'react';
import { PageWithSidebar, LazyMapComponent } from '@/components/common';
import { Loader } from '@/components/common/Loaders';
import { useExploreReviews } from './hooks';
import { ExploreReviewCard, ZoneSearchPanel } from './components';
import { MapPin, Search } from 'lucide-react';

export const ExploreReviews = () => {
  const {
    searchMode,
    zoneInput,
    activeReviews,
    isLoading,
    isError,
    geoStatus,
    geoError,
    mapCenter,
    locationLabel,
    handleDetectLocation,
    handleZoneInputChange,
    handleClearSearch,
  } = useExploreReviews();

  const sidebar = (
    <ZoneSearchPanel
      zoneInput={zoneInput}
      geoStatus={geoStatus}
      geoError={geoError}
      locationLabel={locationLabel}
      onZoneInputChange={handleZoneInputChange}
      onDetectLocation={handleDetectLocation}
      onClearSearch={handleClearSearch}
    />
  );

  const resultsTitle =
    searchMode === 'idle'
      ? null
      : activeReviews.length > 0
        ? `${activeReviews.length} ${activeReviews.length === 1 ? 'reseña encontrada' : 'reseñas encontradas'}`
        : 'Sin reseñas en esta zona';

  const markers = useMemo(() => {
    const groupedByAddress = new Map<
      string,
      { lat: number; lon: number; label: string; reviewsCount: number }
    >();

    for (const review of activeReviews) {
      if (review.latitude === null || review.longitude === null) {
        continue;
      }

      const addressLabel = review.address_text?.trim() || 'Dirección sin nombre';
      const key = review.address_osm_id ?? addressLabel;
      const current = groupedByAddress.get(key);

      if (current) {
        current.reviewsCount += 1;
        continue;
      }

      groupedByAddress.set(key, {
        lat: review.latitude,
        lon: review.longitude,
        label: addressLabel,
        reviewsCount: 1,
      });
    }

    return Array.from(groupedByAddress.entries()).map(([key, data]) => ({
      id: key,
      lat: data.lat,
      lon: data.lon,
      popupContent:
        data.reviewsCount > 1
          ? `${data.label} (${data.reviewsCount} reseñas)`
          : `${data.label} (1 reseña)`,
    }));
  }, [activeReviews]);

  return (
    <PageWithSidebar
      title="Explorar reseñas"
      description="Encuentra reseñas de propiedades según tu ubicación o busca por zona."
      sidebar={sidebar}
      isLoading={false}
      isError={isError}
      errorTitle="Ocurrió un error al buscar reseñas."
      errorSubTitle="Por favor, inténtalo de nuevo."
    >
      {/* Mapa */}
      {mapCenter && (
        <div className="h-72 w-full mb-8 rounded-lg overflow-hidden border border-border">
          <LazyMapComponent lat={mapCenter.lat} lon={mapCenter.lon} markers={markers}>
            {locationLabel ?? 'Zona seleccionada'}
          </LazyMapComponent>
        </div>
      )}

      {/* Estado: cargando */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader />
          <p className="text-sm text-muted-foreground">
            {geoStatus === 'loading' ? 'Obteniendo tu ubicación...' : 'Buscando reseñas...'}
          </p>
        </div>
      )}

      {/* Estado: idle — sin búsqueda activa */}
      {!isLoading && searchMode === 'idle' && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Explora reseñas por zona</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Usa tu ubicación actual o escribe un barrio para ver las reseñas de esa zona.
            </p>
          </div>
        </div>
      )}

      {/* Estado: con resultados */}
      {!isLoading && searchMode !== 'idle' && (
        <>
          {resultsTitle && (
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              <h2 className="text-base font-semibold text-foreground">{resultsTitle}</h2>
              {locationLabel && (
                <span className="text-sm text-muted-foreground">&mdash; {locationLabel}</span>
              )}
            </div>
          )}

          {activeReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeReviews.map((review) => (
                <ExploreReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Sin reseñas en esta zona</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Aún no hay reseñas registradas aquí. ¡Sé el primero en compartir tu experiencia!
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </PageWithSidebar>
  );
};
