import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockCreateServerClient = vi.fn();
const mockCookieStore = {
  getAll: vi.fn(() => []),
  set: vi.fn(),
};

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockCreateServerClient,
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

describe('createSupabaseServerClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  it('creates server client with cookie handling', async () => {
    const { createSupabaseServerClient } = await import('../server');

    await createSupabaseServerClient();

    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    );
  });

  it('passes cookies to getAll and setAll', async () => {
    const { createSupabaseServerClient } = await import('../server');

    await createSupabaseServerClient();

    const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies;

    const allCookies = cookiesConfig.getAll();
    expect(mockCookieStore.getAll).toHaveBeenCalled();
    expect(allCookies).toEqual([]);

    cookiesConfig.setAll([{ name: 'test', value: 'val', options: {} }]);
    expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'val', {});
  });
});
