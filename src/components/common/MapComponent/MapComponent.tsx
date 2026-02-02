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

/**
 * Propiedades del componente MapComponent
 * @interface MapComponentProps
 * @extends {PropsWithChildren}
 */
export interface MapComponentProps extends PropsWithChildren {
  /** Latitud del punto a mostrar en el mapa */
  lat: number | null;
  /** Longitud del punto a mostrar en el mapa */
  lon: number | null;
}

/**
 * Componente de mapa interactivo utilizando Leaflet.
 *
 * Muestra un mapa con un marcador en las coordenadas especificadas.
 * Utiliza OpenStreetMap como proveedor de tiles.
 *
 * @component
 * @example
 * ```tsx
 * <MapComponent lat={-34.6037} lon={-58.3816}>
 *   <div>Buenos Aires, Argentina</div>
 * </MapComponent>
 * ```
 *
 * @param {MapComponentProps} props - Propiedades del componente
 * @param {number | null} props.lat - Latitud del marcador (0 si es null)
 * @param {number | null} props.lon - Longitud del marcador (0 si es null)
 * @param {React.ReactNode} [props.children] - Contenido del popup del marcador
 *
 * @returns {JSX.Element} Mapa renderizado con marcador
 *
 * @requires leaflet - Biblioteca de mapas
 * @requires react-leaflet - Bindings de React para Leaflet
 *
 * @see {@link https://react-leaflet.js.org/ | React Leaflet Documentation}
 */
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
