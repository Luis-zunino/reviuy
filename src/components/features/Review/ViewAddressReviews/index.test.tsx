import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewAddressReviews } from './index';

const { useViewAddressReviewsMock, handleCreateReviewMock } = vi.hoisted(() => ({
  useViewAddressReviewsMock: vi.fn(),
  handleCreateReviewMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useViewAddressReviews: useViewAddressReviewsMock,
}));

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StarRatingDisplay: ({ rating }: { rating: number }) => <div>StarRating-{rating}</div>,
  LazyMapComponent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('./components/AddressReviewCard', () => ({
  AddressReviewCard: ({ review }: { review: { id: string } }) => (
    <div>AddressReviewCard-{review.id}</div>
  ),
}));

describe('ViewAddressReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useViewAddressReviewsMock.mockReturnValue({
      data: {
        osm_id: 1,
        lat: '-34.9',
        lon: '-56.1',
        address: {
          road: 'Avenida Italia',
          house_number: '1234',
          city: 'Montevideo',
          suburb: 'Parque Batlle',
          postcode: '11200',
        },
      },
      reviews: [{ id: 'a' }, { id: 'b' }],
      isLoading: false,
      isError: false,
      handleCreateReview: handleCreateReviewMock,
      averageRating: 4.5,
    });
  });

  it('renderiza direccion, rating y lista de reseñas', () => {
    render(<ViewAddressReviews />);

    expect(screen.getByRole('heading', { name: /Avenida Italia/i })).toBeInTheDocument();
    expect(screen.getByText('StarRating-4.5')).toBeInTheDocument();
    expect(screen.getByText('AddressReviewCard-a')).toBeInTheDocument();
    expect(screen.getByText('AddressReviewCard-b')).toBeInTheDocument();
    expect(screen.getByText('Últimas opiniones')).toBeInTheDocument();
  });

  it('ejecuta handleCreateReview al hacer click en Crear reseña', async () => {
    const user = userEvent.setup();
    render(<ViewAddressReviews />);

    await user.click(screen.getByRole('button', { name: /crear reseña/i }));

    expect(handleCreateReviewMock).toHaveBeenCalledTimes(1);
  });
});
