// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockSignOut = vi.fn();
const mockUseNavBar = vi.fn();

vi.mock('../hooks', () => ({
  useNavBar: mockUseNavBar,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: (props: any) => <div data-testid="dropdown-menu">{props.children}</div>,
  DropdownMenuTrigger: (props: any) => <div>{props.children}</div>,
  DropdownMenuContent: (props: any) => (
    <div onClick={props.onClick} onKeyDown={() => {}} role="button" tabIndex={0}>
      {props.children}
    </div>
  ),
  DropdownMenuItem: (props: any) => <div>{props.children}</div>,
}));

const defaultNavBarState = {
  isAuthenticated: false,
  opacity: 0,
  signOut: mockSignOut,
  sharedStyles: 'flex items-center gap-2 transition-colors',
  isOpen: false,
  setIsOpen: vi.fn(),
};

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavBar.mockReturnValue(defaultNavBarState);
  });

  it('renders logo and navigation links', async () => {
    const { NavBar } = await import('../index');
    render(<NavBar />);

    expect(screen.getAllByText('Explorar').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Inmobiliarias').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tips').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('FAQ').length).toBeGreaterThanOrEqual(1);
  });

  it('shows login option when not authenticated', async () => {
    const { NavBar } = await import('../index');
    render(<NavBar />);

    const menuButton = screen.getByLabelText('Abrir menú principal');
    const user = userEvent.setup();
    await user.click(menuButton);

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('shows profile and logout when authenticated', async () => {
    mockUseNavBar.mockReturnValue({
      ...defaultNavBarState,
      isAuthenticated: true,
    });

    const { NavBar } = await import('../index');
    render(<NavBar />);

    const menuButton = screen.getByLabelText('Abrir menú principal');
    const user = userEvent.setup();
    await user.click(menuButton);

    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  it('renders theme toggle', async () => {
    const { NavBar } = await import('../index');
    render(<NavBar />);

    expect(screen.getByLabelText('Cambiar tema')).toBeInTheDocument();
  });
});
