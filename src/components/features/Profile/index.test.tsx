import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileComponent } from './index';

const { useProfileComponentMock, setActiveTabMock } = vi.hoisted(() => ({
  useProfileComponentMock: vi.fn(),
  setActiveTabMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useProfileComponent: useProfileComponentMock,
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
}));

vi.mock('./components', () => ({
  FavoriteRealEstates: () => <div>FavoriteRealEstates</div>,
  FavoriteReviews: () => <div>FavoriteReviews</div>,
  MyReviews: () => <div>MyReviews</div>,
}));

vi.mock('./components/DeleteAccountSection', () => ({
  DeleteAccountSection: () => <div>DeleteAccountSection</div>,
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <button type="button" onClick={() => setActiveTabMock(value)}>
      {children}
    </button>
  ),
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ProfileComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProfileComponentMock.mockReturnValue({
      reviews: [],
      loadingReviews: false,
      error: null,
      refetch: vi.fn(),
      favorites: [],
      loadingFavorites: false,
      favoriteReviews: [],
      loadingFavoriteReviews: false,
      activeTab: 'reviews',
      setActiveTab: setActiveTabMock,
    });
  });

  it('renderiza secciones principales del perfil', () => {
    render(<ProfileComponent />);

    expect(screen.getByText('Mi perfil')).toBeInTheDocument();
    expect(screen.getByText('Mis reseñas')).toBeInTheDocument();
    expect(screen.getByText('FavoriteRealEstates')).toBeInTheDocument();
    expect(screen.getByText('DeleteAccountSection')).toBeInTheDocument();
  });

  it('delegar cambio de tab cuando se hace click en Favoritas', async () => {
    const user = userEvent.setup();
    render(<ProfileComponent />);

    await user.click(screen.getByRole('button', { name: 'Favoritas' }));

    expect(setActiveTabMock).toHaveBeenCalledWith('favoriteReviews');
  });
});
