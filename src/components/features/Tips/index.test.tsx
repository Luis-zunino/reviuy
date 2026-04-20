import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TipsPageComponent } from './index';

const { useTipsComponentMock, tipsSidebarMock } = vi.hoisted(() => ({
  useTipsComponentMock: vi.fn(),
  tipsSidebarMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useTipsComponent: useTipsComponentMock,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/common', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

vi.mock('./components/TipsSidebar', () => ({
  TipsSidebar: (props: unknown) => {
    tipsSidebarMock(props);
    return <div>TipsSidebar</div>;
  },
}));

describe('TipsPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTipsComponentMock.mockReturnValue({
      categories: [{ name: 'all', count: 1 }],
      filteredTips: [
        {
          id: 7,
          category: 'tips',
          readTime: '5 min',
          title: 'Evita estafas comunes',
          excerpt: 'Checklist para verificar anuncios y contratos.',
          date: '2026-04-10',
        },
      ],
      selectedCategory: 'all',
      setSelectedCategory: vi.fn(),
    });
  });

  it('renderiza listado de tips y sidebar', () => {
    render(<TipsPageComponent />);

    expect(screen.getByText('Consejos y guías para alquilar')).toBeInTheDocument();
    expect(screen.getByText('TipsSidebar')).toBeInTheDocument();
    expect(screen.getByText('Evita estafas comunes')).toBeInTheDocument();
    expect(screen.getByText('Checklist para verificar anuncios y contratos.')).toBeInTheDocument();

    expect(screen.getByRole('link')).toHaveAttribute('href', '/tips/7');
    expect(tipsSidebarMock).toHaveBeenCalledTimes(1);
  });
});
