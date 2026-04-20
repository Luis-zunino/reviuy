import { render, screen } from '@testing-library/react';
import { PageWithSidebar } from './index';

const useAuthContextMock = vi.fn();

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuthContext: () => useAuthContextMock(),
}));

vi.mock('./components', () => ({
  ErrorPage: ({ title, subTitle }: { title: string; subTitle: string }) => (
    <div>
      <span>{title}</span>
      <span>{subTitle}</span>
    </div>
  ),
  NoAuthenticated: () => <div>NoAuthenticated</div>,
}));

describe('PageWithSidebar', () => {
  beforeEach(() => {
    useAuthContextMock.mockReturnValue({ isAuthenticated: true });
  });

  it('renders loading state', () => {
    render(
      <PageWithSidebar title="Titulo" description="Descripcion" isLoading>
        <div>Contenido</div>
      </PageWithSidebar>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders authentication gate when required and user is not authenticated', () => {
    useAuthContextMock.mockReturnValue({ isAuthenticated: false });

    render(
      <PageWithSidebar title="Titulo" description="Descripcion" authIsRequired>
        <div>Contenido</div>
      </PageWithSidebar>
    );

    expect(screen.getByText('NoAuthenticated')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <PageWithSidebar
        title="Titulo"
        description="Descripcion"
        isError
        errorTitle="Oops"
        errorSubTitle="Algo salió mal"
      >
        <div>Contenido</div>
      </PageWithSidebar>
    );

    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('renders title, description, sidebar and content in default state', () => {
    render(
      <PageWithSidebar title="Explorar" description="Descubre zonas" sidebar={<div>Sidebar</div>}>
        <div>Contenido principal</div>
      </PageWithSidebar>
    );

    expect(screen.getByRole('heading', { name: 'Explorar' })).toBeInTheDocument();
    expect(screen.getByText('Descubre zonas')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Contenido principal')).toBeInTheDocument();
  });
});
