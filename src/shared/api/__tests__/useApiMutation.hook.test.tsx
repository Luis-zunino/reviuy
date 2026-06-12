// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const mockMutateAsync = vi.fn();
const mockUseAuthMutation = vi.fn(() => ({ mutateAsync: mockMutateAsync }));

vi.mock('@/shared/auth/useAuthMutation.hook', () => ({
  useAuthMutation: mockUseAuthMutation,
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

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useAuthMutation with fetch to the given endpoint', async () => {
    const { useApiMutation } = await import('../useApiMutation.hook');

    renderHook(() => useApiMutation('/api/contact'), {
      wrapper: createWrapper(),
    });

    expect(mockUseAuthMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
      })
    );
  });

  it('sends POST request with JSON payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    mockUseAuthMutation.mockImplementation((({ mutationFn }: any) => ({
      mutateAsync: async (payload: any) => mutationFn(payload),
    })) as any);

    const { useApiMutation } = await import('../useApiMutation.hook');

    const { result } = renderHook(() => useApiMutation('/api/contact'), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({ name: 'test', message: 'hello' });

    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test', message: 'hello' }),
    });
    expect(response).toEqual({ success: true });
  });

  it('throws error message from server response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    mockUseAuthMutation.mockImplementation((({ mutationFn }: any) => ({
      mutateAsync: async (payload: any) => mutationFn(payload),
    })) as any);

    const { useApiMutation } = await import('../useApiMutation.hook');

    const { result } = renderHook(() => useApiMutation('/api/contact'), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync({})).rejects.toThrow('Server error');
  });

  it('falls back to errorMessage when server has no error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    mockUseAuthMutation.mockImplementation((({ mutationFn }: any) => ({
      mutateAsync: async (payload: any) => mutationFn(payload),
    })) as any);

    const { useApiMutation } = await import('../useApiMutation.hook');

    const { result } = renderHook(() => useApiMutation('/api/contact', 'Default error message'), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync({})).rejects.toThrow('Default error message');
  });
});
