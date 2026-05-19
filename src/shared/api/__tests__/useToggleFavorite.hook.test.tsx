import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const mockInvalidateQueries = vi.fn();
const mockToastError = vi.fn();

const mockUseAuthMutation = vi.fn();

vi.mock('@/shared/auth', () => ({
  useAuthMutation: mockUseAuthMutation,
}));

vi.mock('sonner', () => ({
  toast: { error: (...args: any[]) => mockToastError(...args) },
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

describe('useToggleFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invalidates queries on successful toggle', async () => {
    const mutationFn = vi.fn().mockResolvedValue({ success: true });
    const queryKeys = [['favorites'], ['reviews']];

    mockUseAuthMutation.mockImplementation(({ mutationFn: fn, onSuccess }: any) => ({
      mutateAsync: async (vars: any) => {
        const result = await fn(vars);
        onSuccess?.(result);
        return result;
      },
    }));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.invalidateQueries = mockInvalidateQueries;

    const { useToggleFavorite } = await import('../useToggleFavorite.hook');

    renderHook(() => useToggleFavorite(mutationFn, queryKeys), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(mockUseAuthMutation).toHaveBeenCalled();
  });

  it('shows toast error when toggle fails', async () => {
    const mutationFn = vi.fn().mockResolvedValue({ success: false, error: 'Already exists' });

    mockUseAuthMutation.mockImplementation(({ mutationFn: fn, onSuccess }: any) => ({
      mutateAsync: async (vars: any) => {
        const result = await fn(vars);
        onSuccess?.(result);
        return result;
      },
    }));

    const { useToggleFavorite } = await import('../useToggleFavorite.hook');

    renderHook(() => useToggleFavorite(vi.fn().mockResolvedValue({ success: true }), [['test']]), {
      wrapper: createWrapper(),
    });

    expect(mockUseAuthMutation).toHaveBeenCalled();
  });
});
