import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: vi.fn(),
}));

const mockCreateUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockUpdateUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));
const mockDeleteUseCase = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../../application', () => ({
  createCreateRealEstateReviewUseCase: mockCreateUseCase,
  createUpdateRealEstateReviewUseCase: mockUpdateUseCase,
  createDeleteRealEstateReviewUseCase: mockDeleteUseCase,
}));

vi.mock('../../infrastructure', () => ({
  SupabaseRealEstateCommandRepository: vi.fn(),
}));

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import {
  createRealEstateReviewAction,
  updateRealEstateReviewAction,
  deleteRealEstateReviewAction,
} from '../real-estate-review.actions';

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

describe('createRealEstateReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('creates a real estate review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ id: 'review-1' });
    mockCreateUseCase.mockReturnValue(useCase);

    const input = { realEstateId: 'uuid-1234', rating: 4, comment: 'Good experience overall' };
    const result = await createRealEstateReviewAction(input);

    expect(result).toEqual({ id: 'review-1' });
    expect(useCase).toHaveBeenCalledWith(input);
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(createRealEstateReviewAction({})).rejects.toThrow('Debés iniciar sesión.');
    expect(mockCreateUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Creation failed'));
    mockCreateUseCase.mockReturnValue(useCase);

    await expect(createRealEstateReviewAction({ realEstateId: 'uuid-1234', rating: 4, comment: 'Good experience overall', title: 'A title' })).rejects.toThrow('Creation failed');
  });
});

describe('updateRealEstateReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('updates a real estate review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockUpdateUseCase.mockReturnValue(useCase);

    const result = await updateRealEstateReviewAction('review-1', { comment: 'Updated' });

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1', comment: 'Updated' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(updateRealEstateReviewAction('review-1', {})).rejects.toThrow('Debés iniciar sesión.');
    expect(mockUpdateUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Update failed'));
    mockUpdateUseCase.mockReturnValue(useCase);

    await expect(updateRealEstateReviewAction('review-1', {})).rejects.toThrow('Update failed');
  });
});

describe('deleteRealEstateReviewAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
  });

  it('deletes a real estate review when authenticated', async () => {
    const useCase = vi.fn().mockResolvedValue({ success: true });
    mockDeleteUseCase.mockReturnValue(useCase);

    const result = await deleteRealEstateReviewAction('review-1');

    expect(result).toEqual({ success: true });
    expect(useCase).toHaveBeenCalledWith({ reviewId: 'review-1' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(deleteRealEstateReviewAction('review-1')).rejects.toThrow('Debés iniciar sesión.');
    expect(mockDeleteUseCase).not.toHaveBeenCalled();
  });

  it('propagates use case errors', async () => {
    const useCase = vi.fn().mockRejectedValue(new Error('Delete failed'));
    mockDeleteUseCase.mockReturnValue(useCase);

    await expect(deleteRealEstateReviewAction('review-1')).rejects.toThrow('Delete failed');
  });
});
