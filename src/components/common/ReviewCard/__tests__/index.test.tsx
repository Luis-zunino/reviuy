// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

vi.mock('@/components/common', () => ({
  StarRatingDisplay: ({ rating }: { rating: number }) => (
    <span data-testid="star-rating">{rating}/5</span>
  ),
  FavoriteReviewButton: () => <button>Fav</button>,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockReview = {
  id: 'review-123',
  title: 'Excelente departamento',
  description: 'Muy buena ubicación y excelente mantenimiento.',
  rating: 5,
  zone_rating: 4,
  address_text: 'Av. 18 de Julio 1234',
  created_at: '2024-01-15',
  address_osm_id: null,
  apartment_number: null,
  dislikes: null,
  humidity: null,
  latitude: null,
  likes: null,
  longitude: null,
  property_type: null,
  real_estate_experience: null,
  real_estate_id: null,
  summer_comfort: null,
  total_votes: null,
  updated_at: null,
  winter_comfort: null,
  is_mine: null,
};

describe('ReviewCard', () => {
  it('renders review title and description', async () => {
    const { ReviewCard } = await import('../index');
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText('Excelente departamento')).toBeInTheDocument();
    expect(screen.getByText('Muy buena ubicación y excelente mantenimiento.')).toBeInTheDocument();
  });

  it('renders address text', async () => {
    const { ReviewCard } = await import('../index');
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText('Av. 18 de Julio 1234')).toBeInTheDocument();
  });

  it('renders star ratings for place and zone', async () => {
    const { ReviewCard } = await import('../index');
    render(<ReviewCard review={mockReview} />);

    const stars = screen.getAllByTestId('star-rating');
    expect(stars).toHaveLength(2);
  });

  it('has link to review details', async () => {
    const { ReviewCard } = await import('../index');
    render(<ReviewCard review={mockReview} />);

    const link = screen.getByText('Ver más');
    expect(link.closest('a')).toHaveAttribute('href', expect.stringContaining('review-123'));
  });
});
