import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorPage } from './index';

describe('ErrorPage', () => {
  it('renderiza titulo y subtitulo', () => {
    render(<ErrorPage title="Oops" subTitle="Algo salio mal" />);

    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByText('Algo salio mal')).toBeInTheDocument();
  });

  it('ejecuta window.history.back al hacer click en volver atras', async () => {
    const user = userEvent.setup();
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);

    render(<ErrorPage title="Oops" />);

    await user.click(screen.getByRole('button', { name: /volver atrás/i }));

    expect(backSpy).toHaveBeenCalledTimes(1);

    backSpy.mockRestore();
  });
});
