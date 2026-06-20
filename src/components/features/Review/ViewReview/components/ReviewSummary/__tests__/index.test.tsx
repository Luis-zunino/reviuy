// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewSummary } from '../index';

const { useReportReviewButtonMock } = vi.hoisted(() => ({
  useReportReviewButtonMock: vi.fn(),
}));

const mockHookResponse = {
  isOpen: false,
  onOpenChange: vi.fn(),
  onSubmit: vi.fn(),
  selectedReason: '',
  onReasonChange: vi.fn(),
  description: '',
  onDescriptionChange: vi.fn(),
  onCancel: vi.fn(),
  isPending: false,
  reportReasons: [],
  hasReported: false,
  showReportedButton: true,
};

vi.mock('../hooks', () => ({
  useReportReviewButton: useReportReviewButtonMock,
}));

vi.mock('@/components/common', () => ({
  DeleteReviewButton: ({ showText }: { showText?: boolean }) => (
    <div data-testid="delete-review" data-showtext={showText}>
      Delete
    </div>
  ),
  EditReviewButton: ({ showText }: { showText?: boolean }) => (
    <div data-testid="edit-review" data-showtext={showText}>
      Edit
    </div>
  ),
  FavoriteReviewButton: ({ showText }: { showText?: boolean }) => (
    <div data-testid="favorite-review" data-showtext={showText}>
      Favorite
    </div>
  ),
  ReviewLikesButtons: () => <div data-testid="review-likes">Likes</div>,
  StarRatingDisplay: ({ rating }: { rating: number }) => (
    <div data-testid="star-rating">{rating}</div>
  ),
  FeedBackBadge: ({ recommended }: { recommended: boolean }) => (
    <div data-testid="feedback-badge">{recommended ? 'Recomendado' : 'No recomendado'}</div>
  ),
}));

vi.mock('@/components/common/ReportDialog', () => ({
  ReportDialog: ({ title }: { title: string }) => <div data-testid="report-dialog">{title}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: ReactNode }) => <h3>{children}</h3>,
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

vi.mock('@/utils/translateComfort.util', () => ({
  translateComfort: vi.fn(() => 'confort-traducido'),
}));

vi.mock('@/utils/translateHumidity.util', () => ({
  translateHumidity: vi.fn(() => 'humedad-traducida'),
}));

vi.mock('@/utils/translatePropertyType.util', () => ({
  translatePropertyType: vi.fn(() => 'tipo-propiedad'),
}));

vi.mock('@/utils/translateRoomType.util', () => ({
  translateRoomType: vi.fn(() => 'tipo-habitacion'),
}));

const createMockReview = (overrides = {}) => ({
  id: 'review-1',
  title: 'Excelente lugar',
  description: 'Muy recomendable',
  rating: 4.5,
  summer_comfort: 'good',
  winter_comfort: 'average',
  humidity: 'low',
  zone_rating: 4.0,
  property_type: 'apartment',
  review_rooms: [{ id: 'room-1', room_type: 'bedroom', area_m2: 20 }],
  real_estate_experience: 'Buena atención',
  real_estates: { id: 're-1', name: 'Inmobiliaria ABC' },
  likes: 10,
  dislikes: 2,
  ...overrides,
});

describe('ReviewSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useReportReviewButtonMock.mockReturnValue(mockHookResponse);
  });

  it('renderiza título y descripción', () => {
    const review = createMockReview() as any;

    render(<ReviewSummary review={review} />);

    expect(screen.getByText('Excelente lugar')).toBeInTheDocument();
    expect(screen.getByText('Muy recomendable')).toBeInTheDocument();
  });

  it('muestra label Recomendado cuando rating >= 3.5', () => {
    render(<ReviewSummary review={createMockReview({ rating: 4.0 }) as any} />);

    expect(screen.getByText('Recomendado')).toBeInTheDocument();
  });

  it('muestra label No recomendado cuando rating < 3.5', () => {
    render(<ReviewSummary review={createMockReview({ rating: 3.0 }) as any} />);

    expect(screen.getByText('No recomendado')).toBeInTheDocument();
  });

  it('renderiza ReportDialog', () => {
    render(<ReviewSummary review={createMockReview() as any} />);

    expect(screen.getByTestId('report-dialog')).toHaveTextContent('Reportar Reseña');
  });

  it('renderiza accesorios comunes', () => {
    render(<ReviewSummary review={createMockReview() as any} />);

    expect(screen.getByTestId('favorite-review')).toBeInTheDocument();
    expect(screen.getByTestId('edit-review')).toBeInTheDocument();
    expect(screen.getByTestId('delete-review')).toBeInTheDocument();
    expect(screen.getByTestId('review-likes')).toBeInTheDocument();
  });

  it('renderiza información de valoración', () => {
    render(<ReviewSummary review={createMockReview() as any} />);

    expect(screen.getByText('Opinión')).toBeInTheDocument();
    expect(screen.getByText('Valoración')).toBeInTheDocument();
  });

  it('renderiza habitaciones cuando review_rooms tiene datos', () => {
    render(<ReviewSummary review={createMockReview() as any} />);

    expect(screen.getByText('Habitaciones')).toBeInTheDocument();
  });

  it('no renderiza sección habitaciones si está vacía', () => {
    render(<ReviewSummary review={createMockReview({ review_rooms: [] }) as any} />);

    expect(screen.queryByText('Habitaciones')).not.toBeInTheDocument();
  });

  it('renderiza sección de inmobiliaria cuando hay datos', () => {
    render(<ReviewSummary review={createMockReview() as any} />);

    expect(screen.getByText('Inmobiliaria ABC')).toBeInTheDocument();
    expect(screen.getByText('Buena atención')).toBeInTheDocument();
  });

  it('llama a useReportReviewButton con el review', () => {
    const review = createMockReview() as any;

    render(<ReviewSummary review={review} />);

    expect(useReportReviewButtonMock).toHaveBeenCalledWith({ review });
  });
});
