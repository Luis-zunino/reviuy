'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '../Loaders';
import { MapComponentProps } from './MapComponent';
import { FC } from 'react';

const MapComponentDynamic = dynamic(
  () => import('./MapComponent').then((mod) => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

export const LazyMapComponent: FC<MapComponentProps> = ({ lat, lon, children, markers }) => {
  // Si no hay coordenadas válidas, mostrar skeleton
  if (lat === null || lon === null) {
    return <MapSkeleton />;
  }

  return (
    <MapComponentDynamic lat={lat} lon={lon} markers={markers}>
      {children}
    </MapComponentDynamic>
  );
};
