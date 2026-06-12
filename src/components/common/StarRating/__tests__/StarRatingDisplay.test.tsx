// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StarRatingDisplay } from '../StarRatingDisplay';

describe('StarRatingDisplay', () => {
  it('renders rating label', () => {
    render(<StarRatingDisplay rating={4} />);
    expect(screen.getByText('4.0/5')).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    render(<StarRatingDisplay rating={4} showLabel={false} />);
    expect(screen.queryByText('4.0/5')).not.toBeInTheDocument();
  });

  it('clamps rating between 0 and 5', () => {
    render(<StarRatingDisplay rating={6} />);
    expect(screen.getByText('5.0/5')).toBeInTheDocument();
  });

  it('handles negative rating', () => {
    render(<StarRatingDisplay rating={-1} />);
    expect(screen.getByText('0.0/5')).toBeInTheDocument();
  });

  it('sets correct aria-label', () => {
    render(<StarRatingDisplay rating={3.5} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '3.5 de 5 estrellas');
  });

  it('applies custom className', () => {
    const { container } = render(<StarRatingDisplay rating={3} className="custom-class" />);
    expect(container.firstElementChild).toHaveClass('custom-class');
  });
});
