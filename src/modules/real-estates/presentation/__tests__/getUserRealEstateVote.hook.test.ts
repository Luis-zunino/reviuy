// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetUserRealEstateVote } from '../getUserRealEstateVote.hook';

import { VoteType } from '@/types/vote-type';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';
const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates', () => ({
  SupabaseRealEstateReadRepository: vi.fn(),
  createGetUserRealEstateVoteQuery: vi.fn(() => vi.fn()),
}));

describe('useGetUserRealEstateVote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a mockUseQuery con los parámetros correctos', () => {
    vi.mocked(mockUseQuery).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    renderHook(() => useGetUserRealEstateVote({ realEstateId: 'real-estate-123' }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateVote, 'real-estate-123'],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando realEstateId está vacío', () => {
    vi.mocked(mockUseQuery).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    renderHook(() => useGetUserRealEstateVote({ realEstateId: '' }));

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('debe retornar el voto del usuario cuando existe', () => {
    vi.mocked(mockUseQuery).mockReturnValue({
      data: VoteType.LIKE,
      isLoading: false,
    } as any);

    const { result } = renderHook(() =>
      useGetUserRealEstateVote({ realEstateId: 'real-estate-123' })
    );

    expect(result.current.data).toBe(VoteType.LIKE);
  });

  it('invokes queryFn', async () => {
    vi.mocked(mockUseQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetUserRealEstateVote({ realEstateId: 'real-estate-123' }));

    const qf = (mockUseQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
