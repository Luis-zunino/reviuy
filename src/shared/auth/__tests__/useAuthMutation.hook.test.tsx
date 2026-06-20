// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const mockVerifyAuthentication = vi.fn();

let capturedOnSuccess: ((data: any, vars: any, context: any) => void) | null = null;

const mockUseMutation = vi.hoisted(() => vi.fn());

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return { ...actual, useMutation: mockUseMutation };
});

vi.mock('@/modules/profiles/presentation', () => ({
  useVerifyAuthentication: mockVerifyAuthentication,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

function createWrapper(queryClient?: QueryClient) {
  const qc = queryClient ?? new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'Wrapper';
  return Wrapper;
}

function captureCallbacks() {
  mockUseMutation.mockImplementation(({ mutationFn, onSuccess }: any) => {
    capturedOnSuccess = onSuccess ?? null;
    return {
      mutate: async (vars: any) => {
        const result = await mutationFn(vars);
        onSuccess?.(result, vars, undefined);
        return result;
      },
      mutateAsync: async (vars: any) => {
        const result = await mutationFn(vars);
        onSuccess?.(result, vars, undefined);
        return result;
      },
      data: null,
      error: null,
      isPending: false,
    };
  });
}

describe('useAuthMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnSuccess = null;
    mockVerifyAuthentication.mockReturnValue({ data: { userId: 'user-1' }, error: null });
    captureCallbacks();
  });

  it('throws auth error when user is not authenticated', async () => {
    mockVerifyAuthentication.mockReturnValue({ data: null, error: new Error('No auth') });

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () => useAuthMutation({ mutationFn: vi.fn().mockResolvedValue('ok') }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow(
      'Debes iniciar sesión para realizar esta acción'
    );
  });

  it('calls mutationFn when authenticated', async () => {
    const mutationFn = vi.fn().mockResolvedValue('success');

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(() => useAuthMutation({ mutationFn }), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync('test-data');
    expect(mutationFn).toHaveBeenCalledWith('test-data');
    expect(response).toBe('success');
  });

  it('uses custom auth error message', async () => {
    mockVerifyAuthentication.mockReturnValue({ data: null, error: new Error('No auth') });

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () => useAuthMutation({ mutationFn: vi.fn(), authErrorMessage: 'Custom auth error' }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow('Custom auth error');
  });

  it('handles mutation error with errorToastMessage string', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('original error'));

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () =>
        useAuthMutation({
          mutationFn,
          errorToastMessage: 'Custom error message',
          showErrorToast: false,
        }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow('original error');
  });

  it('shows toast with errorToastMessage as function', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('db error'));

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () =>
        useAuthMutation({
          mutationFn,
          errorToastMessage: (e: Error) => `Mapped: ${e.message}`,
        }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow('db error');
  });

  it('shows toast with errorToastMessage as string', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('db error'));

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () =>
        useAuthMutation({
          mutationFn,
          errorToastMessage: 'Custom string message',
        }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow('db error');
  });

  it('falls back to UNKNOWN_ERROR when error has no message', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error());

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () =>
        useAuthMutation({
          mutationFn,
        }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow('');
  });

  it('suppresses toast for NEXT_REDIRECT errors', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('NEXT_REDIRECT'));

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    const { result } = renderHook(
      () =>
        useAuthMutation({
          mutationFn,
          errorToastMessage: 'Should not appear',
        }),
      { wrapper: createWrapper() }
    );

    await expect(result.current.mutateAsync('test')).rejects.toThrow('NEXT_REDIRECT');
  });

  it('invalidates queries on success when invalidateQueryKeys is set', async () => {
    const mutationFn = vi.fn().mockResolvedValue('ok');
    const invalidateQueryKeys = [['reviews'], ['favorites']];
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { useAuthMutation } = await import('../useAuthMutation.hook');

    renderHook(
      () =>
        useAuthMutation({
          mutationFn,
          invalidateQueryKeys,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    capturedOnSuccess!('ok', {}, undefined);

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['reviews'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['favorites'] });
  });
});
