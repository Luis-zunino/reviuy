import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VoteButton } from '../index';
import { ThumbsUp } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('VoteButton Component', () => {
  const defaultProps = {
    handleOnClick: vi.fn(),
    disabled: false,
    isActive: false,
    icon: ThumbsUp,
    clickedButton: false,
    toolTipMessage: 'Me gusta',
    optimisticVotes: 10,
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<TooltipProvider>{ui}</TooltipProvider>);
  };

  it('debe mostrar el número de votos optimistas', () => {
    renderWithProviders(<VoteButton {...defaultProps} />);
    expect(screen.getByText('10')).toBeDefined();
  });

  it('debe llamar a handleOnClick cuando se hace clic', () => {
    renderWithProviders(<VoteButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.handleOnClick).toHaveBeenCalled();
  });

  it('debe estar deshabilitado si la prop disabled es true', () => {
    renderWithProviders(<VoteButton {...defaultProps} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('debe tener el atributo data-active cuando isActive es true', () => {
    renderWithProviders(<VoteButton {...defaultProps} isActive={true} />);
    expect(screen.getByRole('button').getAttribute('data-active')).toBe('true');
  });

  it('debe aplicar la clase de animación pulse si clickedButton es true', () => {
    const { container } = renderWithProviders(
      <VoteButton {...defaultProps} clickedButton={true} />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('animate-pulse');
  });

  it('debe tener un aria-label descriptivo para accesibilidad', () => {
    renderWithProviders(<VoteButton {...defaultProps} />);
    expect(screen.getByLabelText('Me gusta')).toBeDefined();
  });
});
