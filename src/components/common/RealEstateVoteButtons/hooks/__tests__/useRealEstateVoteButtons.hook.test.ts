import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRealEstateVoteButtons } from '../useRealEstateVoteButtons.hook';
import { useVoteRealEstate } from '@/modules/real-estates/presentation';
import { VoteType } from '@/types';
import { toast } from 'sonner';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
  supabaseClient: {},
}));
vi.mock('@/modules/real-estates/presentation');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useRealEstateVoteButtons', () => {
  const mockRealEstateId = 'real-estate-123';
  const mockRefetchRealEstate = vi.fn();
  const mockMutateAsync = vi.fn();

  const defaultProps = {
    realEstateId: mockRealEstateId,
    refetchRealEstate: mockRefetchRealEstate,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useVoteRealEstate).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it('debe retornar el estado inicial correctamente', () => {
    const { result } = renderHook(() => useRealEstateVoteButtons(defaultProps));

    expect(result.current.isPending).toBe(false);
    expect(result.current.handleVote).toBeDefined();
  });

  it('debe ejecutar mutateAsync y refetchear al votar exitosamente', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined);
    mockRefetchRealEstate.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRealEstateVoteButtons(defaultProps));

    await act(async () => {
      await result.current.handleVote(VoteType.LIKE);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      realEstateId: mockRealEstateId,
      voteType: VoteType.LIKE,
    });
    expect(mockRefetchRealEstate).toHaveBeenCalled();
  });

  it('debe mostrar toast error cuando mutateAsync falla', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Error'));

    const { result } = renderHook(() => useRealEstateVoteButtons(defaultProps));

    await act(async () => {
      await result.current.handleVote(VoteType.DISLIKE);
    });

    expect(toast.error).toHaveBeenCalledWith('Error inesperado', {
      description: 'No se pudo actualizar la inmobiliaria. Inténtalo de nuevo.',
    });
    expect(mockRefetchRealEstate).not.toHaveBeenCalled();
  });
});
