import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Footer', () => {
  it('renders company info and heading', async () => {
    const { Footer } = await import('../index');
    render(<Footer />);

    expect(screen.getAllByText('ReviUy')).toHaveLength(2);
    expect(screen.getByText('Encontrá tu lugar ideal con reseñas reales')).toBeInTheDocument();
  });

  it('renders social media links', async () => {
    const { Footer } = await import('../index');
    render(<Footer />);

    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
  });

  it('renders navigation links', async () => {
    const { Footer } = await import('../index');
    render(<Footer />);

    expect(screen.getByText('Sobre nosotros')).toBeInTheDocument();
    expect(screen.getByText('Contáctanos')).toBeInTheDocument();
    expect(screen.getByText('Política de privacidad')).toBeInTheDocument();
    expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
    expect(screen.getByText('Buenas prácticas')).toBeInTheDocument();
  });
});
