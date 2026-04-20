'use client';

import { useState, useCallback } from 'react';
import { useGetReviewsByZone } from '@/modules/property-reviews/presentation/getReviewsByZone.hook';
import { useGetReviewsNearby } from '@/modules/property-reviews/presentation/getReviewsNearby.hook';
import { useReverseGeocode } from '@/modules/addresses/presentation/reverseGeocode.hook';
import { useDebounce } from '@/hooks';

type SearchMode = 'idle' | 'zone' | 'nearby';
type GeoStatus = 'idle' | 'loading' | 'success' | 'error';

export const useExploreReviews = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>('idle');
  const [zoneInput, setZoneInput] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [geoError, setGeoError] = useState<string | null>(null);

  const debouncedZone = useDebounce(zoneInput, 500);

  const {
    data: zoneReviews,
    isLoading: isLoadingZone,
    isError: isErrorZone,
  } = useGetReviewsByZone({ query: debouncedZone });

  const {
    data: nearbyReviews,
    isLoading: isLoadingNearby,
    isError: isErrorNearby,
  } = useGetReviewsNearby({
    lat: userCoords?.lat ?? null,
    lon: userCoords?.lon ?? null,
  });

  const { data: reverseGeoData } = useReverseGeocode({
    lat: userCoords?.lat ?? null,
    lon: userCoords?.lon ?? null,
  });

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización.');
      return;
    }
    setGeoStatus('loading');
    setGeoError(null);
    setSearchMode('nearby');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setGeoStatus('success');
      },
      () => {
        setGeoStatus('error');
        setGeoError('No fue posible obtener tu ubicación. Verifica los permisos del navegador.');
        setSearchMode('idle');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleZoneInputChange = useCallback((value: string) => {
    setZoneInput(value);
    if (value.trim().length >= 3) {
      setSearchMode('zone');
    } else {
      setSearchMode('idle');
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setZoneInput('');
    setUserCoords(null);
    setGeoStatus('idle');
    setGeoError(null);
    setSearchMode('idle');
  }, []);

  const activeReviews = searchMode === 'zone' ? (zoneReviews ?? []) : (nearbyReviews ?? []);
  const isLoading =
    (searchMode === 'zone' && isLoadingZone) ||
    (searchMode === 'nearby' && isLoadingNearby) ||
    geoStatus === 'loading';
  const isError =
    (searchMode === 'zone' && isErrorZone) || (searchMode === 'nearby' && isErrorNearby);

  const mapCenter =
    userCoords ??
    (activeReviews.length > 0 && activeReviews[0].latitude && activeReviews[0].longitude
      ? { lat: activeReviews[0].latitude, lon: activeReviews[0].longitude }
      : null);

  const locationLabel =
    searchMode === 'nearby' && reverseGeoData
      ? [reverseGeoData.address?.suburb, reverseGeoData.address?.city].filter(Boolean).join(', ')
      : searchMode === 'zone' && debouncedZone.length >= 3
        ? debouncedZone
        : null;

  return {
    searchMode,
    zoneInput,
    activeReviews,
    isLoading,
    isError,
    geoStatus,
    geoError,
    userCoords,
    mapCenter,
    locationLabel,
    handleDetectLocation,
    handleZoneInputChange,
    handleClearSearch,
  };
};
