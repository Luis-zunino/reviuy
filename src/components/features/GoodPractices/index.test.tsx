import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GoodPracticesComponent } from './index';

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

describe('GoodPracticesComponent', () => {
  it('renderiza layout y contenido principal', () => {
    render(<GoodPracticesComponent />);

    expect(screen.getByText('Buenas prácticas')).toBeInTheDocument();
    expect(screen.getByText('Breve resumen')).toBeInTheDocument();
    expect(screen.getByText('Moderación de contenido')).toBeInTheDocument();
  });
});
