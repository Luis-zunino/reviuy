import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealEstateVoteButtons } from '../index';
import { useRealEstateVoteButtons } from '../hooks';
import { VoteButtons } from '../../VoteButtons';
import { VoteType } from '@/types/vote-type';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates', () => ({
  createGetAllRealEstateReviewsQuery: vi.fn(),
  SupabaseRealEstateReadRepository: vi.fn(),
}));
vi.mock('@/modules/real-estates/presentation', () => ({
  useVoteRealEstate: vi.fn(),
  useGetUserRealEstateVote: vi.fn(),
}));
vi.mock('../hooks');
vi.mock('../../VoteButtons');

describe('RealEstateVoteButtons Component', () => {
  const defaultProps = {
    realEstateId: 'test-real-estate-id',
    likes: 20,
    dislikes: 5,
    userVote: VoteType.NONE,
    className: 'test-class',
    refetchRealEstate: vi.fn(),
    isLoading: false,
  };

  const mockHookReturn = {
    handleVote: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRealEstateVoteButtons).mockReturnValue(mockHookReturn);
    vi.mocked(VoteButtons).mockReturnValue(<div data-testid="mock-vote-buttons" />);
  });

  it('debe inicializar el hook con realEstateId y refetchRealEstate correctos', () => {
    render(<RealEstateVoteButtons {...defaultProps} />);

    expect(useRealEstateVoteButtons).toHaveBeenCalledWith({
      realEstateId: defaultProps.realEstateId,
      refetchRealEstate: defaultProps.refetchRealEstate,
    });
  });

  it('debe renderizar VoteButtons con las props integradas', () => {
    render(<RealEstateVoteButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({
        likes: defaultProps.likes,
        dislikes: defaultProps.dislikes,
        userVote: VoteType.NONE,
        onVote: mockHookReturn.handleVote,
        disabled: false,
        className: defaultProps.className,
        likeTooltip: 'Recomendar esta inmobiliaria',
        likeTooltipActive: 'Ya recomendaste esta inmobiliaria',
        dislikeTooltip: 'No recomendar esta inmobiliaria',
        dislikeTooltipActive: 'Ya marcaste que no la recomiendas',
      }),
      undefined
    );
    expect(screen.getByTestId('mock-vote-buttons')).toBeDefined();
  });

  it('debe pasar disabled=true cuando isLoading es true', () => {
    render(<RealEstateVoteButtons {...defaultProps} isLoading={true} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
      undefined
    );
  });

  it('debe pasar disabled=true cuando isPending es true', () => {
    vi.mocked(useRealEstateVoteButtons).mockReturnValue({
      ...mockHookReturn,
      isPending: true,
    });

    render(<RealEstateVoteButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
      undefined
    );
  });

  it('debe pasar el userVote correcto al componente VoteButtons', () => {
    render(<RealEstateVoteButtons {...defaultProps} userVote={VoteType.DISLIKE} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({ userVote: VoteType.DISLIKE }),
      undefined
    );
  });
});
