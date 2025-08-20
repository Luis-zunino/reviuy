'use client';

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loading } from '../Loading';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

export const MapComponent: FC<{ lat: number; lon: number } & PropsWithChildren> = ({
  lat,
  lon,
  children,
}) => {
  const [position, setPosition] = useState<[number, number] | undefined>(undefined);
  useEffect(() => {
    if (!lat || !lon) return;
    setPosition([Number(lat), Number(lon)]);
  }, [lat, lon]);

  return (
    <div>
      {!position ? (
        <Loading message="Cargando mapa..." />
      ) : (
        <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>{children}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};
