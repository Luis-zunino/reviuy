import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../components/NavBar', () => ({
  NavBar: () => <nav data-testid="navbar">NavBar</nav>,
}));

vi.mock('../components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe('MainLayout', () => {
  it('renders navbar, children and footer', async () => {
    const { MainLayout } = await import('../index');
    render(
      <MainLayout>
        <span data-testid="content">Main Content</span>
      </MainLayout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toHaveTextContent('Main Content');
  });

  it('renders skip-to-content link', async () => {
    const { MainLayout } = await import('../index');
    render(
      <MainLayout>
        <span>Content</span>
      </MainLayout>
    );

    const skipLink = screen.getByText('Ir al contenido principal');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
