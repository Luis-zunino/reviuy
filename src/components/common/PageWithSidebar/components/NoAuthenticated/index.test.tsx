import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NoAuthenticated } from './index';

const { pushMock, pageWithSidebarMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  pageWithSidebarMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: ReactNode;
  }) => {
    pageWithSidebarMock({ title, description });
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    );
  },
}));

describe('NoAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza contenido de acceso requerido y CTA de login', () => {
    render(<NoAuthenticated />);

    expect(screen.getByText('Acceso requerido')).toBeInTheDocument();
    expect(
      screen.getByText('Debes iniciar sesión para poder acceder a este contenido')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();

    expect(pageWithSidebarMock).toHaveBeenCalledWith({
      title: 'Acceso requerido',
      description: 'Debes iniciar sesión para poder acceder a este contenido',
    });
  });

  it('navega a /login al hacer click en iniciar sesion', async () => {
    const user = userEvent.setup();
    render(<NoAuthenticated />);

    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(pushMock).toHaveBeenCalledWith('/login');
  });
});
