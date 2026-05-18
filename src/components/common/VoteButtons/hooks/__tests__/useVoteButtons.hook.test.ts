import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVoteButtons } from '../useVoteButtons.hook';
import { VoteType } from '@/types';

// Habilitamos timers falsos para controlar los setTimeout de las animaciones
vi.useFakeTimers();

describe('useVoteButtons hook', () => {
  const onVoteMock = vi.fn();
  const onErrorMock = vi.fn();

  const defaultProps = {
    likes: 10,
    dislikes: 5,
    userVote: VoteType.NONE,
    onVote: onVoteMock,
    onError: onErrorMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe inicializar con los valores correctos desde las props', () => {
    const { result } = renderHook(() => useVoteButtons(defaultProps));

    expect(result.current.optimisticLikes).toBe(10);
    expect(result.current.optimisticDislikes).toBe(5);
    expect(result.current.optimisticUserVote).toBe(VoteType.NONE);
    expect(result.current.clickedButton).toBeNull();
  });

  it('debe ejecutar la animación y llamar a la Server Action al votar', async () => {
    onVoteMock.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useVoteButtons(defaultProps));

    await act(async () => {
      result.current.handleVote(VoteType.LIKE);
    });

    // La animación debe estar activa inmediatamente
    expect(result.current.clickedButton).toBe(VoteType.LIKE);

    // Se debe haber llamado a la función del servidor
    expect(onVoteMock).toHaveBeenCalledWith(VoteType.LIKE);

    // Adelantamos el reloj para terminar la animación
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.clickedButton).toBeNull();
  });

  it('debe llamar a onError si la acción del servidor falla', async () => {
    const error = new Error('Database Error');
    onVoteMock.mockRejectedValueOnce(error);
    const { result } = renderHook(() => useVoteButtons(defaultProps));

    await act(async () => {
      result.current.handleVote(VoteType.DISLIKE);
    });

    expect(onErrorMock).toHaveBeenCalledWith(error);
  });

  it('no debe hacer nada si el tipo de voto es NONE', async () => {
    const { result } = renderHook(() => useVoteButtons(defaultProps));

    await act(async () => {
      result.current.handleVote(VoteType.NONE);
    });

    expect(onVoteMock).not.toHaveBeenCalled();
    expect(result.current.clickedButton).toBeNull();
  });
});
