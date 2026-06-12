// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewRealEstateDetailsHeader } from '../index';

const { useReportRealEstateButtonMock, useViewRealEstateDetailsHeaderMock } = vi.hoisted(() => ({
  useReportRealEstateButtonMock: vi.fn(),
  useViewRealEstateDetailsHeaderMock: vi.fn(),
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
  useReportRealEstateButton: useReportRealEstateButtonMock,
  useViewRealEstateDetailsHeader: useViewRealEstateDetailsHeaderMock,
}));

vi.mock('@/components/common', () => ({
  FavoriteRealEstateButton: ({ showText }: { showText?: boolean }) => (
    <div data-testid="favorite-button" data-showtext={showText}>
      Favorite
    </div>
  ),
  RealEstateVoteButtons: () => <div data-testid="vote-buttons">VoteButtons</div>,
  StarRatingDisplay: ({ rating }: { rating: number }) => (
    <div data-testid="star-rating">{rating}</div>
  ),
}));

vi.mock('@/components/common/ReportDialog', () => ({
  ReportDialog: ({ title, showText }: { title: string; showText?: boolean }) => (
    <div data-testid="report-dialog" data-showtext={showText}>
      {title}
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    icon: Icon,
  }: {
    children?: ReactNode;
    onClick?: () => void;
    icon?: React.ComponentType;
  }) => (
    <button type="button" onClick={onClick} data-testid="mock-button">
      {Icon ? <span>icon</span> : null}
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('ViewRealEstateDetailsHeader', () => {
  const defaultHeaderMock = {
    realEstateId: 'estate-123',
    realEstate: { id: 'estate-123', name: 'Inmobiliaria Test', likes: 5, dislikes: 1 },
    hasRealEstateReview: false,
    userRealEstateVote: 0,
    refetchRealEstate: vi.fn(),
    refetchRealEstateVote: vi.fn(),
    isLoading: false,
    isLoadingVote: false,
    handleOnCreateReview: vi.fn(),
  };

  const defaultProps = { averageRating: 4.2, amountReviews: 3 };

  beforeEach(() => {
    vi.clearAllMocks();
    useViewRealEstateDetailsHeaderMock.mockReturnValue(defaultHeaderMock);
    useReportRealEstateButtonMock.mockReturnValue(mockHookResponse);
  });

  it('renderiza nombre de la inmobiliaria y rating', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(screen.getByText('Inmobiliaria Test')).toBeInTheDocument();
    expect(screen.getByText('3 reseñas')).toBeInTheDocument();
    expect(document.querySelector('.text-3xl')).toHaveTextContent('4.2');
  });

  it('renderiza ReportDialog cuando realEstate existe', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(screen.getByTestId('report-dialog')).toHaveTextContent('Reportar Inmobiliaria');
    expect(screen.getByTestId('report-dialog')).toHaveAttribute('data-showtext', 'true');
  });

  it('no renderiza ReportDialog cuando realEstate es null', () => {
    useViewRealEstateDetailsHeaderMock.mockReturnValue({
      ...defaultHeaderMock,
      realEstate: null,
    });

    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(screen.queryByTestId('report-dialog')).not.toBeInTheDocument();
  });

  it('llama a useReportRealEstateButton con los datos correctos', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(useReportRealEstateButtonMock).toHaveBeenCalledWith({
      realEstate: defaultHeaderMock.realEstate,
    });
  });

  it('muestra botón "Crea tu reseña" cuando no hay review', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(screen.getByText('Crea tu reseña')).toBeInTheDocument();
  });

  it('oculta botón "Crea tu reseña" cuando ya hay review', () => {
    useViewRealEstateDetailsHeaderMock.mockReturnValue({
      ...defaultHeaderMock,
      hasRealEstateReview: true,
    });

    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(screen.queryByText('Crea tu reseña')).not.toBeInTheDocument();
  });

  it('renderiza FavoriteRealEstateButton y RealEstateVoteButtons', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
    expect(screen.getByTestId('vote-buttons')).toBeInTheDocument();
  });

  it('usa amountReviews 1 para mostrar "reseña" en singular', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} amountReviews={1} />);

    expect(screen.getByText('1 reseña')).toBeInTheDocument();
  });

  it('llama a useViewRealEstateDetailsHeader al renderizar', () => {
    render(<ViewRealEstateDetailsHeader {...defaultProps} />);

    expect(useViewRealEstateDetailsHeaderMock).toHaveBeenCalledOnce();
  });
});
