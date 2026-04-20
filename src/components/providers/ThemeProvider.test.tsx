import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './ThemeProvider';

const { nextThemesProviderMock } = vi.hoisted(() => ({
  nextThemesProviderMock: vi.fn(),
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => {
    nextThemesProviderMock(props);
    return <div data-testid="next-themes-provider">{children}</div>;
  },
}));

describe('ThemeProvider', () => {
  it('renderiza children y propaga props al provider de next-themes', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Contenido tema</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
    expect(screen.getByText('Contenido tema')).toBeInTheDocument();
    expect(nextThemesProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'class',
        defaultTheme: 'system',
        enableSystem: true,
      })
    );
  });
});
