// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReviewLikesButtons } from '../useReviewLikesButtons.hook';
import { useQueryClient } from '@tanstack/react-query';
import { useGetReviewVote, voteReviewAction } from '@/modules/property-reviews/presentation';
import { VoteType } from '@/types/vote-type';
import { toast } from 'sonner';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';

// Mock de dependencias externas
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@tanstack/react-query');
vi.mock('@/modules/property-reviews', () => ({
  createCheckUserReviewForAddressQuery: vi.fn(),
  SupabasePropertyReviewReadRepository: vi.fn(),
}));
vi.mock('@/modules/property-reviews/presentation', () => ({
  useGetReviewVote: vi.fn(),
  voteReviewAction: vi.fn(),
}));
vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
  },
}));
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}));

// Tests)

describe('useReviewLikesButtons', () => {
  const mockReviewId = 'review-123';
  const mockRefetch = vi.fn();
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Configuración del mock de QueryClient
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as any);
  });

  describe('Estado Inicial y Tooltips', () => {
    it('debe retornar el estado neutro cuando no hay voto del usuario', () => {
      vi.mocked(useGetReviewVote).mockReturnValue({
        data: null,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() => useReviewLikesButtons({ id: mockReviewId }));

      expect(result.current.userVote).toBe(VoteType.NONE);
      expect(result.current.getLikeTooltip()).toBe('Marcar como útil');
      expect(result.current.getDislikeTooltip()).toBe('Marcar como no útil');
    });

    it('debe retornar el tooltip correcto cuando el usuario ya dio LIKE', () => {
      vi.mocked(useGetReviewVote).mockReturnValue({
        data: VoteType.LIKE,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() => useReviewLikesButtons({ id: mockReviewId }));

      expect(result.current.userVote).toBe(VoteType.LIKE);
      expect(result.current.getLikeTooltip()).toBe('Ya votaste útil');
    });

    it('debe retornar el tooltip correcto cuando el usuario ya dio DISLIKE', () => {
      vi.mocked(useGetReviewVote).mockReturnValue({
        data: VoteType.DISLIKE,
        refetch: mockRefetch,
      } as any);

      const { result } = renderHook(() => useReviewLikesButtons({ id: mockReviewId }));

      expect(result.current.userVote).toBe(VoteType.DISLIKE);
      expect(result.current.getDislikeTooltip()).toBe('Ya votaste no útil');
    });
  });

  describe('Acción addVote', () => {
    it('debe ejecutar voteAction y refrescar datos en caso de éxito', async () => {
      vi.mocked(useGetReviewVote).mockReturnValue({
        data: VoteType.NONE,
        refetch: mockRefetch,
      } as any);
      vi.mocked(voteReviewAction).mockResolvedValue({ success: true, message: 'Votado' });

      const { result } = renderHook(() => useReviewLikesButtons({ id: mockReviewId }));

      await act(async () => {
        await result.current.addVote(VoteType.LIKE);
      });

      expect(voteReviewAction).toHaveBeenCalledWith(mockReviewId, VoteType.LIKE, '/');
      expect(mockRefetch).toHaveBeenCalled();
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: [REVIEW_KEYS.getReviewById, mockReviewId],
      });
    });

    it('debe mostrar un toast de advertencia cuando la Server Action falla', async () => {
      const mockError = new Error('Error de conexión');
      vi.mocked(useGetReviewVote).mockReturnValue({ data: null, refetch: mockRefetch } as any);
      vi.mocked(voteReviewAction).mockRejectedValue(mockError);

      const { result } = renderHook(() => useReviewLikesButtons({ id: mockReviewId }));

      await act(async () => {
        await result.current.addVote(VoteType.DISLIKE);
      });

      expect(toast.warning).toHaveBeenCalledWith('Error de conexión');
    });
  });
});
