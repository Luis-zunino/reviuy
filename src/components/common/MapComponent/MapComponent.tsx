'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { icon } from 'leaflet';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Loading } from '../Loading';

const ICON = icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconSize: [24, 24],
});

export const MapComponent: FC<{ lat: number | null; lon: number | null } & PropsWithChildren> = ({
  lat,
  lon,
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (lat != null && lon != null) {
      setPosition([lat, lon]);
    } else {
      setPosition(null);
    }
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, [lat, lon]);

  if (!isMounted || !position) {
    return (
      <div className="h-80 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="h-80 w-full bg-gray-100 rounded-lg overflow-hidden">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker icon={ICON} position={position}>
          <Popup>{children}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
export default MapComponent;
