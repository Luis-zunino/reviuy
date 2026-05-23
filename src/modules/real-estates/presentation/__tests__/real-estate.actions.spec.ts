import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: vi.fn(),
}));

const mockCreateUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../../application', () => ({
  createCreateRealEstateUseCase: mockCreateUseCase,
}));

vi.mock('../../infrastructure', () => ({
  SupabaseRealEstateCommandRepository: vi.fn(),
}));

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import { createRealEstateAction } from '../real-estate.actions';

const mockDeps = (overrides = {}) => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    },
  },
  getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
  rateLimit: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('createRealEstateAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('creates a real estate when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ id: 'real-estate-1' });
    mockCreateUseCase.mockReturnValue(useCase);

    const input = { name: 'Inmobiliaria Centro', description: 'Real estate agency in the center' };
    const result = await createRealEstateAction(input as any);

    expect(result).toEqual({ id: 'real-estate-1' });
    expect(useCase).toHaveBeenCalledWith(input);
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(createRealEstateAction({} as any)).rejects.toThrow('Debés iniciar sesión.');
    expect(mockCreateUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Creation failed'));
    mockCreateUseCase.mockReturnValue(useCase);

    await expect(createRealEstateAction({ name: 'Test Agency' } as any)).rejects.toThrow('Creation failed');
  });
});
