import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { icon } from 'leaflet';

import { FC, PropsWithChildren, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
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
  /** Marcadores opcionales para mostrar múltiples ubicaciones */
  markers?: MapMarker[];
}

export interface MapMarker {
  id: string;
  lat: number;
  lon: number;
  popupContent?: React.ReactNode;
}

const MapViewUpdater: FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);

  return null;
};

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
export const MapComponent: FC<MapComponentProps> = ({ lat, lon, children, markers }) => {
  const safeLat = lat ?? 0;
  const safeLon = lon ?? 0;
  const markersToRender: MapMarker[] =
    markers && markers.length > 0
      ? markers
      : [{ id: 'default-marker', lat: safeLat, lon: safeLon, popupContent: children }];

  return (
    <div className="h-80 w-full bg-gray-100 rounded-lg overflow-hidden">
      <MapContainer center={[safeLat, safeLon]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <MapViewUpdater lat={safeLat} lon={safeLon} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markersToRender.map((marker) => (
          <Marker key={marker.id} icon={ICON} position={[marker.lat, marker.lon]}>
            {marker.popupContent ? <Popup>{marker.popupContent}</Popup> : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default MapComponent;
