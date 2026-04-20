import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacyPolicyComponent } from './index';

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('PrivacyPolicyComponent', () => {
  it('renderiza titulo, descripcion y secciones clave', () => {
    render(<PrivacyPolicyComponent />);

    expect(screen.getByText('Política de privacidad')).toBeInTheDocument();
    expect(screen.getAllByText(/Última actualización:/).length).toBeGreaterThan(0);
    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
    expect(screen.getByText('1. Información que recolectamos')).toBeInTheDocument();
  });
});
