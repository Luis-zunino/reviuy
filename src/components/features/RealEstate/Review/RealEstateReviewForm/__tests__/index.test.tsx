// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RealEstateReviewForm } from '../index';

const { useReportRealEstateReviewButtonMock } = vi.hoisted(() => ({
  useReportRealEstateReviewButtonMock: vi.fn(),
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
  useReportRealEstateReviewButton: useReportRealEstateReviewButtonMock,
}));

vi.mock('../components/RealEstateReviewFormContent', () => ({
  RealEstateReviewFormContent: ({ isReadOnly }: { isReadOnly?: boolean }) => (
    <div data-testid="form-content" data-readonly={isReadOnly}>
      FormContent
    </div>
  ),
}));

vi.mock('@/components/common', () => ({
  DeleteRealEstateReviewButton: ({ showText }: { showText?: boolean }) => (
    <div data-testid="delete-button" data-showtext={showText}>
      Delete
    </div>
  ),
  RealEstateReviewVoteButtons: () => <div data-testid="vote-buttons">VoteButtons</div>,
  PageWithSidebar: ({
    children,
    title,
    description,
  }: {
    children: ReactNode;
    title: string;
    description: string;
  }) => (
    <div data-testid="page-sidebar">
      <h1 data-testid="sidebar-title">{title}</h1>
      <p data-testid="sidebar-description">{description}</p>
      {children}
    </div>
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
    type,
    disabled,
    icon: Icon,
  }: {
    children?: ReactNode;
    type?: string;
    disabled?: boolean;
    icon?: React.ComponentType;
  }) => (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled}
      data-testid="mock-button"
    >
      {Icon ? <span>icon</span> : null}
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: ReactNode }) => <div data-testid="form">{children}</div>,
}));

const createFormMock = () => ({
  handleSubmit: vi.fn((handler: any) => (e?: any) => {
    e?.preventDefault?.();
    return handler({});
  }),
  control: {} as any,
  formState: { errors: {} },
  register: vi.fn(),
  getValues: vi.fn(),
  setValue: vi.fn(),
  reset: vi.fn(),
  watch: vi.fn(),
});

describe('RealEstateReviewForm', () => {
  const defaultProps = {
    form: createFormMock() as any,
    handleSubmit: vi.fn(),
    isSubmitting: false,
    title: 'Review Title',
    subtitle: 'Review Subtitle',
    isLoading: false,
    error: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useReportRealEstateReviewButtonMock.mockReturnValue(mockHookResponse);
  });

  it('renderiza loading state con skeleton', () => {
    render(<RealEstateReviewForm {...defaultProps} isLoading />);

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByTestId('form')).not.toBeInTheDocument();
  });

  it('renderiza error state con PageWithSidebar', () => {
    render(<RealEstateReviewForm {...defaultProps} error />);

    const titles = screen.getAllByTestId('sidebar-title');
    const sidebarTitles = titles.filter((t) => t.textContent === 'Review Title');
    expect(sidebarTitles.length).toBeGreaterThan(0);
  });

  it('renderiza formulario en modo edición', () => {
    render(<RealEstateReviewForm {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('form-content')).toBeInTheDocument();
    expect(screen.getByText('Publicar reseña')).toBeInTheDocument();
  });

  it('muestra ReportDialog cuando isReadOnly es true', () => {
    render(
      <RealEstateReviewForm
        {...defaultProps}
        isReadOnly
        review={{ id: 'review-1', likes: 3, dislikes: 1 } as any}
      />
    );

    expect(screen.getByTestId('report-dialog')).toHaveTextContent('Reportar reseña');
    expect(screen.getByTestId('report-dialog')).toHaveAttribute('data-showtext', 'true');
  });

  it('oculta ReportDialog cuando isReadOnly es false', () => {
    render(<RealEstateReviewForm {...defaultProps} isReadOnly={false} />);

    expect(screen.queryByTestId('report-dialog')).not.toBeInTheDocument();
  });

  it('no renderiza DeleteRealEstateReviewButton si no hay review', () => {
    render(<RealEstateReviewForm {...defaultProps} isReadOnly />);

    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  it('renderiza DeleteRealEstateReviewButton cuando hay review', () => {
    render(
      <RealEstateReviewForm {...defaultProps} isReadOnly review={{ id: 'review-1' } as any} />
    );

    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('oculta botón Publicar reseña cuando isReadOnly es true', () => {
    render(
      <RealEstateReviewForm {...defaultProps} isReadOnly review={{ id: 'review-1' } as any} />
    );

    expect(screen.queryByText('Publicar reseña')).not.toBeInTheDocument();
    expect(screen.queryByText('Guardando...')).not.toBeInTheDocument();
  });

  it('muestra "Guardando..." cuando isSubmitting es true', () => {
    render(<RealEstateReviewForm {...defaultProps} isSubmitting />);

    expect(screen.getByText('Guardando...')).toBeInTheDocument();
  });

  it('llama a useReportRealEstateReviewButton con el review', () => {
    const review = { id: 'review-1' } as any;

    render(<RealEstateReviewForm {...defaultProps} isReadOnly review={review} />);

    expect(useReportRealEstateReviewButtonMock).toHaveBeenCalledWith({ review });
  });
});
