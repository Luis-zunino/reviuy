import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockCreateBrowserClient = vi.fn(() => ({ from: vi.fn() }));

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateBrowserClient,
}));

describe('Supabase client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('creates client with env vars', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { createClient } = await import('../client');

    const client = createClient();
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    );
    expect(client).toBeDefined();
  });

  it('creates singleton supabaseClient', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { supabaseClient, createClient } = await import('../client');

    expect(mockCreateBrowserClient).toHaveBeenCalled();
    expect(supabaseClient).toBeDefined();
    expect(createClient).toBeDefined();
  });
});
