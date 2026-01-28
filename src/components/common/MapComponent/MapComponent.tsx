import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { icon } from 'leaflet';

import { FC, PropsWithChildren } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
const ICON = icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconSize: [24, 24],
});

export interface MapComponentProps extends PropsWithChildren {
  lat: number | null;
  lon: number | null;
}

export const MapComponent: FC<MapComponentProps> = ({ lat, lon, children }) => {
  return (
    <div className="h-80 w-full bg-gray-100 rounded-lg overflow-hidden">
      <MapContainer
        center={[lat ?? 0, lon ?? 0]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker icon={ICON} position={[lat ?? 0, lon ?? 0]}>
          <Popup>{children}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
export default MapComponent;
