'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '../Loading';

export const LazyMapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});
