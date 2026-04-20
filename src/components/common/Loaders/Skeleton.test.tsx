import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders with default skeleton classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstElementChild;

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom classes', () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveClass('h-10');
    expect(skeleton).toHaveClass('w-10');
  });
});
