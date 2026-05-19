import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StarRatingInput } from '../StarRatingInput';

describe('StarRatingInput', () => {
  it('renders with initial value and label', () => {
    render(<StarRatingInput value={3} onChange={() => {}} />);
    expect(screen.getByText('3/5')).toBeInTheDocument();
  });

  it('shows descriptive label', () => {
    render(<StarRatingInput value={4} onChange={() => {}} />);
    expect(screen.getByText('Bueno')).toBeInTheDocument();
  });

  it('calls onChange when star is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StarRatingInput value={0} onChange={onChange} />);

    const stars = screen.getAllByRole('radio');
    await user.click(stars[2]);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StarRatingInput value={3} onChange={onChange} disabled />);

    const stars = screen.getAllByRole('radio');
    await user.click(stars[0]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows error message when isError is true', () => {
    render(
      <StarRatingInput value={0} onChange={() => {}} isError errorMessage="Campo requerido" />
    );
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  it('renders with correct radiogroup role', () => {
    render(<StarRatingInput value={3} onChange={() => {}} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Calificación');
  });
});
