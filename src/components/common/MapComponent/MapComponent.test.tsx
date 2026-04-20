import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const setViewMock = vi.fn();
const getZoomMock = vi.fn(() => 13);

vi.mock('leaflet', () => ({
  icon: vi.fn(() => ({})),
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  useMap: () => ({ setView: setViewMock, getZoom: getZoomMock }),
}));

import { MapComponent } from './MapComponent';

describe('MapComponent', () => {
  it('renders map structure and popup content', () => {
    render(
      <MapComponent lat={-34.9} lon={-56.1}>
        <span>Punto seleccionado</span>
      </MapComponent>
    );

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
    expect(screen.getByText('Punto seleccionado')).toBeInTheDocument();
  });

  it('updates map view when coordinates change', () => {
    const { rerender } = render(
      <MapComponent lat={-34.9} lon={-56.1}>
        <span>Popup</span>
      </MapComponent>
    );

    expect(setViewMock).toHaveBeenCalledWith([-34.9, -56.1], 13, { animate: true });

    rerender(
      <MapComponent lat={-34.88} lon={-56.15}>
        <span>Popup</span>
      </MapComponent>
    );

    expect(setViewMock).toHaveBeenCalledWith([-34.88, -56.15], 13, { animate: true });
  });
});
