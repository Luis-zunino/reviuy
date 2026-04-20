import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FAQComponent } from './index';

const { useFAQComponentMock, setOpenIdMock } = vi.hoisted(() => ({
  useFAQComponentMock: vi.fn(),
  setOpenIdMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useFAQComponent: useFAQComponentMock,
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
      <div data-testid="faq-sidebar">{sidebar}</div>
      {children}
    </div>
  ),
}));

vi.mock('./components/FAQSidebar', () => ({
  FAQSidebar: () => <div>Sidebar FAQ</div>,
}));

describe('FAQComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFAQComponentMock.mockReturnValue({
      categories: ['all'],
      filteredFAQ: [
        {
          id: 1,
          question: 'Como funciona ReviUy?',
          answer: 'Publicando y leyendo resenas.',
        },
      ],
      selectedCategory: 'all',
      setSelectedCategory: vi.fn(),
      openId: null,
      setOpenId: setOpenIdMock,
      getCategoryLabel: (v: string) => v,
    });
  });

  it('renderiza pregunta y sidebar', () => {
    render(<FAQComponent />);

    expect(screen.getByText('Preguntas precuentes')).toBeInTheDocument();
    expect(screen.getByText('Sidebar FAQ')).toBeInTheDocument();
    expect(screen.getByText('Como funciona ReviUy?')).toBeInTheDocument();
    expect(screen.queryByText('Publicando y leyendo resenas.')).not.toBeInTheDocument();
  });

  it('abre respuesta al hacer click en la pregunta', async () => {
    const user = userEvent.setup();
    render(<FAQComponent />);

    await user.click(screen.getByRole('button', { name: 'Como funciona ReviUy?' }));

    expect(setOpenIdMock).toHaveBeenCalledWith(1);
  });
});
