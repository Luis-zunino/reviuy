import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGetUserRealEstateVote } from '../getUserRealEstateVote.hook';
import { useQuery } from '@tanstack/react-query';
import { VoteType } from '@/types/vote-type';
import { REAL_ESTATE_REVIEWS } from '@/constants/query-keys.constant';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
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

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    renderHook(() => useGetUserRealEstateVote({ realEstateId: 'real-estate-123' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [REAL_ESTATE_REVIEWS.getUserRealEstateVote, 'real-estate-123'],
        enabled: true,
      })
    );
  });

  it('debe deshabilitar la query cuando realEstateId está vacío', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    renderHook(() => useGetUserRealEstateVote({ realEstateId: '' }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('debe retornar el voto del usuario cuando existe', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: VoteType.LIKE,
      isLoading: false,
    } as any);

    const { result } = renderHook(() =>
      useGetUserRealEstateVote({ realEstateId: 'real-estate-123' })
    );

    expect(result.current.data).toBe(VoteType.LIKE);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useGetUserRealEstateVote({ realEstateId: 'real-estate-123' }));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
