import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: vi.fn(),
}));

const mockCreateUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockUpdateUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockDeleteUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../../application', () => ({
  createCreatePropertyReviewUseCase: mockCreateUseCase,
  createUpdatePropertyReviewUseCase: mockUpdateUseCase,
  createDeletePropertyReviewUseCase: mockDeleteUseCase,
}));

vi.mock('../../infrastructure', () => ({
  SupabasePropertyReviewCommandRepository: vi.fn(),
}));

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import {
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
} from '../review.actions';

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

describe('createReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('creates a review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ id: 'review-1' });
    mockCreateUseCase.mockReturnValue(useCase);

    const input = { data: { title: 'Great place to stay', description: 'Loved the experience here', rating: 5 } };
    const result = await createReviewAction(input as any);

    expect(result).toEqual({ id: 'review-1' });
    expect(useCase).toHaveBeenCalledWith(input);
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(createReviewAction({} as any)).rejects.toThrow('Debés iniciar sesión.');
    expect(mockCreateUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Use case failed'));
    mockCreateUseCase.mockReturnValue(useCase);

    await expect(createReviewAction({ data: { title: 'Great place', description: 'Loved it here! Very nice.', rating: 5 } } as any)).rejects.toThrow('Use case failed');
  });
});

describe('updateReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('updates a review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockUpdateUseCase.mockReturnValue(useCase);

    const result = await updateReviewAction('review-1', { title: 'Updated title' });

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1', title: 'Updated title' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(updateReviewAction('review-1', {})).rejects.toThrow('Debés iniciar sesión.');
    expect(mockUpdateUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Update failed'));
    mockUpdateUseCase.mockReturnValue(useCase);

    await expect(updateReviewAction('review-1', {})).rejects.toThrow('Update failed');
  });
});

describe('deleteReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('deletes a review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockDeleteUseCase.mockReturnValue(useCase);

    const result = await deleteReviewAction('review-1');

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(deleteReviewAction('review-1')).rejects.toThrow('Debés iniciar sesión.');
    expect(mockDeleteUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Delete failed'));
    mockDeleteUseCase.mockReturnValue(useCase);

    await expect(deleteReviewAction('review-1')).rejects.toThrow('Delete failed');
  });
});
