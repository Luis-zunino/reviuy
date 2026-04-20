import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExploreReviews } from './index';

const { useExploreReviewsMock, exploreReviewCardMock } = vi.hoisted(() => ({
  useExploreReviewsMock: vi.fn(),
  exploreReviewCardMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useExploreReviews: useExploreReviewsMock,
}));

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({
    title,
    description,
    sidebar,
    children,
  }: {
    title: string;
    description: string;
    sidebar: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{sidebar}</div>
      {children}
    </div>
  ),
  LazyMapComponent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/common/Loaders', () => ({
  Loader: () => <div>Loader</div>,
}));

vi.mock('./components', () => ({
  ZoneSearchPanel: () => <div>ZoneSearchPanel</div>,
  ExploreReviewCard: ({ review }: { review: { id: string } }) => {
    exploreReviewCardMock(review);
    return <div>ExploreReviewCard-{review.id}</div>;
  },
}));

const baseHookState = {
  searchMode: 'idle',
  zoneInput: '',
  activeReviews: [],
  isLoading: false,
  isError: false,
  geoStatus: 'idle',
  geoError: null,
  mapCenter: null,
  locationLabel: null,
  handleDetectLocation: vi.fn(),
  handleZoneInputChange: vi.fn(),
  handleClearSearch: vi.fn(),
};

describe('ExploreReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useExploreReviewsMock.mockReturnValue(baseHookState);
  });

  it('renderiza estado idle', () => {
    render(<ExploreReviews />);

    expect(screen.getByText('Explorar reseñas')).toBeInTheDocument();
    expect(screen.getByText('ZoneSearchPanel')).toBeInTheDocument();
    expect(screen.getByText('Explora reseñas por zona')).toBeInTheDocument();
  });

  it('renderiza estado loading con mensaje de geolocalizacion', () => {
    useExploreReviewsMock.mockReturnValue({
      ...baseHookState,
      isLoading: true,
      geoStatus: 'loading',
    });

    render(<ExploreReviews />);

    expect(screen.getByText('Loader')).toBeInTheDocument();
    expect(screen.getByText('Obteniendo tu ubicación...')).toBeInTheDocument();
  });

  it('renderiza resultados y cards cuando hay reseñas', () => {
    useExploreReviewsMock.mockReturnValue({
      ...baseHookState,
      searchMode: 'zone',
      locationLabel: 'Cordón',
      mapCenter: { lat: -34.9, lon: -56.18 },
      activeReviews: [
        {
          id: 'r1',
          latitude: -34.9,
          longitude: -56.18,
          address_text: 'Direccion A',
          address_osm_id: 'a1',
        },
        {
          id: 'r2',
          latitude: -34.91,
          longitude: -56.17,
          address_text: 'Direccion B',
          address_osm_id: 'a2',
        },
      ],
    });

    render(<ExploreReviews />);

    expect(screen.getByText('2 reseñas encontradas')).toBeInTheDocument();
    expect(screen.getByText('ExploreReviewCard-r1')).toBeInTheDocument();
    expect(screen.getByText('ExploreReviewCard-r2')).toBeInTheDocument();
    expect(exploreReviewCardMock).toHaveBeenCalledTimes(2);
  });
});
