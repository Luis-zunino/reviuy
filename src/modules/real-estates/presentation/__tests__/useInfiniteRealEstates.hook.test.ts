import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInfiniteRealEstates } from '../useInfiniteRealEstates.hook';
import { useInfiniteQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: vi.fn(),
}));
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates', () => ({
  SupabaseRealEstateReadRepository: vi.fn(),
  createGetAllRealEstatesPaginatedQuery: vi.fn(() => vi.fn()),
}));

describe('useInfiniteRealEstates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a useInfiniteQuery con los parámetros correctos', () => {
    vi.mocked(useInfiniteQuery).mockReturnValue({
      data: { pages: [], pageParams: [] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isLoading: false,
    } as any);

    renderHook(() => useInfiniteRealEstates({}));

    expect(useInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['realEstates', 'infinite', {}],
        initialPageParam: 0,
        getNextPageParam: expect.any(Function),
      })
    );
  });

  it('debe pasar search y rating como props', () => {
    vi.mocked(useInfiniteQuery).mockReturnValue({
      data: { pages: [], pageParams: [] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isLoading: false,
    } as any);

    renderHook(() => useInfiniteRealEstates({ search: 'test', rating: 4 }));

    expect(useInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['realEstates', 'infinite', { search: 'test', rating: 4 }],
      })
    );
  });

  it('debe retornar nextOffset como nextPageParam', () => {
    const getNextPageParam = vi.fn(
      (lastPage: { data: string[]; nextOffset: number | null }) => lastPage.nextOffset ?? undefined
    );

    const lastPage = { data: ['item1'], nextOffset: 10 };
    const result = getNextPageParam(lastPage);

    expect(result).toBe(10);
  });

  it('debe retornar undefined cuando nextOffset es null', () => {
    const getNextPageParam = vi.fn(
      (lastPage: { data: string[]; nextOffset: number | null }) => lastPage.nextOffset ?? undefined
    );

    const lastPage = { data: ['item1'], nextOffset: null };
    const result = getNextPageParam(lastPage);

    expect(result).toBeUndefined();
  });

  it('debe retornar los datos paginados', () => {
    const mockPages = [{ data: [{ id: '1' }], nextOffset: null }];
    vi.mocked(useInfiniteQuery).mockReturnValue({
      data: { pages: mockPages, pageParams: [0] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useInfiniteRealEstates({}));

    expect(result.current.data?.pages).toEqual(mockPages);
  });

  it('invokes queryFn', async () => {
    vi.mocked(useInfiniteQuery).mockReturnValue({
      data: { pages: [], pageParams: [] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isLoading: true,
    } as any);

    renderHook(() => useInfiniteRealEstates({}));

    const qf = (useInfiniteQuery as any).mock.calls.at(-1)[0].queryFn;
    const result = await qf({ pageParam: 0 });

    expect(result).toBeUndefined();
  });

  it('getNextPageParam returns nextOffset from last page', () => {
    vi.mocked(useInfiniteQuery).mockReturnValue({
      data: { pages: [], pageParams: [] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isLoading: false,
    } as any);

    renderHook(() => useInfiniteRealEstates({}));

    const getNextPageParam = (useInfiniteQuery as any).mock.calls.at(-1)[0].getNextPageParam;

    expect(getNextPageParam({ data: ['item1'], nextOffset: 5 })).toBe(5);
    expect(getNextPageParam({ data: ['item1'], nextOffset: null })).toBeUndefined();
  });
});
