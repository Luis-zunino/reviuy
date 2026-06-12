// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealEstateReviewVoteButtons } from '../index';
import { useRealEstateReviewVoteButtons } from '../hooks';
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
  useVoteRealEstateReview: vi.fn(),
  useGetUserRealEstateReviewVote: vi.fn(),
}));
vi.mock('../hooks');
vi.mock('../../VoteButtons');

describe('RealEstateReviewVoteButtons Component', () => {
  const defaultProps = {
    reviewId: 'test-review-id',
    likes: 15,
    dislikes: 3,
    className: 'test-class',
    refetchRealEstateReview: vi.fn(),
  };

  const mockHookReturn = {
    handleVote: vi.fn(),
    isPending: false,
    userVote: VoteType.NONE,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRealEstateReviewVoteButtons).mockReturnValue(mockHookReturn);
    vi.mocked(VoteButtons).mockReturnValue(<div data-testid="mock-vote-buttons" />);
  });

  it('debe inicializar el hook con el reviewId y refetchRealEstateReview correctos', () => {
    render(<RealEstateReviewVoteButtons {...defaultProps} />);

    expect(useRealEstateReviewVoteButtons).toHaveBeenCalledWith({
      reviewId: defaultProps.reviewId,
      refetchRealEstateReview: defaultProps.refetchRealEstateReview,
    });
  });

  it('debe renderizar VoteButtons con las props integradas', () => {
    render(<RealEstateReviewVoteButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({
        likes: defaultProps.likes,
        dislikes: defaultProps.dislikes,
        className: defaultProps.className,
        onVote: mockHookReturn.handleVote,
        disabled: false,
        userVote: VoteType.NONE,
      }),
      undefined
    );
    expect(screen.getByTestId('mock-vote-buttons')).toBeDefined();
  });

  it('debe pasar disabled=true cuando isPending es true', () => {
    vi.mocked(useRealEstateReviewVoteButtons).mockReturnValue({
      ...mockHookReturn,
      isPending: true,
    });

    render(<RealEstateReviewVoteButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
      undefined
    );
  });

  it('debe pasar el userVote correcto al componente VoteButtons', () => {
    vi.mocked(useRealEstateReviewVoteButtons).mockReturnValue({
      ...mockHookReturn,
      userVote: VoteType.DISLIKE,
    });

    render(<RealEstateReviewVoteButtons {...defaultProps} />);

    expect(VoteButtons).toHaveBeenCalledWith(
      expect.objectContaining({ userVote: VoteType.DISLIKE }),
      undefined
    );
  });
});
