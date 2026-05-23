import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReportRealEstate, useHasUserReportedRealEstate } from '../reportRealEstate.hook';
import { useAuthMutation } from '@/shared/auth/useAuthMutation.hook';
import { useQuery } from '@tanstack/react-query';
import { reportRealEstateAction } from '@/modules/moderation/presentation';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));
vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: vi.fn(({ mutationFn }) => ({
    mutate: mutationFn,
    mutateAsync: mutationFn,
    isPending: false,
    data: null,
    error: null,
  })),
}));
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates', () => ({
  SupabaseRealEstateReadRepository: vi.fn(),
  createHasUserReportedRealEstateQuery: vi.fn(() => vi.fn()),
}));
vi.mock('@/modules/moderation/presentation', () => ({
  reportRealEstateAction: vi.fn(),
}));

describe('useReportRealEstate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useAuthMutation', () => {
    renderHook(() => useReportRealEstate());

    expect(useAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
      })
    );
  });

  it('debe retornar el objeto de mutación', () => {
    const { result } = renderHook(() => useReportRealEstate());

    expect(result.current).toHaveProperty('mutate');
    expect(result.current.isPending).toBe(false);
  });

  it('debe llamar a reportRealEstateAction al mutar', async () => {
    const { result } = renderHook(() => useReportRealEstate());

    const input = { realEstateId: 're-123', reason: 'spam' };
    await result.current.mutateAsync(input);

    expect(reportRealEstateAction).toHaveBeenCalledWith(input);
  });
});

describe('useHasUserReportedRealEstate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useQuery con los parámetros correctos', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useHasUserReportedRealEstate('real-estate-123'));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['has-user-reported-real-estate', 'real-estate-123'],
        enabled: true,
        staleTime: 5 * 60 * 1000,
      })
    );
  });

  it('debe deshabilitar la query cuando no hay realEstateId', () => {
    vi.mocked(useQuery).mockReturnValue({ data: null, isLoading: false } as any);

    renderHook(() => useHasUserReportedRealEstate(undefined));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('debe retornar el estado de reporte', () => {
    vi.mocked(useQuery).mockReturnValue({ data: true, isLoading: false } as any);

    const { result } = renderHook(() =>
      useHasUserReportedRealEstate('real-estate-123')
    );

    expect(result.current.data).toBe(true);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);

    renderHook(() => useHasUserReportedRealEstate('real-estate-123'));

    const qf = (useQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf();

    expect(result).toBeUndefined();
  });
});
