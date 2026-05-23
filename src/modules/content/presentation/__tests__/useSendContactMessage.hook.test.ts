import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendContactMessage } from '../useSendContactMessage.hook';

const mockUseApiMutation = vi.hoisted(() => vi.fn(() => ({ mutate: vi.fn(), isLoading: false })));
vi.mock('@/shared/api', () => ({
  useApiMutation: mockUseApiMutation,
}));

describe('useSendContactMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useApiMutation with /api/contact', () => {
    renderHook(() => useSendContactMessage());

    expect(mockUseApiMutation).toHaveBeenCalledWith('/api/contact');
  });

  it('returns the mutation result from useApiMutation', () => {
    const mockResult = { mutate: vi.fn(), isLoading: true, error: null };
    mockUseApiMutation.mockReturnValue(mockResult);

    const { result } = renderHook(() => useSendContactMessage());

    expect(result.current).toEqual(mockResult);
  });
});
