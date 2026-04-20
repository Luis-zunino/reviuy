import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewReview } from './index';

const { useViewReviewMock, pageWithSidebarMock } = vi.hoisted(() => ({
  useViewReviewMock: vi.fn(),
  pageWithSidebarMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useViewReview: useViewReviewMock,
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

vi.mock('./components', () => ({
  ReviewSidebar: () => <div>ReviewSidebar</div>,
  ReviewSummary: () => <div>ReviewSummary</div>,
}));

describe('ViewReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza resumen y sidebar cuando hay data', () => {
    useViewReviewMock.mockReturnValue({
      data: {
        id: 'r1',
        address_text: 'Avenida Italia 1234',
        address_osm_id: 'abc',
      },
      isLoading: false,
      error: null,
    });

    render(<ViewReview />);

    expect(screen.getByText('ReviewSidebar')).toBeInTheDocument();
    expect(screen.getByText('ReviewSummary')).toBeInTheDocument();
    expect(pageWithSidebarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isError: false,
        description: 'Avenida Italia 1234',
      })
    );
  });

  it('marca estado de error cuando no hay data', () => {
    useViewReviewMock.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('fail'),
    });

    render(<ViewReview />);

    expect(pageWithSidebarMock).toHaveBeenCalledWith(expect.objectContaining({ isError: true }));
  });
});
