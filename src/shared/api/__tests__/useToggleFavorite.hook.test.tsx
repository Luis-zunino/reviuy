// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useToggleFavorite } from '../useToggleFavorite.hook';

const mockInvalidateQueries = vi.fn();
const mockToastError = vi.fn();

let capturedOnSuccess: ((data: any) => void) | null = null;
let capturedOnError: ((error: Error) => void) | null = null;

const mockUseAuthMutation = vi.hoisted(() => vi.fn());

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: mockUseAuthMutation,
}));

vi.mock('sonner', () => ({
  toast: { error: (...args: any[]) => mockToastError(...args) },
}));

function createWrapper(queryClient?: QueryClient) {
  const qc = queryClient ?? new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'Wrapper';
  return Wrapper;
}

describe('useToggleFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnSuccess = null;
    capturedOnError = null;
    mockUseAuthMutation.mockImplementation((config: any) => {
      capturedOnSuccess = config.onSuccess ?? null;
      capturedOnError = config.onError ?? null;
      return { mutateAsync: vi.fn(), mutate: vi.fn() };
    });
  });

  it('calls useAuthMutation with the mutation function', () => {
    const mutationFn = vi.fn();
    const queryKeys = [['favorites']];

    renderHook(() => useToggleFavorite(mutationFn, queryKeys), {
      wrapper: createWrapper(),
    });

    expect(mockUseAuthMutation).toHaveBeenCalledWith(expect.objectContaining({ mutationFn }));
  });

  it('invalidates queries on successful toggle', () => {
    const mutationFn = vi.fn();
    const queryKeys = [['favorites'], ['reviews']];
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.invalidateQueries = mockInvalidateQueries;

    renderHook(() => useToggleFavorite(mutationFn, queryKeys), {
      wrapper: createWrapper(queryClient),
    });

    capturedOnSuccess!({ success: true });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['favorites'] });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['reviews'] });
  });

  it('shows toast error when toggle succeeds with error', () => {
    const mutationFn = vi.fn();
    const errorMessage = 'Custom error';

    renderHook(() => useToggleFavorite(mutationFn, [['test']], errorMessage), {
      wrapper: createWrapper(),
    });

    capturedOnSuccess!({ success: false, error: 'Server error' });

    expect(mockToastError).toHaveBeenCalledWith('Error', {
      description: 'Server error',
    });
  });

  it('falls back to errorMessage when data.error is missing', () => {
    const mutationFn = vi.fn();
    const errorMessage = 'Fallback error';

    renderHook(() => useToggleFavorite(mutationFn, [['test']], errorMessage), {
      wrapper: createWrapper(),
    });

    capturedOnSuccess!({ success: false });

    expect(mockToastError).toHaveBeenCalledWith('Error', {
      description: 'Fallback error',
    });
  });

  it('shows toast with default message when no error info', () => {
    const mutationFn = vi.fn();

    renderHook(() => useToggleFavorite(mutationFn, [['test']]), {
      wrapper: createWrapper(),
    });

    capturedOnSuccess!({ success: false });

    expect(mockToastError).toHaveBeenCalledWith('Error', {
      description: 'No se pudo actualizar favoritos',
    });
  });

  it('shows toast on mutation error', () => {
    const mutationFn = vi.fn();

    renderHook(() => useToggleFavorite(mutationFn, [['test']]), {
      wrapper: createWrapper(),
    });

    capturedOnError!(new Error('Network error'));

    expect(mockToastError).toHaveBeenCalledWith('Error', {
      description: 'Network error',
    });
  });

  it('uses errorMessage on mutation error when error has no message', () => {
    const mutationFn = vi.fn();
    const errorMessage = 'Custom fallback';

    renderHook(() => useToggleFavorite(mutationFn, [['test']], errorMessage), {
      wrapper: createWrapper(),
    });

    capturedOnError!(new Error());

    expect(mockToastError).toHaveBeenCalledWith('Error', {
      description: 'Custom fallback',
    });
  });
});
