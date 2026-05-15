import { render, screen } from '@testing-library/react';
import { MapSkeleton } from './MapSkeleton';

describe('MapSkeleton', () => {
  it('renders loading text and skeleton placeholders', () => {
    const { container } = render(<MapSkeleton />);

    expect(screen.getByText('Cargando mapa...')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(5);
  });
});
