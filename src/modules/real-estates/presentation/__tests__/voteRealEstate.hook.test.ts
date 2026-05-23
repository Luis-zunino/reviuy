import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVoteRealEstate } from '../voteRealEstate.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { voteRealEstateAction } from '@/modules/real-estates/presentation';
import { VoteType } from '@/types/vote-type';

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));
vi.mock('@/modules/real-estates/presentation', () => ({
  voteRealEstateAction: vi.fn(),
}));

describe('useVoteRealEstate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation con la configuración esperada', () => {
    renderHook(() => useVoteRealEstate());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
        invalidateQueryKeys: [['getUserRealEstateVote']],
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useVoteRealEstate());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a voteRealEstateAction al mutar', async () => {
    const { result } = renderHook(() => useVoteRealEstate());

    const input = { realEstateId: 're-123', voteType: VoteType.LIKE };
    await result.current.mutateAsync(input);

    expect(voteRealEstateAction).toHaveBeenCalledWith('re-123', VoteType.LIKE);
  });
});
