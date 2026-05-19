import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
};
const mockCreateSupabaseServerClient = vi.fn().mockResolvedValue(mockSupabase);
const mockWithRateLimit = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: mockCreateSupabaseServerClient,
}));

vi.mock('@/lib', () => ({
  withRateLimit: mockWithRateLimit,
}));

describe('createServerActionDeps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns supabase, getCurrentUserId and rateLimit', async () => {
    const { createServerActionDeps } = await import('../create-server-action-deps.util');

    const deps = await createServerActionDeps();

    expect(deps.supabase).toBe(mockSupabase);
    expect(deps.getCurrentUserId).toBeDefined();
    expect(deps.rateLimit).toBeDefined();
    expect(mockCreateSupabaseServerClient).toHaveBeenCalledTimes(1);
  });

  it('getCurrentUserId returns user id when user exists', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    const { createServerActionDeps } = await import('../create-server-action-deps.util');

    const deps = await createServerActionDeps();
    const userId = await deps.getCurrentUserId();

    expect(userId).toBe('user-123');
    expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
  });

  it('getCurrentUserId returns null when no user', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const { createServerActionDeps } = await import('../create-server-action-deps.util');

    const deps = await createServerActionDeps();
    const userId = await deps.getCurrentUserId();

    expect(userId).toBeNull();
  });

  it('rateLimit calls withRateLimit with key and scope', async () => {
    const { createServerActionDeps } = await import('../create-server-action-deps.util');

    const deps = await createServerActionDeps();
    await deps.rateLimit('user-1', 'vote');

    expect(mockWithRateLimit).toHaveBeenCalledWith('user-1', 'vote');
  });
});
