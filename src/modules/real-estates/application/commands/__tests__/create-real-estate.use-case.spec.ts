import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { RealEstateCommandoBase } from '../interfaces';
import { createCreateRealEstateUseCase } from '../create-real-estate.use-case';
import {
  RealEstateCommandRepository,
  type CreateRealEstateInput,
  type RealEstate,
} from '@/modules/real-estates/domain';

vi.mock('@/lib', () => ({
  createError: (code: string, message?: string) => new Error(message ?? code),
}));

// Mock next/font/google as it's not meant to run in a test environment
vi.mock('next/font/google', () => ({
  Manrope: () => ({
    className: 'mock-manrope-class',
    style: {
      fontFamily: 'mock-manrope',
    },
  }),
  Playfair_Display: () => ({
    className: 'mock-playfair-class',
    style: {
      fontFamily: 'mock-playfair',
    },
  }),
}));

// Helper para crear un objeto RealEstate mock completo con valores por defecto
const createMockRealEstate = (overrides?: Partial<RealEstate>): RealEstate => ({
  id: '550e8400-e29b-41d4-a716-446655440000', // UUID por defecto
  created_at: new Date().toISOString(),
  created_by: 'mock-user-id',
  deleted_at: null,
  description: 'Mock description for real estate',
  name: 'Mock Real Estate Name',
  rating: 0,
  review_count: 0,
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe('createCreateRealEstateUseCase', () => {
  let dependencies: RealEstateCommandoBase;
  let getCurrentUserId: Mock<() => Promise<string | null>>;
  let rateLimit: Mock<(key: string, action: string) => Promise<void>>;
  let createRealEstate: Mock<(input: CreateRealEstateInput) => Promise<RealEstate>>;

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
    createRealEstate = vi.fn().mockResolvedValue(createMockRealEstate()); // Default mock value

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
    createRealEstate.mockResolvedValueOnce(createMockRealEstate({ id: 're-1' }));
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
    // El resultado del repositorio también debe ser un objeto RealEstate completo
    const repositoryResult: RealEstate = createMockRealEstate({
      id: 're-1',
      created_by: 'user-123',
      name: 'Inmobiliaria Central', // Asumiendo que real_estate_name se mapea a name
      // Otras propiedades por defecto de createMockRealEstate
    });

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
