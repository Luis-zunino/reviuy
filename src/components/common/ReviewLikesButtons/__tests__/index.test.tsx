import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewLikesButtons } from '../index';
import { useReviewLikesButtons } from '../hooks';
import { VoteButtons } from '../../VoteButtons';
import { VoteType } from '@/types';

/**
 * Mocks de las dependencias.
 * Es vital que la ruta en vi.mock coincida con la resolución que hace el componente.
 */
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('../hooks');
vi.mock('../../VoteButtons');

describe('ReviewLikesButtons Component', () => {
  const defaultProps = {
    id: 'test-review-id',
    likes: 10,
    dislikes: 2,
    className: 'test-class',
  };

  const mockHookReturn = {
    addVote: vi.fn(),
    getLikeTooltip: vi.fn(() => 'Ya votaste útil' as const),
    getDislikeTooltip: vi.fn(() => 'Ya votaste no útil' as const),
    userVote: VoteType.NONE,
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Configuramos el retorno del hook
    vi.mocked(useReviewLikesButtons).mockReturnValue(mockHookReturn);

    // Configuramos el mock del componente hijo para que sea un componente válido
    vi.mocked(VoteButtons).mockReturnValue(<div data-testid="mock-vote-buttons" />);
  });

  it('debe inicializar el hook de lógica con el ID de la reseña correcto', () => {
    render(<ReviewLikesButtons {...defaultProps} />);

    // Verificamos que el hook se llamó con el objeto esperado { id: ... }
    expect(useReviewLikesButtons).toHaveBeenCalledWith({ id: defaultProps.id });
  });

  it('debe renderizar el componente VoteButtons con las props integradas (hook + props directas)', () => {
    render(<ReviewLikesButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({
        likes: defaultProps.likes,
        dislikes: defaultProps.dislikes,
        className: defaultProps.className,
        onVote: mockHookReturn.addVote,
        likeTooltip: 'Ya votaste útil',
        dislikeTooltip: 'Ya votaste no útil',
        userVote: VoteType.NONE,
      }),
      undefined
    );
    expect(screen.getByTestId('mock-vote-buttons')).toBeDefined();
  });

  it('debe pasar el estado de voto del usuario correctamente al componente VoteButtons', () => {
    vi.mocked(useReviewLikesButtons).mockReturnValue({
      ...mockHookReturn,
      userVote: VoteType.LIKE,
    });

    render(<ReviewLikesButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({ userVote: VoteType.LIKE }),
      undefined
    );
  });
});
