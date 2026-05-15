import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ListRealEstates } from './index';

const { useListRealEstateMock, loadMoreMock } = vi.hoisted(() => ({
  useListRealEstateMock: vi.fn(),
  loadMoreMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useListRealEstate: useListRealEstateMock,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({
    children,
    sidebar,
  }: {
    children: React.ReactNode;
    sidebar: React.ReactNode;
  }) => (
    <div>
      <div>{sidebar}</div>
      {children}
    </div>
  ),
  Loader: () => <div>Loader</div>,
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StarRatingDisplay: ({ rating }: { rating: number }) => <div>Rating-{rating}</div>,
}));

vi.mock('./components', () => ({
  RealEstateSidebar: () => <div>RealEstateSidebar</div>,
}));

vi.mock('../CreateRealEstate', () => ({
  CreateRealEstateModal: () => <div>CreateRealEstateModal</div>,
}));

const baseState = {
  isLoading: false,
  displayedItems: [],
  handleClearFilters: vi.fn(),
  isFetchingNextPage: false,
  loadMore: loadMoreMock,
  hasNextPage: false,
  form: { watch: vi.fn(() => ({})) },
  isCreateRealEstateOpen: false,
  setIsCreateRealEstateOpen: vi.fn(),
};

describe('ListRealEstates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useListRealEstateMock.mockReturnValue(baseState);
  });

  it('renderiza empty state cuando no hay inmobiliarias', () => {
    render(<ListRealEstates />);

    expect(screen.getByText('Mostrando 0 inmobiliarias')).toBeInTheDocument();
    expect(screen.getByText('No se encontraron inmobiliarias')).toBeInTheDocument();
    expect(screen.getByText('CreateRealEstateModal')).toBeInTheDocument();
  });

  it('renderiza listado y permite cargar mas', async () => {
    const user = userEvent.setup();
    useListRealEstateMock.mockReturnValue({
      ...baseState,
      displayedItems: [
        { id: 're-1', name: 'Inmobiliaria Uno', rating: 4.2, review_count: 5 },
        { id: 're-2', name: 'Inmobiliaria Dos', rating: 3.8, review_count: 1 },
      ],
      hasNextPage: true,
    });

    render(<ListRealEstates />);

    expect(screen.getByText('Mostrando 2 inmobiliarias')).toBeInTheDocument();
    expect(screen.getByText('Inmobiliaria Uno')).toBeInTheDocument();
    expect(screen.getByText('Inmobiliaria Dos')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Ver perfil' })[0]).toHaveAttribute(
      'href',
      '/real-estate/re-1'
    );

    await user.click(screen.getByRole('button', { name: 'Cargar más' }));
    expect(loadMoreMock).toHaveBeenCalledTimes(1);
  });
});
