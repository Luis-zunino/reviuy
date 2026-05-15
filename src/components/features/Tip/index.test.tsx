import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TipComponent } from './index';

const { useTipMock, pageWithSidebarMock } = vi.hoisted(() => ({
  useTipMock: vi.fn(),
  pageWithSidebarMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useTip: useTipMock,
}));

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => {
    pageWithSidebarMock(props);
    return <div>{children}</div>;
  },
}));

describe('TipComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza contenido rich cuando tip existe', () => {
    useTipMock.mockReturnValue({
      tip: {
        title: 'Consejo de seguridad',
        content: [
          [
            { type: 'h2', text: 'Protege tu contrato' },
            { type: 'p', text: 'Lee cada clausula antes de firmar.' },
          ],
        ],
      },
    });

    render(<TipComponent />);

    expect(screen.getByText('Protege tu contrato')).toBeInTheDocument();
    expect(screen.getByText('Lee cada clausula antes de firmar.')).toBeInTheDocument();
    expect(pageWithSidebarMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Consejo de seguridad', isError: false })
    );
  });

  it('marca error cuando no hay tip', () => {
    useTipMock.mockReturnValue({ tip: undefined });

    render(<TipComponent />);

    expect(pageWithSidebarMock).toHaveBeenCalledWith(expect.objectContaining({ isError: true }));
  });
});
