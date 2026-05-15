import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './index';

describe('Breadcrumbs', () => {
  it('renders home and current page label', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Reviews', href: '/review' }, { label: 'Detalle de review' }]}
      />
    );

    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Detalle de review')).toBeInTheDocument();
  });

  it('marks the last breadcrumb item as current page', () => {
    render(<Breadcrumbs items={[{ label: 'Explorar' }]} />);

    const current = screen.getByText('Explorar');
    expect(current).toHaveAttribute('aria-current', 'page');
  });
});
