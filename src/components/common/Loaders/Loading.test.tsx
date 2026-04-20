import { render, screen } from '@testing-library/react';
import { Loader } from './Loading';

describe('Loader', () => {
  it('renders default spinner variant with default message', () => {
    render(<Loader />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders inline variant with custom message', () => {
    render(<Loader variant="inline" message="Buscando datos" />);

    expect(screen.getByText('Buscando datos')).toBeInTheDocument();
  });

  it('renders overlay variant', () => {
    render(<Loader variant="overlay" message="Procesando" />);

    expect(screen.getByText('Procesando')).toBeInTheDocument();
  });
});
