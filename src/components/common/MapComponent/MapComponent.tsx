'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { icon, LatLngTuple } from 'leaflet';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FC, PropsWithChildren, useMemo } from 'react';
import { Loader } from '../Loaders';

const ICON = icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconSize: [24, 24],
});

export interface MapComponentProps extends PropsWithChildren {
  lat: number | null;
  lon: number | null;
}

export const MapComponent: FC<MapComponentProps> = ({ lat, lon, children }) => {
  const position = useMemo(() => {
    let result: LatLngTuple | undefined = undefined;
    if (lat !== null && lon !== null) {
      result = [lat, lon];
      return result;
    }
    return result;
  }, [lat, lon]);

  if (!position) {
    return (
      <div className="h-80 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <Loader />
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
