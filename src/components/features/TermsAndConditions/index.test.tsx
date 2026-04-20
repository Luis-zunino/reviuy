import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TermsAndConditionsComponent } from './index';

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

describe('TermsAndConditionsComponent', () => {
  it('renderiza titulo y apartados principales', () => {
    render(<TermsAndConditionsComponent />);

    expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
    expect(screen.getByText(/Última actualización:/)).toBeInTheDocument();
    expect(screen.getByText('1. Aceptación')).toBeInTheDocument();
    expect(screen.getByText('5. Ley Aplicable')).toBeInTheDocument();
  });
});
