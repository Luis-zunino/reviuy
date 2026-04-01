import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createCreateRealEstateUseCase } from '../create-real-estate.use-case';
import { RealEstateCommandRepository } from '@/modules/real-estates/domain';

vi.mock('@/lib', () => ({
  createError: (code: string, message?: string) => new Error(message ?? code),
}));

describe('createCreateRealEstateUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: ReturnType<typeof vi.fn>;
  let rateLimit: ReturnType<typeof vi.fn>;
  let createRealEstate: ReturnType<typeof vi.fn>;

  const repository = (): RealEstateCommandRepository => ({
    create: createRealEstate,
    vote: vi.fn(),
    toggleFavorite: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    voteReview: vi.fn(),
  });

  const validInput = {
    real_estate_name: 'Inmobiliaria Central',
  };

  beforeEach(() => {
    getCurrentUserId = vi.fn();
    rateLimit = vi.fn().mockResolvedValue(undefined);
    createRealEstate = vi.fn();

    dependencies = {
      getCurrentUserId,
      rateLimit,
      repository: repository(),
    };
  });

  it('throws UNAUTHORIZED when the user is missing', async () => {
    getCurrentUserId.mockResolvedValueOnce(null);
    const execute = createCreateRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('UNAUTHORIZED');
    expect(rateLimit).not.toHaveBeenCalled();
  });

  it('applies the write rate limit key', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createRealEstate.mockResolvedValueOnce({ id: 're-1' });
    const execute = createCreateRealEstateUseCase(dependencies);

    await execute(validInput);

    expect(rateLimit).toHaveBeenCalledWith('create-real-estate:user-123', 'write');
  });

  it('throws VALIDATION_ERROR for invalid names', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const execute = createCreateRealEstateUseCase(dependencies);

    await expect(
      execute({
        real_estate_name: 'abc',
      })
    ).rejects.toThrow('real_estate_name:');

    expect(createRealEstate).not.toHaveBeenCalled();
  });

  it('delegates valid input to the repository and returns its result', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    const repositoryResult = { id: 're-1', real_estate_name: 'Inmobiliaria Central' };
    createRealEstate.mockResolvedValueOnce(repositoryResult);
    const execute = createCreateRealEstateUseCase(dependencies);

    await expect(execute(validInput)).resolves.toEqual(repositoryResult);
    expect(createRealEstate).toHaveBeenCalledWith(validInput);
  });

  it('propagates repository failures', async () => {
    getCurrentUserId.mockResolvedValueOnce('user-123');
    createRealEstate.mockRejectedValueOnce(new Error('Database error'));
    const execute = createCreateRealEstateUseCase(dependencies);

    await expect(execute(validInput)).rejects.toThrow('Database error');
  });
});
