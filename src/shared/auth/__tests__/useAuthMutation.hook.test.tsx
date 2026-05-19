import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const mockVerifyAuthentication = vi.fn();

const mockUseMutation = vi.hoisted(() => vi.fn());

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return { ...actual, useMutation: mockUseMutation };
});

vi.mock('@/modules/profiles/presentation', () => ({
  useVerifyAuthentication: mockVerifyAuthentication,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'Wrapper';
  return Wrapper;
}

describe('useAuthMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyAuthentication.mockReturnValue({ data: { userId: 'user-1' }, error: null });
    mockUseMutation.mockImplementation(({ mutationFn, ...rest }: any) => {
      const mockMutate = async (vars: any) => {
        try {
          const result = await mutationFn(vars);
          rest?.onSuccess?.(result, vars, undefined);
          return result;
        } catch (e) {
          rest?.onError?.(e, vars, undefined, undefined);
          throw e;
        }
      };
      return {
        mutate: mockMutate,
        mutateAsync: mockMutate,
        data: null,
        error: null,
        isPending: false,
      };
    });
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
});
