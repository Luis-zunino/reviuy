import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoteButtons } from '../VoteButtons';
import { useVoteButtons } from '../hooks';
import { VoteType } from '@/types/vote-type';

vi.mock('../hooks', () => ({
  useVoteButtons: vi.fn(),
}));

describe('VoteButtons Component', () => {
  const onVoteMock = vi.fn();

  const mockHookReturn = {
    handleVote: vi.fn(),
    clickedButton: null,
    optimisticLikes: 10,
    optimisticDislikes: 5,
    optimisticUserVote: VoteType.NONE,
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVoteButtons).mockReturnValue(mockHookReturn);
  });

  it('debe renderizar los contadores de likes y dislikes correctamente', () => {
    render(<VoteButtons likes={10} dislikes={5} userVote={VoteType.NONE} onVote={onVoteMock} />);

    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });

  it('debe mostrar la etiqueta opcional si se proporciona', () => {
    render(
      <VoteButtons
        likes={10}
        dislikes={5}
        userVote={VoteType.NONE}
        onVote={onVoteMock}
        label="¿Fue útil?"
      />
    );
    expect(screen.getByText('¿Fue útil?')).toBeDefined();
  });

  it('debe invocar handleVote con LIKE al pulsar el primer botón', () => {
    render(<VoteButtons likes={10} dislikes={5} userVote={VoteType.NONE} onVote={onVoteMock} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockHookReturn.handleVote).toHaveBeenCalledWith(VoteType.LIKE);
  });

  it('debe invocar handleVote con DISLIKE al pulsar el segundo botón', () => {
    render(<VoteButtons likes={10} dislikes={5} userVote={VoteType.NONE} onVote={onVoteMock} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);

    expect(mockHookReturn.handleVote).toHaveBeenCalledWith(VoteType.DISLIKE);
  });
});
