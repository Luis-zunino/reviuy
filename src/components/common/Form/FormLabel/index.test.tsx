import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormLabel } from './index';

describe('FormLabel', () => {
  it('renderiza el texto del label', () => {
    render(<FormLabel label="Nombre" />);

    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('muestra asterisco cuando es requerido', () => {
    render(<FormLabel label="Email" isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('asocia htmlFor correctamente', () => {
    render(<FormLabel label="Telefono" htmlFor="phone" />);

    expect(screen.getByText('Telefono')).toHaveAttribute('for', 'phone');
  });
});
